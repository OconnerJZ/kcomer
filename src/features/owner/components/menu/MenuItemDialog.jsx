import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";

const formatPreviewPrice = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : "$0.00";
};

const MenuItemPreview = ({ form, imagePreview }) => (
  <Box
    sx={{
      position: { md: "sticky" },
      top: { md: 16 },
      overflow: "hidden",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      bgcolor: "background.paper",
      boxShadow: "0 18px 50px rgba(0,0,0,.07)",
    }}
  >
    <Box
      sx={{
        position: "relative",
        aspectRatio: "4 / 3",
        bgcolor: "grey.100",
        backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "grid",
        placeItems: "center",
      }}
    >
      {!imagePreview && <ImageIcon sx={{ fontSize: 48, color: "grey.300" }} />}
      {!form.available && (
        <Chip
          label="No disponible"
          size="small"
          sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(255,255,255,.92)", fontWeight: 700 }}
        />
      )}
    </Box>
    <Box sx={{ p: 2.25 }}>
      {form.category && (
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".65rem" }}>
          {form.category}
        </Typography>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
          {form.name || "Nombre del platillo"}
        </Typography>
        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ whiteSpace: "nowrap" }}>
          {formatPreviewPrice(form.price)}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
        {form.description || "Agrega una descripción breve y atractiva para contarle al cliente qué hace especial este platillo."}
      </Typography>
    </Box>
  </Box>
);

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
}) => {
  const canSave = Boolean(form.name?.trim()) && Number(form.price) > 0;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3, overflow: "hidden" } }}
    >
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontSize: ".65rem" }}>
            Menú
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            {editing ? "Editar platillo" : "Nuevo platillo"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {editing ? "Actualiza la información que verá tu cliente." : "Crea algo irresistible. Puedes ver el resultado mientras escribes."}
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={loading} aria-label="cerrar"><Close /></IconButton>
      </Box>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: "rgba(248,248,248,.55)" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 300px" }, gap: { xs: 3, md: 3.5 }, alignItems: "start" }}>
          <Stack spacing={2.25}>
            <Box>
              <input accept="image/*" style={{ display: "none" }} id="menu-image-upload" type="file" onChange={onImageChange} />
              <label htmlFor="menu-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternate />}
                  sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
                >
                  {imagePreview ? "Cambiar fotografía" : "Agregar fotografía"}
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
                Una buena fotografía hace que el platillo destaque. Recomendado: formato horizontal.
              </Typography>
            </Box>

            <TextField
              label="Nombre"
              placeholder="Ej. Burger BBQ de la casa"
              value={form.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              fullWidth
              required
              autoFocus={!fullScreen}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Precio"
                value={form.price}
                onChange={(event) => onFormChange("price", event.target.value)}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                fullWidth
                required
              />
              <TextField
                label="Categoría"
                placeholder="Ej. Hamburguesas"
                value={form.category}
                onChange={(event) => onFormChange("category", event.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Descripción"
              placeholder="Ingredientes, preparación o aquello que hace especial este platillo…"
              value={form.description}
              onChange={(event) => onFormChange("description", event.target.value)}
              multiline
              minRows={3}
              maxRows={5}
              fullWidth
            />

            <Box sx={{ px: 1.5, py: 1.1, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
              <FormControlLabel
                sx={{ m: 0, width: "100%", justifyContent: "space-between", flexDirection: "row-reverse" }}
                control={<Switch checked={form.available} onChange={(event) => onFormChange("available", event.target.checked)} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Disponible para ordenar</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {form.available ? "Los clientes pueden agregarlo a su pedido." : "Se oculta temporalmente sin eliminarlo del menú."}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 700 }}>
              Vista previa
            </Typography>
            <MenuItemPreview form={form} imagePreview={imagePreview} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none", color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disableElevation
          disabled={loading || !canSave}
          sx={{ textTransform: "none", borderRadius: 2, minWidth: 120, fontWeight: 700 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : editing ? "Guardar cambios" : "Crear platillo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemDialog;
