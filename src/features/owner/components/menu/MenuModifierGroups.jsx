import PropTypes from "prop-types";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import MenuModifierGroupEditor from "./MenuModifierGroupEditor";

const MenuModifierGroups = ({ groups, loading, ...actions }) => {
  if (loading && groups.length === 0) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 4 }}><CircularProgress size={28} /></Box>;
  }
  if (groups.length === 0) {
    return (
      <Box sx={{ p: 2.5, borderStyle: "dashed", borderRadius: "10px", textAlign: "center" }}>
        <Typography variant="body2" fontWeight={700}>Este platillo todavía no tiene opciones.</Typography>
        <Typography variant="caption" color="text.secondary">Usa una plantilla o crea un grupo desde cero.</Typography>
      </Box>
    );
  }
  return (
    <Stack spacing={1.5}>
      {groups.map((group, groupIndex) => (
        <MenuModifierGroupEditor key={group.id || `new-${groupIndex}`} group={group} groupIndex={groupIndex} {...actions} />
      ))}
    </Stack>
  );
};

MenuModifierGroups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdateGroup: PropTypes.func.isRequired,
  onUpdateChoice: PropTypes.func.isRequired,
  onAddChoice: PropTypes.func.isRequired,
  onRemoveChoice: PropTypes.func.isRequired,
  onRemoveGroup: PropTypes.func.isRequired,
  onSetDefaultChoice: PropTypes.func.isRequired,
};

export default MenuModifierGroups;
