import {
  Box,
  Stack,
  Typography,
  Switch,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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
  // Si no existe schedule, inicializarlo
  useEffect(() => {
    if (!formValues.schedule) {
      setFormValues((prev) => ({
        ...prev,
        schedule: days.map((d) => ({
          day: d,
          isClosed: false,
          opened: "",
          closed: "",
        })),
      }));
    }
  }, []);

  const actualizar = (index, cambios) => {
    setFormValues((prev) => {
      const nuevo = [...prev.schedule];
      nuevo[index] = { ...nuevo[index], ...cambios };
      return { ...prev, schedule: nuevo };
    });
  };

  const copiarLunes = () => {
    const lunes = formValues.schedule[0];
    let origen = null;

    if (!lunes.isClosed) {
      origen = { opened: lunes.opened, closed: lunes.closed };
    } else {
      for (let i = 1; i < formValues.schedule.length; i++) {
        if (!formValues.schedule[i].isClosed) {
          origen = {
            opened: formValues.schedule[i].opened,
            closed: formValues.schedule[i].closed,
          };
          break;
        }
      }
    }

    if (!origen) {
      alert("No hay ningún día abierto con horario para copiar.");
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      schedule: prev.schedule.map((dia, i) =>
        i === 0 || dia.isClosed
          ? dia
          : { ...dia, opened: origen.opened, closed: origen.closed }
      ),
    }));
  };

  if (!formValues.schedule) return null;

  return (
    <Box sx={{ my: 3 }}>
      <Button variant="contained" onClick={copiarLunes} sx={{ mb: 2 }}>
        Copiar día al resto
      </Button>

      {formValues.schedule.map((dia, index) => (
        <Box
          key={dia.day}
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
            {/* Día + Switch */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ width: { xs: "100%", sm: 160 } }}
            >
              <Typography
                sx={{
                  display: { xs: "block", sm: "none" },
                  fontWeight: 600,
                }}
              >
                {dia.day}
              </Typography>
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: 600,
                }}
              >
                {dia.day.charAt(0)}
              </Typography>

              {/* Switch abierto/cerrado */}
              <Switch
                checked={!dia.isClosed}
                onChange={(e) => {
                  const abierto = e.target.checked;
                  actualizar(index, {
                    isClosed: !abierto,
                    opened: abierto ? dia.opened : "",
                    closed: abierto ? dia.closed : "",
                  });
                }}
              />
            </Stack>

            {/* Cerrado */}
            {dia.isClosed && (
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
            )}

            {/* Abierto */}
            {!dia.isClosed && (
              <>
                <MobileTimePicker
                  label="Apertura"
                  ampm={false}
                  value={dia.opened ? dayjs(dia.opened, "HH:mm") : null}
                  onChange={(v) =>
                    actualizar(index, {
                      opened: v ? v.format("HH:mm") : "",
                    })
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />

                <MobileTimePicker
                  label="Cierre"
                  ampm={false}
                  value={dia.closed ? dayjs(dia.closed, "HH:mm") : null}
                  onChange={(v) =>
                    actualizar(index, {
                      closed: v ? v.format("HH:mm") : "",
                    })
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
