import { useCallback, useEffect, useMemo } from "react";
import {
  copyReferenceSchedule,
  createDefaultWeeklySchedule,
  getTodayScheduleIndex,
  hasCompleteWeeklySchedule,
  hasReferenceSchedule,
  setScheduleDayOpen,
  updateScheduleDay,
} from "../model/weeklySchedule";

export const useWeeklySchedule = ({ formValues, setFormValues, schedules, onChange }) => {
  const controlledSchedule = schedules ?? formValues?.schedule;
  const days = useMemo(
    () => hasCompleteWeeklySchedule(controlledSchedule)
      ? controlledSchedule
      : createDefaultWeeklySchedule(),
    [controlledSchedule],
  );

  useEffect(() => {
    if (hasCompleteWeeklySchedule(controlledSchedule)) return;

    if (onChange) {
      onChange((current) => hasCompleteWeeklySchedule(current)
        ? current
        : createDefaultWeeklySchedule());
      return;
    }

    setFormValues?.((current) => hasCompleteWeeklySchedule(current.schedule)
      ? current
      : { ...current, schedule: createDefaultWeeklySchedule() });
  }, [controlledSchedule, onChange, setFormValues]);

  const updateSchedule = useCallback((updater) => {
    if (onChange) {
      onChange((current) => updater(
        hasCompleteWeeklySchedule(current) ? current : createDefaultWeeklySchedule(),
      ));
      return;
    }

    setFormValues?.((current) => ({
      ...current,
      schedule: updater(
        hasCompleteWeeklySchedule(current.schedule)
          ? current.schedule
          : createDefaultWeeklySchedule(),
      ),
    }));
  }, [onChange, setFormValues]);

  const updateDay = useCallback((index, changes) => {
    updateSchedule((current) => updateScheduleDay(current, index, changes));
  }, [updateSchedule]);

  const setDayOpen = useCallback((index, isOpen) => {
    updateSchedule((current) => setScheduleDayOpen(current, index, isOpen));
  }, [updateSchedule]);

  const copyReferenceDay = useCallback(() => {
    updateSchedule(copyReferenceSchedule);
  }, [updateSchedule]);

  return {
    days,
    todayIndex: getTodayScheduleIndex(),
    canCopyReferenceDay: hasReferenceSchedule(days),
    updateDay,
    setDayOpen,
    copyReferenceDay,
  };
};

export default useWeeklySchedule;
