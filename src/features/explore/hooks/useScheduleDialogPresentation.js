import { useMemo } from "react";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { createScheduleDialogPresentation } from "../model/schedulePresentation";

export const useScheduleDialogPresentation = (business) => useMemo(
  () => createScheduleDialogPresentation(business, API_URL_MEDIA_SERVER),
  [business],
);

export default useScheduleDialogPresentation;
