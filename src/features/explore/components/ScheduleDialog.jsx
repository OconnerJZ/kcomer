import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { AccessTime, Close } from "@mui/icons-material";
import { useMemo } from "react";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const normalizeDay = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const getMediaUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

const getOpenValue = (schedule = {}) => schedule.open ?? schedule.opened ?? "";
const getCloseValue = (schedule = {}) => schedule.close ?? schedule.closed ?? "";

const isScheduleClosed = (schedule = {}) => {
  const explicitClosed = schedule.isClosed === true || schedule.is_closed === true;
  return explicitClosed || (!getOpenValue(schedule) && !getCloseValue(schedule));
};

const getTodaySchedule = (schedules = []) => {
  const todayName = DAY_NAMES[new Date().getDay()];
  const normalizedToday = normalizeDay(todayName);
  return schedules.find((schedule) => normalizeDay(schedule?.day) === normalizedToday) || null;
};

const ScheduleRow = ({ schedule, isToday }) => {
  const closed = isScheduleClosed(schedule);
  const opened = getOpenValue(schedule);
  const closedAt = getCloseValue(schedule);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "22px minmax(88px,1fr) auto",
        alignItems: "center",
        gap: 1.2,
        px: 1.4,
        py: 1.15,
        borderRadius: 2.4,
        bgcolor: isToday ? "rgba(255,75,69,.055)" : "transparent",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: isToday ? "primary.main" : closed ? "grey.300" : "grey.400",
          boxShadow: isToday ? "0 0 0 5px rgba(255,75,69,.10)" : "none",
          justifySelf: "center",
        }}
      />

      <Stack direction="row" spacing={0.8} alignItems="center" minWidth={0}>
        <Typography variant="body2" fontWeight={isToday ? 850 : 650} noWrap>
          {schedule.day || "Día"}
        </Typography>
        {isToday && (
          <Typography variant="caption" color="primary.main" fontWeight={850} sx={{ fontSize: ".62rem", letterSpacing: ".08em" }}>
            HOY
          </Typography>
        )}
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 750,
          color: closed ? "text.disabled" : "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        {closed ? "Cerrado" : `${opened} – ${closedAt}`}
      </Typography>
    </Box>
  );
};

const ScheduleDialog = ({ open, onClose, data }) => {
  const schedules = Array.isArray(data?.schedules) ? data.schedules : [];
  const todaySchedule = useMemo(() => getTodaySchedule(schedules), [schedules]);
  const todayClosed = todaySchedule ? isScheduleClosed(todaySchedule) : !data?.open;
  const opened = todaySchedule ? getOpenValue(todaySchedule) : "";
  const closedAt = todaySchedule ? getCloseValue(todaySchedule) : "";
  const logoUrl = getMediaUrl(data?.logo);
  const coverUrl = getMediaUrl(data?.coverImage);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4.5,
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,.96)",
          boxShadow: "0 30px 85px rgba(0,0,0,.22)",
          border: "1px solid rgba(255,255,255,.72)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(7px)", bgcolor: "rgba(17,17,17,.42)" },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: 185,
          px: 2.4,
          pt: 2.2,
          pb: 2.3,
          color: "common.white",
          backgroundImage: coverUrl
            ? `linear-gradient(180deg, rgba(18,18,18,.20), rgba(18,18,18,.78)), url(${coverUrl})`
            : "linear-gradient(135deg, #9f2623 0%, #c53d37 55%, #e05a4f 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,.78)", letterSpacing: ".16em", fontSize: ".62rem", fontWeight: 800 }}>
            Horarios del negocio
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="cerrar horarios" sx={{ color: "common.white", bgcolor: "rgba(255,255,255,.13)", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "rgba(255,255,255,.20)" } }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mt: 3.2 }}>
          <Avatar src={logoUrl} sx={{ width: 54, height: 54, border: "2px solid rgba(255,255,255,.88)", bgcolor: "common.white", color: "text.primary", boxShadow: "0 7px 20px rgba(0,0,0,.18)" }}>
            {data?.name?.charAt(0) || "N"}
          </Avatar>
          <Box minWidth={0}>
            <Typography variant="h5" fontWeight={900} noWrap sx={{ letterSpacing: "-.02em" }}>
              {data?.name || "Negocio"}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .7 }}>
              <Chip
                size="small"
                label={data?.open && !todayClosed ? "Abierto ahora" : "Cerrado ahora"}
                sx={{
                  height: 24,
                  bgcolor: data?.open && !todayClosed ? "rgba(229,255,235,.94)" : "rgba(255,255,255,.16)",
                  color: data?.open && !todayClosed ? "success.dark" : "common.white",
                  fontWeight: 850,
                  backdropFilter: "blur(8px)",
                }}
              />
              {todaySchedule && !todayClosed && (
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.82)", fontWeight: 700 }}>
                  Hoy · {opened} – {closedAt}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ px: 2.1, pt: 2.2, pb: 2.4 }}>
        {schedules.length > 0 ? (
          <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.35, mb: 1.1 }}>
              <AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: ".04em" }}>
                SEMANA HABITUAL
              </Typography>
            </Stack>
            <Stack spacing={0.12}>
              {schedules.map((schedule, index) => {
                const todayName = normalizeDay(DAY_NAMES[new Date().getDay()]);
                const isToday = normalizeDay(schedule?.day) === todayName;
                return <ScheduleRow key={schedule?.id ?? schedule?.scheduleId ?? schedule?.day ?? index} schedule={schedule} isToday={isToday} />;
              })}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.7, px: 1.4, lineHeight: 1.55 }}>
              Los horarios pueden variar en días festivos o fechas especiales.
            </Typography>
          </>
        ) : (
          <Box sx={{ py: 4.5, px: 2, textAlign: "center" }}>
            <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "action.hover", mx: "auto", mb: 1.4 }}>
              <AccessTime sx={{ color: "text.secondary" }} />
            </Box>
            <Typography variant="body2" fontWeight={800}>Horario no disponible</Typography>
            <Typography variant="caption" color="text.secondary">Este negocio todavía no ha publicado sus horarios.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
