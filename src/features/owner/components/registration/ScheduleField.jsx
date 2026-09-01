import PropTypes from "prop-types";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import useWeeklySchedule from "../../hooks/useWeeklySchedule";
import ScheduleDayRow from "./ScheduleDayRow";

const scheduleDayType = PropTypes.shape({
  day: PropTypes.string.isRequired,
  isClosed: PropTypes.bool,
  opened: PropTypes.string,
  closed: PropTypes.string,
});

const ScheduleField = ({ formValues, setFormValues, schedules, onChange }) => {
  const schedule = useWeeklySchedule({
    formValues,
    setFormValues,
    schedules,
    onChange,
  });

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
          onClick={schedule.copyReferenceDay}
          disabled={!schedule.canCopyReferenceDay}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Copiar horario al resto
        </Button>
      </Stack>

      <Stack spacing={1}>
        {schedule.days.map((day, index) => (
          <ScheduleDayRow
            key={day.day}
            day={day}
            isToday={index === schedule.todayIndex}
            onOpenChange={(isOpen) => schedule.setDayOpen(index, isOpen)}
            onTimeChange={(changes) => schedule.updateDay(index, changes)}
          />
        ))}
      </Stack>
    </Box>
  );
};

ScheduleField.propTypes = {
  formValues: PropTypes.shape({
    schedule: PropTypes.arrayOf(scheduleDayType),
  }),
  setFormValues: PropTypes.func,
  schedules: PropTypes.arrayOf(scheduleDayType),
  onChange: PropTypes.func,
};

export default ScheduleField;
