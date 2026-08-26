import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Image as ImageIcon,
  Restaurant,
} from "@mui/icons-material";
import useBusinessMenu from "@Features/menu/hooks/useBusinessMenu";
import DeleteMenuDialog from "@Features/owner/components/menu/DeleteMenuDialog";
import MenuItemDialog from "@Features/owner/components/menu/MenuItemDialog";
import useImagePreview from "@Shared/hooks/useImagePreview";

const EMPTY_MENU_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  available: true,
};

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
  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);
  const image = useImagePreview();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const handleOpenMenuDialog = (item = null) => {
    if (item) {
      setMenuForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        available: item.available,
      });
      image.resetImage(item.image);
    } else {
      setMenuForm(EMPTY_MENU_FORM);
      image.resetImage();
    }
    setMenuDialog({ open: true, item });
  };

  const handleCloseMenuDialog = () => {
    setMenuDialog({ open: false, item: null });
    setMenuForm(EMPTY_MENU_FORM);
    image.resetImage();
  };

  const handleFormChange = (field, value) => {
    setMenuForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await image.selectImage(file);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveMenuItem = async () => {
    try {
      if (!menuForm.name || !menuForm.price) {
        showSnackbar("Nombre y precio son requeridos", "error");
        return;
      }

      const result = menuDialog.item
        ? await updateItem(menuDialog.item.id, menuForm, image.file)
        : await createItem(menuForm, image.file);

      if (!result.success) {
        showSnackbar(result.error, "error");
        return;
      }

      showSnackbar(
        menuDialog.item
          ? "Platillo actualizado exitosamente"
          : "Platillo agregado exitosamente",
      );
      handleCloseMenuDialog();
      onRefresh?.();
    } catch (error) {
      console.error("Error saving menu item:", error);
      showSnackbar(error?.message || "Error al guardar", "error");
    }
  };

  const handleDeleteMenuItem = async () => {
    const id = deleteDialog.itemId;
    if (!id) return;

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
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenMenuDialog()} sx={{ textTransform: "none", borderRadius: 0, boxShadow: "none" }}>
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
                  <TableCell><Stack direction="row" spacing={2} alignItems="center"><Avatar src={item.image} variant="rounded" sx={{ width: 50, height: 50 }}><ImageIcon /></Avatar><Box><Typography variant="body2" fontWeight={500}>{item.name}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography></Box></Stack></TableCell>
                  <TableCell>{item.category && <Chip label={item.category} size="small" sx={{ borderRadius: 0 }} />}</TableCell>
                  <TableCell align="right"><Typography fontWeight={500}>${item.price.toFixed(2)}</Typography></TableCell>
                  <TableCell align="center"><Switch checked={item.available} onChange={() => handleToggleAvailability(item.id)} size="small" /></TableCell>
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
              <Fade in><Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0, height: "100%" }}><CardContent><Stack spacing={2}><Stack direction="row" spacing={2}><Avatar src={item.image} variant="rounded" sx={{ width: 60, height: 60 }}><ImageIcon /></Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="subtitle1" fontWeight={500} noWrap>{item.name}</Typography><Typography variant="h6" color="primary">${item.price.toFixed(2)}</Typography></Box></Stack>{item.description && <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography>}<Stack direction="row" justifyContent="space-between" alignItems="center"><FormControlLabel control={<Switch checked={item.available} onChange={() => handleToggleAvailability(item.id)} size="small" />} label="Disponible" /><Stack direction="row" spacing={1}><IconButton size="small" onClick={() => handleOpenMenuDialog(item)}><Edit fontSize="small" /></IconButton><IconButton size="small" onClick={() => setDeleteDialog({ open: true, itemId: item.id })}><Delete fontSize="small" /></IconButton></Stack></Stack></Stack></CardContent></Card></Fade>
            </Grid>
          ))}
        </Grid>
      )}

      <MenuItemDialog open={menuDialog.open} editing={!!menuDialog.item} fullScreen={isSmall} loading={loading} form={menuForm} imagePreview={image.preview} onClose={handleCloseMenuDialog} onSave={handleSaveMenuItem} onImageChange={handleImageChange} onFormChange={handleFormChange} />

      <DeleteMenuDialog open={deleteDialog.open} loading={loading} onClose={() => setDeleteDialog({ open: false, itemId: null })} onConfirm={handleDeleteMenuItem} />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert severity={snackbar.severity} onClose={closeSnackbar}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default OwnerMenu;
