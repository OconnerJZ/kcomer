import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { Add, LocalDiningRounded, RestaurantMenuRounded } from "@mui/icons-material";
import { MODIFIER_TEMPLATES } from "../../model/menuModifiers";

const TEMPLATE_ICONS = {
  ingredients: LocalDiningRounded,
  extras: Add,
  single: RestaurantMenuRounded,
};

const MenuModifierTemplates = ({ disabled, onSelect }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 1, mb: 2.5 }}>
    {MODIFIER_TEMPLATES.map((template) => {
      const Icon = TEMPLATE_ICONS[template.key];
      return (
        <Button
          key={template.key}
          variant="outlined"
          disabled={disabled}
          onClick={() => onSelect(template.key)}
          sx={{ minHeight: 62, justifyContent: "flex-start", textAlign: "left", borderRadius: "10px", textTransform: "none", px: 1.5 }}
        >
          <Icon sx={{ mr: 1.2, fontSize: 20 }} />
          <Box>
            <Typography variant="body2" fontWeight={800}>{template.label}</Typography>
            <Typography variant="caption" color="text.secondary">{template.helper}</Typography>
          </Box>
        </Button>
      );
    })}
  </Box>
);

MenuModifierTemplates.propTypes = {
  disabled: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

MenuModifierTemplates.defaultProps = {
  disabled: false,
};

export default MenuModifierTemplates;
