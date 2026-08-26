import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  Fade,
  Slide,
} from "@mui/material";
import {
  Close,
  AccessTime,
  WbSunny,
  Nightlight,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useMemo } from "react";

const DEFAULT_SCHEDULE = [
  { day: "Lunes", open: "09:00", close: "22:00", isClosed: false },
  { day: "Martes", open: "09:00", close: "22:00", isClosed: false },
  { day: "Miércoles", open: "09:00", close: "22:00", isClosed: false },
  { day: "Jueves", open: "09:00", close: "22:00", isClosed: false },
  { day: "Viernes", open: "09:00", close: "23:00", isClosed: false },
  { day: "Sábado", open: "10:00", close: "23:00", isClosed: false },
  { day: "Domingo", open: null, close: null, isClosed: true },
];

const DAYS_SHORT = ["L", "M", "X", "J", "V", "S", "D"];

const ScheduleDay = ({ schedule, isToday, index }) => {
  const isClosed = schedule.isClosed || (!schedule.open && !schedule.close);

  return (
    <Fade in timeout={300 + index * 100}>
      <Box
        sx={{
          position: "relative",
          p: 2.5,
          mb: 1.5,
          borderRadius: 2,
          bgcolor: "white",
          border: "2px solid",
          borderColor: isClosed ? "#ff4b45" : isToday ? "#0958d9" : "#e0e0e0",
          boxShadow: isToday
            ? "0 8px 16px rgba(102, 126, 234, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.05)",
          transform: isToday ? "scale(1.02)" : "scale(1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            borderColor: isClosed ? "#ff4b45" : "#0958d9",
          },
          opacity: isClosed ? 0.7 : 1,
        }}
      >
        {isToday && !isClosed && (
          <Box
            sx={{
              position: "absolute",
              top: -1,
              right: -1,
              bgcolor: "#0958d9",
              color: "white",
              fontWeight: 700,
              fontSize: "0.65rem",
              px: 1.5,
              py: 0.5,
              borderRadius: "0 8px 0 8px",
            }}
          >
            HOY
          </Box>
        )}

        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: isClosed
                ? "rgba(255, 75, 69, 0.1)"
                : isToday
                  ? "rgba(102, 126, 234, 0.15)"
                  : "rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.2rem",
              color: isClosed ? "#ff4b45" : isToday ? "#0958d9" : "#666",
              border: "2px solid",
              borderColor: isClosed
                ? "#ff4b45"
                : isToday
                  ? "#0958d9"
                  : "transparent",
            }}
          >
            {DAYS_SHORT[index]}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: isClosed ? "#ff4b45" : "#333",
                fontWeight: 700,
                fontSize: "1rem",
                mb: 0.5,
              }}
            >
              {schedule.day}
            </Typography>

            {isClosed ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Cancel sx={{ fontSize: 16, color: "#ff4b45" }} />
                <Typography
                  sx={{ color: "#ff4b45", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  Cerrado
                </Typography>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTime sx={{ fontSize: 16, color: "#ffa726" }} />
                <Typography sx={{ color: "#666", fontSize: "0.85rem", fontWeight: 600 }}>
                  {schedule.open}
                </Typography>
                <Box sx={{ width: 16, height: 2, bgcolor: "#e0e0e0", borderRadius: 1 }} />
                <AccessTime sx={{ fontSize: 16, color: "#5c6bc0" }} />
                <Typography sx={{ color: "#666", fontSize: "0.85rem", fontWeight: 600 }}>
                  {schedule.close}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    </Fade>
  );
};

ScheduleDay.propTypes = {
  schedule: PropTypes.shape({
    day: PropTypes.string.isRequired,
    open: PropTypes.string,
    close: PropTypes.string,
    isClosed: PropTypes.bool,
  }).isRequired,
  isToday: PropTypes.bool,
  index: PropTypes.number.isRequired,
};

const ScheduleDialog = ({ open, onClose, data }) => {
  const scheduleData = data?.schedule || DEFAULT_SCHEDULE;

  const todayIndex = useMemo(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fafafa",
          maxHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "#3a3b3d",
          p: 2,
          pb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(60px)",
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.3)",
              transform: "rotate(90deg)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <Close />
        </IconButton>

        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "white",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {data?.title}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 20,
              bgcolor: data?.isOpen
                ? "rgba(76, 175, 80, 0.2)"
                : "rgba(244, 67, 54, 0.2)",
              border: "2px solid",
              borderColor: data?.isOpen ? "#4caf50" : "#f44336",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: data?.isOpen ? "#4caf50" : "#f44336",
                animation: data?.isOpen ? "pulse 2s ease-in-out infinite" : "none",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.5, transform: "scale(1.2)" },
                },
              }}
            />
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
              }}
            >
              {data?.isOpen ? "Abierto ahora" : "Cerrado"}
            </Typography>
            {data?.isOpen ? (
              <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
            ) : (
              <Cancel sx={{ fontSize: 18, color: "#f44336" }} />
            )}
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 3, px: 3 }}>
        <Box sx={{ mb: 2 }}>
          {scheduleData.map((schedule, index) => (
            <ScheduleDay
              key={schedule.day}
              schedule={schedule}
              isToday={index === todayIndex}
              index={index}
            />
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "white",
            border: "1px dashed #e0e0e0",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontStyle: "italic",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <AccessTime sx={{ fontSize: 16 }} />
            Los horarios pueden variar en días festivos
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.string,
        open: PropTypes.string,
        close: PropTypes.string,
        isClosed: PropTypes.bool,
      }),
    ),
  }),
};

export default ScheduleDialog;
