import { useCallback, useState } from "react";
import { getNewestBusinessId } from "../model/ownerDashboard";

export const useBusinessRegistrationDialog = ({ refetchBusinesses, selectBusiness }) => {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  const handleBusinessCreated = useCallback(async () => {
    closeDialog();
    const result = await refetchBusinesses();
    const newestBusinessId = getNewestBusinessId(result);
    if (newestBusinessId != null) selectBusiness(newestBusinessId);
  }, [closeDialog, refetchBusinesses, selectBusiness]);

  return { open, openDialog, closeDialog, handleBusinessCreated };
};

export default useBusinessRegistrationDialog;
