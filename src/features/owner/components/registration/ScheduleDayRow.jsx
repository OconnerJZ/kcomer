import PropTypes from "prop-types";
import { Box, Chip, Stack, Switch, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getScheduleDaySummary } from "../../model/weeklySchedule";

const ScheduleDayRow = ({ day, isToday, onOpenChange, onTimeChange }) => (
  <Box
    sx={{
      px: { xs: 0.5, sm: 1 },
      py: 1.35,
      borderBottom: "1px solid",
      borderLeft: isToday ? "3px solid" : "3px solid transparent",
      borderColor: isToday ? "primary.main" : "divider",
      bgcolor: isToday ? "rgba(255,75,69,.035)" : "background.paper",
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
          onChange={(event) => onOpenChange(event.target.checked)}
        />
        <Box>
          <Stack direction="row" alignItems="center" gap={0.75}>
            <Typography variant="body2" fontWeight={800}>{day.day}</Typography>
            {isToday && (
              <Chip
                label="Hoy"
                size="small"
                sx={{ height: 20, fontSize: ".66rem", fontWeight: 800 }}
              />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {getScheduleDaySummary(day)}
          </Typography>
        </Box>
      </Stack>

      {day.isClosed ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", minHeight: 40 }}>
          <Typography variant="body2" color="text.secondary">
            No hay atención este día.
          </Typography>
        </Box>
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} sx={{ flex: 1 }}>
          <MobileTimePicker
            label="Abre"
            ampm={false}
            value={day.opened ? dayjs(day.opened, "HH:mm") : null}
            onChange={(value) => onTimeChange({ opened: value ? value.format("HH:mm") : "" })}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <MobileTimePicker
            label="Cierra"
            ampm={false}
            value={day.closed ? dayjs(day.closed, "HH:mm") : null}
            onChange={(value) => onTimeChange({ closed: value ? value.format("HH:mm") : "" })}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Stack>
      )}

      {!day.isClosed && (
        <ScheduleIcon
          sx={{ display: { xs: "none", md: "block" }, color: "text.disabled", fontSize: 20 }}
        />
      )}
    </Stack>
  </Box>
);

ScheduleDayRow.propTypes = {
  day: PropTypes.shape({
    day: PropTypes.string.isRequired,
    isClosed: PropTypes.bool,
    opened: PropTypes.string,
    closed: PropTypes.string,
  }).isRequired,
  isToday: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default ScheduleDayRow;
