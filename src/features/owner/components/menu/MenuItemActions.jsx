import PropTypes from "prop-types";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { Delete, Edit, TuneRounded } from "@mui/icons-material";

const MenuItemActions = ({ item, onCustomize, onEdit, onDelete }) => (
  <Stack direction="row" spacing={0} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
    <Tooltip title="Personalización">
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<TuneRounded />}
        onClick={() => onCustomize(item)}
        sx={{ textTransform: "none", borderRadius: "8px", whiteSpace: "nowrap" }}
      >
      </Button>
    </Tooltip>
    <Tooltip title="Editar platillo">
      <IconButton size="small" onClick={() => onEdit(item)} aria-label={`editar ${item.name}`}>
        <Edit fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Eliminar">
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(item.id)}
        aria-label={`eliminar ${item.name}`}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

MenuItemActions.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onCustomize: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MenuItemActions;
