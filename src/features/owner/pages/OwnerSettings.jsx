import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import OwnerSettingsContent from "../components/settings/OwnerSettingsContent";
import OwnerSettingsFeedback from "../components/settings/OwnerSettingsFeedback";
import OwnerSettingsNavigation from "../components/settings/OwnerSettingsNavigation";
import useBusinessSettings from "../hooks/useBusinessSettings";
import { useOwnerSettingsActions } from "../hooks/useOwnerSettingsActions";
import {
  canManageBusinessTeam,
  getDisplayedSettingsTab,
  getSettingsSections,
} from "../model/ownerSettings";

const OwnerSettings = ({ businessData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const settings = useBusinessSettings(businessData);
  const actions = useOwnerSettingsActions({ settings, onRefresh });
  const canManageTeam = canManageBusinessTeam(businessData);
  const sections = useMemo(() => getSettingsSections(canManageTeam), [canManageTeam]);
  const displayedTab = getDisplayedSettingsTab(activeTab, sections);

  return (
    <Box>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: ".14em", fontSize: ".65rem" }}
        >
          CONFIGURACIÓN
        </Typography>
        <Typography variant="h4" fontWeight={600} sx={{ mt: 0.2 }}>
          Tu negocio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
          Mantén la información que ven tus clientes y la operación diaria en un solo lugar.
        </Typography>
      </Box>

      <OwnerSettingsNavigation
        sections={sections}
        activeTab={displayedTab}
        onChange={setActiveTab}
      />
      <OwnerSettingsFeedback
        error={settings.error}
        snackbar={actions.snackbar}
        onClose={actions.closeSnackbar}
      />
      <OwnerSettingsContent
        activeTab={displayedTab}
        canManageTeam={canManageTeam}
        businessId={businessData.id}
        settings={settings}
        actions={actions}
      />
    </Box>
  );
};

OwnerSettings.propTypes = {
  businessData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    membershipRole: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRefresh: PropTypes.func,
};

export default OwnerSettings;
