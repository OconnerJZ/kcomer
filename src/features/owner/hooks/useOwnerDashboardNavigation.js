import { useCallback, useState } from "react";

export const useOwnerDashboardNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [focusedOrderId, setFocusedOrderId] = useState(null);

  const selectBusiness = useCallback((businessId) => {
    setSelectedBusinessId(businessId);
    setFocusedOrderId(null);
  }, []);

  const navigateFromNotification = useCallback(({ businessId, orderId }) => {
    if (businessId != null) setSelectedBusinessId(businessId);
    setFocusedOrderId(orderId ?? null);
    setActiveTab(0);
  }, []);

  const clearFocusedOrder = useCallback(() => setFocusedOrderId(null), []);

  return {
    activeTab,
    selectedBusinessId,
    focusedOrderId,
    setActiveTab,
    selectBusiness,
    navigateFromNotification,
    clearFocusedOrder,
  };
};

export default useOwnerDashboardNavigation;
