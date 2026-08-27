import {
  Box,
  Button,
  Chip,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { ContentCopy, Schedule as ScheduleIcon } from "@mui/icons-material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const createDefaultSchedule = () =>
  days.map((day) => ({
    day,
    isClosed: false,
    opened: "",
    closed: "",
  }));

const getTodayIndex = () => {
  const today = new Date().getDay();
  return today === 0 ? 6 : today - 1;
};

const hasScheduleRows = (value) => Array.isArray(value) && value.length > 0;

const ScheduleField = ({ formValues, setFormValues, schedules, onChange }) => {
  const controlledSchedule = useMemo(
    () => schedules ?? formValues?.schedule,
    [schedules, formValues?.schedule],
  );
  const todayIndex = useMemo(getTodayIndex, []);

  const updateSchedule = (updater) => {
    if (onChange) {
      onChange((current) => updater(hasScheduleRows(current) ? current : createDefaultSchedule()));
      return;
    }

    if (setFormValues) {
      setFormValues((prev) => ({
        ...prev,
        schedule: updater(hasScheduleRows(prev.schedule) ? prev.schedule : createDefaultSchedule()),
      }));
    }
  };

  useEffect(() => {
    if (hasScheduleRows(controlledSchedule)) return;

    const initialSchedule = createDefaultSchedule();

    if (onChange) {
      onChange(initialSchedule);
      return;
    }

    if (setFormValues) {
      setFormValues((prev) => ({
        ...prev,
        schedule: initialSchedule,
      }));
    }
  }, [controlledSchedule, onChange, setFormValues]);

  const scheduleRows = hasScheduleRows(controlledSchedule)
    ? controlledSchedule
    : createDefaultSchedule();

  const updateDay = (index, changes) => {
    updateSchedule((current) => {
      const next = [...current];
      next[index] = { ...next[index], ...changes };
      return next;
    });
  };

  const copyReferenceDay = () => {
    const reference = scheduleRows.find(
      (day) => !day.isClosed && day.opened && day.closed,
    );

    if (!reference) return;

    updateSchedule((current) =>
      current.map((day) =>
        day.isClosed
          ? day
          : { ...day, opened: reference.opened, closed: reference.closed },
      ),
    );
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="body2" fontWeight={800}>Semana habitual</Typography>
          <Typography variant="caption" color="text.secondary">
            Activa únicamente los días que abres y define un horario simple por día.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopy />}
          onClick={copyReferenceDay}
          disabled={!scheduleRows.some((day) => !day.isClosed && day.opened && day.closed)}
          sx={{ textTransform: "none", borderRadius: 2, alignSelf: { xs: "flex-start", sm: "center" } }}
        >
          Copiar horario al resto
        </Button>
      </Stack>

      <Stack spacing={1}>
        {scheduleRows.map((day, index) => {
          const isToday = index === todayIndex;
          return (
            <Box
              key={day.day}
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: 1.35,
                border: "1px solid",
                borderColor: isToday ? "rgba(255,75,69,.28)" : "divider",
                bgcolor: isToday ? "rgba(255,75,69,.035)" : "background.paper",
                borderRadius: 2.25,
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "center" }}
                gap={{ xs: 1.25, md: 2 }}
              >
                <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: { md: 185 } }}>
                  <Switch
                    size="small"
                    checked={!day.isClosed}
                    onChange={(event) => {
                      const isOpen = event.target.checked;
                      updateDay(index, {
                        isClosed: !isOpen,
                        opened: isOpen ? day.opened : "",
                        closed: isOpen ? day.closed : "",
                      });
                    }}
                  />
                  <Box>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <Typography variant="body2" fontWeight={800}>{day.day}</Typography>
                      {isToday && <Chip label="Hoy" size="small" sx={{ height: 20, fontSize: ".66rem", fontWeight: 800 }} />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {day.isClosed ? "Cerrado" : day.opened && day.closed ? `${day.opened} – ${day.closed}` : "Horario pendiente"}
                    </Typography>
                  </Box>
                </Stack>

                {day.isClosed ? (
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center", minHeight: 40 }}>
                    <Typography variant="body2" color="text.secondary">No hay atención este día.</Typography>
                  </Box>
                ) : (
                  <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} sx={{ flex: 1 }}>
                    <MobileTimePicker
                      label="Abre"
                      ampm={false}
                      value={day.opened ? dayjs(day.opened, "HH:mm") : null}
                      onChange={(value) => updateDay(index, { opened: value ? value.format("HH:mm") : "" })}
                      slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <MobileTimePicker
                      label="Cierra"
                      ampm={false}
                      value={day.closed ? dayjs(day.closed, "HH:mm") : null}
                      onChange={(value) => updateDay(index, { closed: value ? value.format("HH:mm") : "" })}
                      slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                  </Stack>
                )}

                {!day.isClosed && (
                  <ScheduleIcon sx={{ display: { xs: "none", md: "block" }, color: "text.disabled", fontSize: 20 }} />
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ScheduleField;
