import {
  Box,
  Stack,
  Typography,
  Switch,
  Button,
  Chip,
} from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect } from "react";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const ScheduleField = ({ formValues, setFormValues }) => {
  useEffect(() => {
    if (!formValues.schedule) {
      setFormValues((prev) => ({
        ...prev,
        schedule: days.map((day) => ({
          day,
          isClosed: false,
          opened: "",
          closed: "",
        })),
      }));
    }
  }, [formValues.schedule, setFormValues]);

  const updateDay = (index, changes) => {
    setFormValues((prev) => {
      const schedule = [...prev.schedule];
      schedule[index] = { ...schedule[index], ...changes };
      return { ...prev, schedule };
    });
  };

  const copyReferenceDay = () => {
    const schedule = formValues.schedule;
    const reference = schedule.find((day) => !day.isClosed && day.opened && day.closed);

    if (!reference) {
      alert("No hay ningún día abierto con horario para copiar.");
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day) =>
        day.isClosed
          ? day
          : { ...day, opened: reference.opened, closed: reference.closed }
      ),
    }));
  };

  if (!formValues.schedule) return null;

  return (
    <Box sx={{ my: 3 }}>
      <Button variant="contained" onClick={copyReferenceDay} sx={{ mb: 2 }}>
        Copiar día al resto
      </Button>

      {formValues.schedule.map((day, index) => (
        <Box
          key={day.day}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #e0e0e0",
            background: "#fafafa",
            borderRadius: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ width: { xs: "100%", sm: 160 } }}
            >
              <Typography sx={{ display: { xs: "block", sm: "none" }, fontWeight: 600 }}>
                {day.day}
              </Typography>
              <Typography sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}>
                {day.day.charAt(0)}
              </Typography>
              <Switch
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
            </Stack>

            {day.isClosed ? (
              <Chip
                label="Cerrado"
                color="error"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderWidth: 1.5,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  px: 1.5,
                }}
              />
            ) : (
              <>
                <MobileTimePicker
                  label="Apertura"
                  ampm={false}
                  value={day.opened ? dayjs(day.opened, "HH:mm") : null}
                  onChange={(value) =>
                    updateDay(index, { opened: value ? value.format("HH:mm") : "" })
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
                <MobileTimePicker
                  label="Cierre"
                  ampm={false}
                  value={day.closed ? dayjs(day.closed, "HH:mm") : null}
                  onChange={(value) =>
                    updateDay(index, { closed: value ? value.format("HH:mm") : "" })
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </>
            )}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default ScheduleField;
