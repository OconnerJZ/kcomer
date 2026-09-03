import PropTypes from "prop-types";
import { Add, EditRounded, Remove, TuneRounded } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";

const MenuItemSelectionControls = ({
  quantity,
  configurable,
  busy,
  targetLabel,
  onIncrement,
  onDecrement,
  onEdit,
}) => (
  <>
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1}
    >
      {quantity > 0 ? (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent={{ xs: "flex-end", sm: "flex-start" }}
        >
          <IconButton
            size="small"
            disabled={busy}
            onClick={onDecrement}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <Remove fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>
            {quantity}
          </Typography>
          <IconButton
            size="small"
            disabled={busy}
            onClick={onIncrement}
            color="primary"
            sx={{ border: "1px solid", borderColor: "primary.main" }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <Button
          size="small"
          variant="contained"
          disableElevation
          disabled={busy}
          startIcon={configurable ? <TuneRounded /> : <Add />}
          onClick={onIncrement}
          sx={{ textTransform: "none", borderRadius: "6px", fontWeight: 700, px: 1.5 }}
        >
          {configurable ? "Personalizar" : targetLabel ? "Agregar a mi selección" : "Agregar"}
        </Button>
      )}

      {quantity > 0 && configurable && (
        <Button
          size="small"
          disabled={busy}
          startIcon={<EditRounded />}
          onClick={onEdit}
          sx={{ textTransform: "none", color: "text.secondary", minWidth: 0 }}
        >
          Editar
        </Button>
      )}
    </Stack>
    {targetLabel && (
      <Typography variant="caption" color="primary.main" fontWeight={600}>
        Se agregará directamente a {targetLabel}
      </Typography>
    )}
  </>
);

MenuItemSelectionControls.propTypes = {
  quantity: PropTypes.number.isRequired,
  configurable: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  targetLabel: PropTypes.string.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default MenuItemSelectionControls;
