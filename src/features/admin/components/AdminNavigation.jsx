import PropTypes from "prop-types";
import {
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import {
  CampaignRounded,
  DashboardRounded,
  HistoryRounded,
  MonitorHeartRounded,
  PaymentsRounded,
  PeopleAltRounded,
  StorefrontRounded,
  TuneRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MODULE_STATUS,
  getAdminModulesBySection,
} from "../model/adminNavigation";

const ICONS = Object.freeze({
  dashboard: <DashboardRounded fontSize="small" />,
  businesses: <StorefrontRounded fontSize="small" />,
  users: <PeopleAltRounded fontSize="small" />,
  plans: <WorkspacePremiumRounded fontSize="small" />,
  features: <TuneRounded fontSize="small" />,
  marketing: <CampaignRounded fontSize="small" />,
  payments: <PaymentsRounded fontSize="small" />,
  health: <MonitorHeartRounded fontSize="small" />,
  audit: <HistoryRounded fontSize="small" />,
});

export default function AdminNavigation({ activePath, onNavigate }) {
  const navigate = useNavigate();
  const sections = getAdminModulesBySection();

  const selectModule = (module) => {
    if (module.status !== ADMIN_MODULE_STATUS.READY) return;
    navigate(module.path);
    onNavigate?.();
  };

  return (
    <List disablePadding sx={{ py: 1 }}>
      {sections.map(({ section, modules }, sectionIndex) => (
        <Stack key={section} spacing={0.25}>
          {sectionIndex > 0 && <Divider sx={{ my: 1 }} />}
          <ListSubheader
            disableSticky
            sx={{
              bgcolor: "transparent",
              color: "text.secondary",
              fontSize: "0.68rem",
              fontWeight: 700,
              lineHeight: 2.5,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            {section}
          </ListSubheader>

          {modules.map((module) => {
            const isReady = module.status === ADMIN_MODULE_STATUS.READY;
            const selected = activePath === module.path || (
              module.path !== "/admin" && activePath.startsWith(`${module.path}/`)
            );

            return (
              <ListItemButton
                key={module.id}
                selected={selected}
                disabled={!isReady}
                onClick={() => selectModule(module)}
                sx={{
                  mx: 1,
                  minHeight: 42,
                  borderRadius: "7px",
                  px: 1.25,
                  "&.Mui-selected": {
                    bgcolor: "rgba(198,90,80,.10)",
                    color: "primary.dark",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(198,90,80,.14)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                  {ICONS[module.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={module.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: selected ? 700 : 500,
                  }}
                />
                {!isReady && (
                  <Chip
                    label="Próx."
                    size="small"
                    variant="outlined"
                    sx={{ height: 22, fontSize: "0.64rem", opacity: 0.78 }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </Stack>
      ))}

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 2.25, pt: 2, pb: 1 }}>
        Los módulos se habilitan cuando su backend, permisos y auditoría estén completos.
      </Typography>
    </List>
  );
}

AdminNavigation.propTypes = {
  activePath: PropTypes.string.isRequired,
  onNavigate: PropTypes.func,
};
