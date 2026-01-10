import { useState } from "react";

export const useOrderDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    order: null,
  });

  const openDialog = (order) => {
    setDialogState({ open: true, order });
  };

  const closeDialog = () => {
    setDialogState({ open: false, order: null });
  };

  return {
    isOpen: dialogState.open,
    order: dialogState.order,
    openDialog,
    closeDialog,
  };
};