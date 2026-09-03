import { useCallback, useState } from "react";

export const useOrderDialog = () => {
  const [dialogState, setDialogState] = useState({ open: false, order: null });

  const openDialog = useCallback((order) => setDialogState({ open: true, order }), []);
  const closeDialog = useCallback(() => setDialogState({ open: false, order: null }), []);

  return {
    isOpen: dialogState.open,
    order: dialogState.order,
    openDialog,
    closeDialog,
  };
};
