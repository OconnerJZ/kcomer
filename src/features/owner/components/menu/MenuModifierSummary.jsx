import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";
import { TuneRounded } from "@mui/icons-material";
import { getModifierSummary } from "@Features/owner/model/ownerMenu";

const MenuModifierSummary = ({ item, compact = false }) => {
  const summary = getModifierSummary(item);
  if (!summary.groups) return null;

  return (
    <Stack
      direction="row"
      spacing={0.65}
      alignItems="center"
      sx={{ mt: compact ? 0.45 : 0.35, color: "primary.main" }}
    >
      <TuneRounded sx={{ fontSize: compact ? 14 : 15 }} />
      <Typography variant="caption" fontWeight={600}>
        {summary.groups} {summary.groups === 1 ? "grupo" : "grupos"} · {summary.options} {summary.options === 1 ? "opción" : "opciones"}
      </Typography>
    </Stack>
  );
};

MenuModifierSummary.propTypes = {
  item: PropTypes.shape({
    modifierGroups: PropTypes.arrayOf(PropTypes.shape({
      choices: PropTypes.arrayOf(PropTypes.object),
    })),
  }).isRequired,
  compact: PropTypes.bool,
};

export default MenuModifierSummary;
