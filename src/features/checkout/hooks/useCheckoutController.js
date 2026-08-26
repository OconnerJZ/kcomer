import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useCart } from "@Features/cart/context/CartContext";
import { useOrders } from "@Features/orders/context/OrderContext";
import useCheckoutForm from "./useCheckoutForm";
import {
  buildOrderPayload,
  validateCheckout,
} from "../model/checkout";

export const useCheckoutController = (providedAddresses) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearBusiness,
  } = useCart();
  const { createOrder } = useOrders();

  const checkout = useCheckoutForm(user);
  const {
    form,
    orderType,
    addressType,
    setAddressType,
    setErrors,
    resetCheckout,
  } = checkout;

  const [activeTab, setActiveTab] = useState(0);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const addresses = useMemo(
    () => providedAddresses ?? user?.addresses ?? [],
    [providedAddresses, user?.addresses],
  );

  useEffect(() => {
    if (addresses.length === 0 && addressType === "saved") {
      setAddressType("new");
    }
  }, [addressType, addresses.length, setAddressType]);

  const businesses = useMemo(() => Object.keys(cart), [cart]);
  const currentBusinessId = businesses[activeTab] || null;
  const currentBusiness = currentBusinessId ? cart[currentBusinessId] : null;

  const changeTab = useCallback((newTab) => {
    setActiveTab(newTab);
  }, []);

  const changeQuantity = useCallback(
    (businessId, item, delta) => {
      const newQuantity = item.quantity + delta;

      if (newQuantity === 0) {
        removeFromCart(businessId, item.id);
        return;
      }

      addToCart({
        itemId: item.id,
        businessId,
        businessName: cart[businessId].businessName,
        paymentMethods: cart[businessId].paymentMethods || [],
        item: {
          ...item,
          quantity: newQuantity,
        },
      });
    },
    [addToCart, cart, removeFromCart],
  );

  const clearCurrentBusiness = useCallback(() => {
    if (!currentBusinessId) return;
    clearBusiness(currentBusinessId);
    setActiveTab((current) => Math.max(0, current - 1));
  }, [clearBusiness, currentBusinessId]);

  const openCheckout = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login/orden");
      return { success: false, reason: "unauthenticated" };
    }

    setCheckoutDialogOpen(true);
    return { success: true };
  }, [isAuthenticated, navigate]);

  const closeCheckout = useCallback(() => {
    setCheckoutDialogOpen(false);
  }, []);

  const confirmCheckout = useCallback(async () => {
    if (!currentBusinessId || !currentBusiness) {
      return { success: false, error: "No hay un negocio seleccionado" };
    }

    const validation = validateCheckout({
      form,
      orderType,
      addressType,
      currentBusiness,
    });

    setErrors(validation.errors);

    if (!validation.valid) {
      return {
        success: false,
        error: "Por favor completa todos los campos requeridos",
        errors: validation.errors,
      };
    }

    const payload = buildOrderPayload({
      businessId: currentBusinessId,
      business: currentBusiness,
      user,
      form,
      orderType,
      addressType,
      addresses,
    });

    const result = await createOrder(payload);

    if (!result?.success) {
      return result || { success: false, error: "Error al crear la orden" };
    }

    clearBusiness(currentBusinessId);
    closeCheckout();
    resetCheckout();
    navigate("/mis-ordenes");

    return result;
  }, [
    addressType,
    addresses,
    clearBusiness,
    closeCheckout,
    createOrder,
    currentBusiness,
    currentBusinessId,
    form,
    navigate,
    orderType,
    resetCheckout,
    setErrors,
    user,
  ]);

  return {
    user,
    isAuthenticated,
    cart,
    businesses,
    currentBusinessId,
    currentBusiness,
    activeTab,
    checkoutDialogOpen,
    addresses,
    ...checkout,
    changeTab,
    changeQuantity,
    clearCurrentBusiness,
    removeFromCart,
    openCheckout,
    closeCheckout,
    confirmCheckout,
  };
};

export default useCheckoutController;
