import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useProductCustomization from "../hooks/useProductCustomization";
import ProductModifierGroup from "./ProductModifierGroup";

const ProductCustomizationContent = ({ item, onClose, onConfirm }) => {
  const customization = useProductCustomization({ item, onConfirm });

  return (
    <>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="overline" color="primary" fontWeight={800}>
          PERSONALIZA TU PEDIDO
        </Typography>
        <Typography variant="h5" fontWeight={900}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Elige exactamente cómo lo quieres.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Stack spacing={2.5}>
          {customization.groups.map((group) => (
            <ProductModifierGroup
              key={group.id || group.title}
              group={group}
              selected={customization.selected}
              onToggle={customization.toggleChoice}
            />
          ))}

          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>Indicaciones especiales</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={customization.note}
              onChange={customization.changeNote}
              placeholder="Ej. Salsa aparte…"
              inputProps={{ maxLength: 120 }}
              helperText={`${customization.note.length}/120`}
            />
          </Box>

          {customization.error && (
            <Typography variant="body2" color="error.main" fontWeight={700}>
              {customization.error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancelar</Button>
        <Button
          variant="contained"
          disableElevation
          onClick={customization.confirm}
          sx={{ textTransform: "none", borderRadius: 999, px: 2.5 }}
        >
          {item.modifiers?.length ? "Actualizar" : "Agregar"} · ${customization.finalPrice.toFixed(2)}
        </Button>
      </DialogActions>
    </>
  );
};

ProductCustomizationContent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    price: PropTypes.number,
    note: PropTypes.string,
    modifiers: PropTypes.arrayOf(PropTypes.object),
    modifierGroups: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const ProductCustomizationDialog = ({ open, item, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { borderRadius: "10px" } }}
  >
    <ProductCustomizationContent
      key={open ? `open-${item.id}` : "closed"}
      item={item}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  </Dialog>
);

ProductCustomizationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ProductCustomizationDialog;
