import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
  Avatar,
  Fade,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
  AttachMoney,
  Restaurant,
} from "@mui/icons-material";
import useBusinessMenu from "@Features/menu/hooks/useBusinessMenu";

const OwnerMenu = ({ businessId, onRefresh }) => {
  const {
    menu,
    loading,
    createItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
    hasItems,
  } = useBusinessMenu(businessId);

  const [menuDialog, setMenuDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [menuForm, setMenuForm] = useState({
    item_name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenMenuDialog = (item = null) => {
    if (item) {
      setMenuForm({
        item_name: item.name || item.item_name,
        description: item.description || "",
        price: item.price,
        category: item.category || "",
        image_url: item.image || item.image_url || "",
        is_available: item.available ?? item.is_available ?? true,
      });
      setImagePreview(item.image || item.image_url || "");
    } else {
      setMenuForm({
        item_name: "",
        description: "",
        price: "",
        category: "",
        image_url: "",
        is_available: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setMenuDialog({ open: true, item });
  };

  const handleCloseMenuDialog = () => {
    setMenuDialog({ open: false, item: null });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("La imagen debe pesar menos de 5MB", "error");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveMenuItem = async () => {
    try {
      if (!menuForm.item_name || !menuForm.price) {
        showSnackbar("Nombre y precio son requeridos", "error");
        return;
      }
      const result = menuDialog.item
        ? await updateItem(menuDialog.item.id, menuForm, imageFile)
        : await createItem(menuForm, imageFile);

      if (result.success) {
        showSnackbar(menuDialog.item ? "Platillo actualizado exitosamente" : "Platillo agregado exitosamente");
        handleCloseMenuDialog();
        onRefresh?.();
      } else {
        showSnackbar(result.error, "error");
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      showSnackbar(error?.message || "Error al guardar", "error");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const result = await deleteItem(id);
      if (result.success) {
        showSnackbar("Platillo eliminado");
        onRefresh?.();
      } else {
        showSnackbar(result.error, "error");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      showSnackbar(error?.message || "Error al eliminar", "error");
    } finally {
      setDeleteDialog({ open: false, itemId: null });
    }
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      const result = await toggleItemAvailability(itemId);
      if (result.success) showSnackbar("Disponibilidad actualizada");
      else showSnackbar(result.error, "error");
    } catch (error) {
      console.error("Error toggling availability:", error);
      showSnackbar(error?.message || "Error al actualizar", "error");
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="overline" sx={{ color: "#666", letterSpacing: "0.15em", fontSize: "0.688rem" }}>
              Gestión de Menú
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {menu.length} {menu.length === 1 ? "platillo" : "platillos"}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenMenuDialog()} sx={{ textTransform: "none", borderRadius: 0, boxShadow: "none", "&:hover": { boxShadow: "none" } }}>
            Agregar Platillo
          </Button>
        </Stack>
      </Paper>

      {loading && !hasItems() && <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>}

      {!loading && !hasItems() && (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "2px dashed #e0e0e0", borderRadius: 0 }}>
          <Restaurant sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No hay platillos en el menú</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Comienza agregando tu primer platillo</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenMenuDialog()} sx={{ textTransform: "none", borderRadius: 0 }}>Agregar Platillo</Button>
        </Paper>
      )}

      {!isMobile && hasItems() && (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0 }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: "#fafafa" }}><TableCell>Platillo</TableCell><TableCell>Categoría</TableCell><TableCell align="right">Precio</TableCell><TableCell align="center">Disponible</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
            <TableBody>
              {menu.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell><Stack direction="row" spacing={2} alignItems="center"><Avatar src={item.image || item.image_url} variant="rounded" sx={{ width: 50, height: 50 }}><ImageIcon /></Avatar><Box><Typography variant="body2" fontWeight={500}>{item.name || item.item_name}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography></Box></Stack></TableCell>
                  <TableCell>{item.category && <Chip label={item.category} size="small" sx={{ borderRadius: 0 }} />}</TableCell>
                  <TableCell align="right"><Typography fontWeight={500}>${parseFloat(item.price).toFixed(2)}</Typography></TableCell>
                  <TableCell align="center"><Switch checked={item.available ?? item.is_available ?? false} onChange={() => handleToggleAvailability(item.id)} size="small" /></TableCell>
                  <TableCell align="right"><Stack direction="row" spacing={1} justifyContent="flex-end"><IconButton size="small" onClick={() => handleOpenMenuDialog(item)}><Edit fontSize="small" /></IconButton><IconButton size="small" onClick={() => setDeleteDialog({ open: true, itemId: item.id })}><Delete fontSize="small" /></IconButton></Stack></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && hasItems() && (
        <Grid container spacing={2}>
          {menu.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Fade in><Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0, height: "100%" }}><CardContent><Stack spacing={2}><Stack direction="row" spacing={2}><Avatar src={item.image || item.image_url} variant="rounded" sx={{ width: 60, height: 60 }}><ImageIcon /></Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="subtitle1" fontWeight={500} noWrap>{item.name || item.item_name}</Typography><Typography variant="h6" color="primary">${parseFloat(item.price).toFixed(2)}</Typography></Box></Stack>{item.description && <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography>}<Stack direction="row" justifyContent="space-between" alignItems="center"><FormControlLabel control={<Switch checked={item.available ?? item.is_available ?? false} onChange={() => handleToggleAvailability(item.id)} size="small" />} label="Disponible" /><Stack direction="row" spacing={1}><IconButton size="small" onClick={() => handleOpenMenuDialog(item)}><Edit fontSize="small" /></IconButton><IconButton size="small" onClick={() => setDeleteDialog({ open: true, itemId: item.id })}><Delete fontSize="small" /></IconButton></Stack></Stack></Stack></CardContent></Card></Fade>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={menuDialog.open} onClose={handleCloseMenuDialog} maxWidth="sm" fullWidth fullScreen={isSmall}>
        <DialogTitle>{menuDialog.item ? "Editar Platillo" : "Nuevo Platillo"}</DialogTitle>
        <DialogContent><Stack spacing={3} sx={{ mt: 2 }}><Box><input accept="image/*" style={{ display: "none" }} id="menu-image-upload" type="file" onChange={handleImageChange} /><label htmlFor="menu-image-upload"><Button variant="outlined" component="span" startIcon={<ImageIcon />} fullWidth sx={{ borderRadius: 0 }}>{imagePreview ? "Cambiar Imagen" : "Subir Imagen"}</Button></label>{imagePreview && <Box sx={{ mt: 2, textAlign: "center" }}><Avatar src={imagePreview} variant="rounded" sx={{ width: 120, height: 120, margin: "0 auto" }} /></Box>}</Box><TextField label="Nombre del Platillo" value={menuForm.item_name} onChange={(e) => setMenuForm({ ...menuForm, item_name: e.target.value })} fullWidth required /><TextField label="Descripción" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} multiline rows={3} fullWidth /><TextField label="Precio" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} type="number" InputProps={{ startAdornment: <AttachMoney /> }} fullWidth required /><TextField label="Categoría" value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} fullWidth /><FormControlLabel control={<Switch checked={menuForm.is_available} onChange={(e) => setMenuForm({ ...menuForm, is_available: e.target.checked })} />} label="Disponible" /></Stack></DialogContent>
        <DialogActions><Button onClick={handleCloseMenuDialog}>Cancelar</Button><Button onClick={handleSaveMenuItem} variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : "Guardar"}</Button></DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, itemId: null })}><DialogTitle>¿Eliminar platillo?</DialogTitle><DialogContent><Typography>Esta acción no se puede deshacer. El platillo será eliminado permanentemente.</Typography></DialogContent><DialogActions><Button onClick={() => setDeleteDialog({ open: false, itemId: null })}>Cancelar</Button><Button onClick={() => handleDeleteMenuItem(deleteDialog.itemId)} color="error" variant="contained" disabled={loading}>Eliminar</Button></DialogActions></Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default OwnerMenu;
