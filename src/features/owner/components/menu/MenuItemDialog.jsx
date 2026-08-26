import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { AttachMoney, Image as ImageIcon } from "@mui/icons-material";

const MenuItemDialog = ({
  open,
  editing,
  fullScreen,
  loading,
  form,
  imagePreview,
  onClose,
  onSave,
  onImageChange,
  onFormChange,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
    <DialogTitle>{editing ? "Editar Platillo" : "Nuevo Platillo"}</DialogTitle>
    <DialogContent>
      <Stack spacing={3} sx={{ mt: 2 }}>
        <Box>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="menu-image-upload"
            type="file"
            onChange={onImageChange}
          />
          <label htmlFor="menu-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<ImageIcon />}
              fullWidth
              sx={{ borderRadius: 0 }}
            >
              {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Avatar
                src={imagePreview}
                variant="rounded"
                sx={{ width: 120, height: 120, margin: "0 auto" }}
              />
            </Box>
          )}
        </Box>

        <TextField
          label="Nombre del Platillo"
          value={form.name}
          onChange={(event) => onFormChange("name", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Descripción"
          value={form.description}
          onChange={(event) => onFormChange("description", event.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Precio"
          value={form.price}
          onChange={(event) => onFormChange("price", event.target.value)}
          type="number"
          InputProps={{ startAdornment: <AttachMoney /> }}
          fullWidth
          required
        />
        <TextField
          label="Categoría"
          value={form.category}
          onChange={(event) => onFormChange("category", event.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.available}
              onChange={(event) => onFormChange("available", event.target.checked)}
            />
          }
          label="Disponible"
        />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Guardar"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default MenuItemDialog;
