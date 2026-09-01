import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";

const CHIP_STYLES = { height: 22, fontSize: ".65rem" };

const MenuItemModifierSummary = ({ removed, selectedExtras }) => (
  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
    {removed.slice(0, 2).map((modifier) => (
      <Chip
        key={`removed-${modifier.group}-${modifier.name}`}
        size="small"
        label={`Sin ${modifier.name}`}
        variant="outlined"
        sx={CHIP_STYLES}
      />
    ))}
    {selectedExtras.slice(0, 2).map((modifier) => (
      <Chip
        key={`extra-${modifier.group}-${modifier.name}`}
        size="small"
        label={modifier.name}
        color="primary"
        variant="outlined"
        sx={CHIP_STYLES}
      />
    ))}
  </Stack>
);

MenuItemModifierSummary.propTypes = {
  removed: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedExtras: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MenuItemModifierSummary;
