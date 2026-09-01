export const WEEK_DAYS = Object.freeze([
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]);

export const createDefaultWeeklySchedule = () => WEEK_DAYS.map((day) => ({
  day,
  isClosed: false,
  opened: "",
  closed: "",
}));

export const hasCompleteWeeklySchedule = (schedule) => (
  Array.isArray(schedule) && schedule.length > 0
);

export const getTodayScheduleIndex = (date = new Date()) => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

export const updateScheduleDay = (schedule, index, changes) => schedule.map(
  (day, dayIndex) => dayIndex === index ? { ...day, ...changes } : day,
);

export const setScheduleDayOpen = (schedule, index, isOpen) => updateScheduleDay(
  schedule,
  index,
  {
    isClosed: !isOpen,
    opened: isOpen ? schedule[index]?.opened || "" : "",
    closed: isOpen ? schedule[index]?.closed || "" : "",
  },
);

export const findReferenceSchedule = (schedule = []) => schedule.find(
  (day) => !day.isClosed && day.opened && day.closed,
);

export const hasReferenceSchedule = (schedule) => Boolean(findReferenceSchedule(schedule));

export const copyReferenceSchedule = (schedule) => {
  const reference = findReferenceSchedule(schedule);
  if (!reference) return schedule;
  return schedule.map((day) => day.isClosed
    ? day
    : { ...day, opened: reference.opened, closed: reference.closed });
};

export const getScheduleDaySummary = (day) => {
  if (day.isClosed) return "Cerrado";
  if (day.opened && day.closed) return `${day.opened} – ${day.closed}`;
  return "Horario pendiente";
};
