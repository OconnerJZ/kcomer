import { useCallback, useState } from "react";
import { DEFAULT_CHECKOUT_FORM } from "@Features/checkout/model/checkout";

export const useCheckoutForm = (user) => {
  const [orderType, setOrderType] = useState("pickup");
  const [addressType, setAddressType] = useState("saved");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => DEFAULT_CHECKOUT_FORM(user));

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
  }, []);

  const handleNewAddressChange = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [field]: value,
      },
    }));
  }, []);

  const resetCheckout = useCallback(() => {
    setForm(DEFAULT_CHECKOUT_FORM(user));
    setOrderType("pickup");
    setAddressType("saved");
    setErrors({});
  }, [user]);

  return {
    form,
    setForm,
    orderType,
    setOrderType,
    addressType,
    setAddressType,
    errors,
    setErrors,
    handleChange,
    handleNewAddressChange,
    resetCheckout,
  };
};

export default useCheckoutForm;
