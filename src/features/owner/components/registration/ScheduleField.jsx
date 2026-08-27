import { Box, Button, Chip, Stack, Switch, Typography } from "@mui/material";
import { ContentCopy, Schedule as ScheduleIcon } from "@mui/icons-material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const createDefaultSchedule = () => days.map((day) => ({ day, isClosed: false, opened: "", closed: "" }));
const getTodayIndex = () => { const today = new Date().getDay(); return today === 0 ? 6 : today - 1; };
const hasScheduleRows = (value) => Array.isArray(value) && value.length > 0;

const ScheduleField = ({ formValues, setFormValues, schedules, onChange }) => {
  const rawSchedule = schedules ?? formValues?.schedule;
  const controlledSchedule = useMemo(() => hasScheduleRows(rawSchedule) ? rawSchedule : null, [rawSchedule]);
  const todayIndex = useMemo(getTodayIndex, []);

  const updateSchedule = (updater) => {
    if (onChange) {
      onChange((current) => updater(hasScheduleRows(current) ? current : createDefaultSchedule()));
      return;
    }
    if (setFormValues) {
      setFormValues((prev) => ({ ...prev, schedule: updater(hasScheduleRows(prev.schedule) ? prev.schedule : createDefaultSchedule()) }));
    }
  };

  useEffect(() => {
    if (controlledSchedule) return;
    const defaults = createDefaultSchedule();
    if (onChange) { onChange(defaults); return; }
    if (setFormValues) setFormValues((prev) => ({ ...prev, schedule: defaults }));
  }, [controlledSchedule, onChange, setFormValues]);

  const schedule = controlledSchedule || createDefaultSchedule();

  const updateDay = (index, changes) => updateSchedule((current) => {
    const next = [...current];
    next[index] = { ...next[index], ...changes };
    return next;
  });

  const copyReferenceDay = () => {
    const reference = schedule.find((day) => !day.isClosed && day.opened && day.closed);
    if (!reference) return;
    updateSchedule((current) => current.map((day) => day.isClosed ? day : { ...day, opened: reference.opened, closed: reference.closed }));
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.25} sx={{ mb: 1.75 }}>
        <Box minWidth={0}>
          <Typography variant="body2" fontWeight={850}>Semana habitual</Typography>
          <Typography variant="caption" color="text.secondary">Define los días y horas en que normalmente atiendes.</Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={copyReferenceDay} disabled={!schedule.some((day) => !day.isClosed && day.opened && day.closed)} sx={{ textTransform: "none", borderRadius: 2, alignSelf: { xs: "flex-start", sm: "center" }, whiteSpace: "nowrap" }}>
          Copiar al resto
        </Button>
      </Stack>

      <Stack spacing={.85}>
        {schedule.map((day, index) => {
          const isToday = index === todayIndex;
          return (
            <Box key={day.day} sx={{ px: { xs: 1.1, sm: 1.5 }, py: { xs: 1.05, sm: 1.2 }, border: "1px solid", borderColor: isToday ? "rgba(255,75,69,.30)" : "divider", bgcolor: isToday ? "rgba(255,75,69,.04)" : "background.paper", borderRadius: 2.25, minWidth: 0 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "170px minmax(0,1fr)" }, gap: { xs: .85, sm: 1.25 }, alignItems: "center", minWidth: 0 }}>
                <Stack direction="row" alignItems="center" gap={.8} minWidth={0}>
                  <Switch size="small" checked={!day.isClosed} onChange={(event) => { const isOpen = event.target.checked; updateDay(index, { isClosed: !isOpen, opened: isOpen ? day.opened : "", closed: isOpen ? day.closed : "" }); }} />
                  <Box minWidth={0}>
                    <Stack direction="row" alignItems="center" gap={.6}>
                      <Typography variant="body2" fontWeight={850} noWrap>{day.day}</Typography>
                      {isToday && <Chip label="Hoy" size="small" sx={{ height: 19, fontSize: ".62rem", fontWeight: 850 }} />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap>{day.isClosed ? "Cerrado" : day.opened && day.closed ? `${day.opened} – ${day.closed}` : "Horario pendiente"}</Typography>
                  </Box>
                </Stack>

                {day.isClosed ? (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: { xs: 5.7, sm: 0 } }}>No hay atención este día.</Typography>
                ) : (
                  <Stack direction="row" gap={.8} alignItems="center" sx={{ minWidth: 0 }}>
                    <MobileTimePicker label="Abre" ampm={false} value={day.opened ? dayjs(day.opened, "HH:mm") : null} onChange={(value) => updateDay(index, { opened: value ? value.format("HH:mm") : "" })} slotProps={{ textField: { size: "small", fullWidth: true, sx: { minWidth: 0 } } }} />
                    <MobileTimePicker label="Cierra" ampm={false} value={day.closed ? dayjs(day.closed, "HH:mm") : null} onChange={(value) => updateDay(index, { closed: value ? value.format("HH:mm") : "" })} slotProps={{ textField: { size: "small", fullWidth: true, sx: { minWidth: 0 } } }} />
                    <ScheduleIcon sx={{ display: { xs: "none", md: "block" }, color: "text.disabled", fontSize: 18, flexShrink: 0 }} />
                  </Stack>
                )}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ScheduleField;
