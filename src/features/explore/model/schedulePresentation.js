export const SCHEDULE_DAY_NAMES = Object.freeze([
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]);

export const normalizeScheduleDay = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLowerCase();

export const getScheduleOpenValue = (schedule = {}) => (
  schedule.open ?? schedule.opened ?? ""
);

export const getScheduleCloseValue = (schedule = {}) => (
  schedule.close ?? schedule.closed ?? ""
);

export const isScheduleClosed = (schedule = {}) => {
  const explicitlyClosed = schedule.isClosed === true || schedule.is_closed === true;
  return explicitlyClosed
    || (!getScheduleOpenValue(schedule) && !getScheduleCloseValue(schedule));
};

export const resolveScheduleMediaUrl = (value = "", mediaBaseUrl = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${mediaBaseUrl.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

export const createScheduleRows = (schedules = [], date = new Date()) => {
  const todayName = normalizeScheduleDay(SCHEDULE_DAY_NAMES[date.getDay()]);
  return schedules.map((schedule, index) => ({
    id: schedule?.id ?? schedule?.scheduleId ?? `${schedule?.day || "day"}-${index}`,
    day: schedule?.day || "Día",
    opened: getScheduleOpenValue(schedule),
    closedAt: getScheduleCloseValue(schedule),
    closed: isScheduleClosed(schedule),
    isToday: normalizeScheduleDay(schedule?.day) === todayName,
  }));
};

export const createScheduleDialogPresentation = (
  business = {},
  mediaBaseUrl = "",
  date = new Date(),
) => {
  const schedules = Array.isArray(business.schedules) ? business.schedules : [];
  const rows = createScheduleRows(schedules, date);
  const today = rows.find((row) => row.isToday) || null;
  const todayClosed = today ? today.closed : !business.open;
  const businessName = business.name || "Negocio";

  return {
    rows,
    businessName,
    businessInitial: businessName.charAt(0) || "N",
    logoUrl: resolveScheduleMediaUrl(business.logo, mediaBaseUrl),
    coverUrl: resolveScheduleMediaUrl(business.coverImage, mediaBaseUrl),
    isOpenNow: Boolean(business.open && !todayClosed),
    todayHours: today && !todayClosed ? `Hoy · ${today.opened} – ${today.closedAt}` : "",
  };
};
