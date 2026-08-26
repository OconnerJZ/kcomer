import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { AccessTime, Close } from "@mui/icons-material";
import { useMemo } from "react";

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

const isScheduleClosed = (schedule = {}) =>
  schedule.isClosed === true || schedule.closed === true || (!schedule.open && !schedule.close);

const getTodaySchedule = (schedules = []) => {
  const todayName = DAY_NAMES[new Date().getDay()];
  const normalizedToday = normalizeDay(todayName);

  return schedules.find((schedule) => normalizeDay(schedule?.day) === normalizedToday) || null;
};

const ScheduleRow = ({ schedule, isToday }) => {
  const closed = isScheduleClosed(schedule);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(90px, 1fr) auto",
        alignItems: "center",
        gap: 2,
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        bgcolor: isToday ? "rgba(255,75,69,.055)" : "transparent",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
        <Typography variant="body2" fontWeight={isToday ? 800 : 600} noWrap>
          {schedule.day || "Día"}
        </Typography>
        {isToday && (
          <Typography variant="caption" color="primary.main" fontWeight={800}>
            HOY
          </Typography>
        )}
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: closed ? "text.disabled" : "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        {closed ? "Cerrado" : `${schedule.open} – ${schedule.close}`}
      </Typography>
    </Box>
  );
};

const ScheduleDialog = ({ open, onClose, data }) => {
  const schedules = Array.isArray(data?.schedules) ? data.schedules : [];
  const todaySchedule = useMemo(() => getTodaySchedule(schedules), [schedules]);
  const todayClosed = todaySchedule ? isScheduleClosed(todaySchedule) : !data?.open;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(0,0,0,.16)",
        },
      }}
    >
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box minWidth={0}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".65rem" }}>
              Horarios
            </Typography>
            <Typography variant="h5" fontWeight={850} noWrap>
              {data?.name || "Negocio"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="cerrar horarios">
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
          <Chip
            size="small"
            label={data?.open ? "Abierto ahora" : "Cerrado ahora"}
            color={data?.open ? "success" : "default"}
            variant={data?.open ? "filled" : "outlined"}
            sx={{ fontWeight: 750 }}
          />
          {todaySchedule && !todayClosed && (
            <Typography variant="body2" color="text.secondary">
              Hoy · {todaySchedule.open} – {todaySchedule.close}
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider />

      <DialogContent sx={{ px: 2, py: 2 }}>
        {schedules.length > 0 ? (
          <Stack spacing={0.25}>
            {schedules.map((schedule, index) => {
              const todayName = normalizeDay(DAY_NAMES[new Date().getDay()]);
              const isToday = normalizeDay(schedule?.day) === todayName;
              return <ScheduleRow key={schedule?.id ?? schedule?.day ?? index} schedule={schedule} isToday={isToday} />;
            })}
          </Stack>
        ) : (
          <Box sx={{ py: 4, px: 2, textAlign: "center" }}>
            <AccessTime sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={700}>
              Horario no disponible
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Este negocio todavía no ha publicado sus horarios.
            </Typography>
          </Box>
        )}

        {schedules.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, px: 1.5 }}>
            Los horarios pueden cambiar en días festivos o fechas especiales.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
