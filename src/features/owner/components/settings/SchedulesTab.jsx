import PropTypes from "prop-types";
import { Button, CircularProgress, Stack } from "@mui/material";
import ScheduleField from "../registration/ScheduleField";
import SettingsSection from "./SettingsSection";

const SchedulesTab = ({ schedules, setSchedules, onSave, loading }) => (
  <SettingsSection
    eyebrow="HORARIOS"
    title="Cuándo estás disponible"
    description="Configura una semana habitual clara para tus clientes y tu operación."
  >
    <ScheduleField schedules={schedules} onChange={setSchedules} />
    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
      <Button
        variant="contained"
        disableElevation
        onClick={onSave}
        disabled={loading}
        sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 150 }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar horarios"}
      </Button>
    </Stack>
  </SettingsSection>
);

SchedulesTab.propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSchedules: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SchedulesTab;
