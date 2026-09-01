import PropTypes from "prop-types";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  Business,
  Category,
  Groups,
  LocalShipping,
  LocationOn,
  Payment,
  PhotoLibrary,
  Public,
  Schedule,
  WorkspacePremium,
} from "@mui/icons-material";

const SECTION_ICONS = {
  business: Business,
  location: LocationOn,
  schedule: Schedule,
  delivery: LocalShipping,
  payment: Payment,
  category: Category,
  social: Public,
  gallery: PhotoLibrary,
  plan: WorkspacePremium,
  team: Groups,
};

const OwnerSettingsNavigation = ({ sections, activeTab, onChange }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      overflowX: "auto",
      pb: 1,
      mb: { xs: 2, sm: 3 },
      scrollSnapType: "x proximity",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    }}
  >
    {sections.map((section, index) => {
      const Icon = SECTION_ICONS[section.icon];
      const selected = activeTab === index;
      return (
        <Button
          key={section.key}
          onClick={() => onChange(index)}
          startIcon={<Icon fontSize="small" />}
          aria-current={selected ? "page" : undefined}
          sx={{
            flex: "0 0 auto",
            minWidth: { xs: 132, sm: 145 },
            scrollSnapAlign: "start",
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: 2,
            px: 1.6,
            py: 1.1,
            color: selected ? "text.primary" : "text.secondary",
            bgcolor: selected ? "rgba(255,75,69,.08)" : "transparent",
            border: "1px solid",
            borderColor: selected ? "rgba(255,75,69,.22)" : "divider",
            "&:hover": {
              bgcolor: selected ? "rgba(255,75,69,.11)" : "action.hover",
            },
          }}
        >
          <Stack alignItems="flex-start" spacing={0}>
            <Typography variant="body2" fontWeight={selected ? 800 : 600}>
              {section.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              {section.description}
            </Typography>
          </Stack>
        </Button>
      );
    })}
  </Box>
);

OwnerSettingsNavigation.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  activeTab: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OwnerSettingsNavigation;
