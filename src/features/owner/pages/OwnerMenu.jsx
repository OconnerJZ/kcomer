import { useMemo, useState } from "react";
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Delete, Edit, Image as ImageIcon, Restaurant, TuneRounded } from "@mui/icons-material";
import useBusinessMenu from "@Features/menu/hooks/useBusinessMenu";
import DeleteMenuDialog from "@Features/owner/components/menu/DeleteMenuDialog";
import MenuItemDialog from "@Features/owner/components/menu/MenuItemDialog";
import MenuModifierDialog from "@Features/owner/components/menu/MenuModifierDialog";
import MenuToolbar from "@Features/owner/components/menu/MenuToolbar";
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
  const [modifierDialog, setModifierDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const image = useImagePreview();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = useMemo(
    () => [...new Set(menu.map((item) => item.category).filter(Boolean))].sort(),
    [menu],
  );

  const filteredMenu = useMemo(() => {
    const term = search.trim().toLowerCase();
    return menu.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch = !term || [item.name, item.description, item.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [menu, search, category]);

  const availableCount = useMemo(() => menu.filter((item) => item.available).length, [menu]);

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((current) => ({ ...current, open: false }));

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

      showSnackbar(menuDialog.item ? "Platillo actualizado" : "Platillo agregado");
      handleCloseMenuDialog();
      onRefresh?.();
    } catch (error) {
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
      showSnackbar(error?.message || "Error al actualizar", "error");
    }
  };

  const ActionButtons = ({ item }) => (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Personalización">
        <IconButton size="small" color="primary" onClick={() => setModifierDialog({ open: true, item })}>
          <TuneRounded fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar platillo">
        <IconButton size="small" onClick={() => handleOpenMenuDialog(item)}><Edit fontSize="small" /></IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, itemId: item.id })}><Delete fontSize="small" /></IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "rgba(255,255,255,.72)", backdropFilter: "blur(10px)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontSize: "0.68rem" }}>Menú del negocio</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Tu catálogo, simple y vivo</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Actualiza disponibilidad, precios, presentación y opciones de personalización.</Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenMenuDialog()} disableElevation sx={{ textTransform: "none", borderRadius: 2, px: 2.25, py: 1 }}>Agregar platillo</Button>
        </Stack>
      </Paper>

      {hasItems() && (
        <MenuToolbar search={search} onSearchChange={setSearch} categories={categories} selectedCategory={category} onCategoryChange={setCategory} total={menu.length} available={availableCount} />
      )}

      {loading && !hasItems() && <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>}

      {!loading && !hasItems() && (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
          <Restaurant sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>No hay platillos todavía</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Agrega el primero y empieza a construir una experiencia de menú atractiva.</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenMenuDialog()} disableElevation sx={{ textTransform: "none", borderRadius: 2 }}>Agregar platillo</Button>
        </Paper>
      )}

      {hasItems() && filteredMenu.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Typography variant="body1" fontWeight={700}>No encontramos coincidencias</Typography>
          <Typography variant="body2" color="text.secondary">Prueba otra búsqueda o categoría.</Typography>
        </Paper>
      )}

      {!isMobile && filteredMenu.length > 0 && (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: "rgba(0,0,0,.025)" }}><TableCell>Platillo</TableCell><TableCell>Categoría</TableCell><TableCell align="right">Precio</TableCell><TableCell align="center">Estado</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
            <TableBody>
              {filteredMenu.map((item) => (
                <TableRow key={item.id} hover sx={{ "& td": { borderColor: "divider" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={item.image} variant="rounded" sx={{ width: 54, height: 54, borderRadius: 2 }}><ImageIcon /></Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={800}>{item.name}</Typography>
                        {item.description && <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 420 }}>{item.description}</Typography>}
                        {item.modifierGroups?.length > 0 && <Typography variant="caption" color="primary.main" fontWeight={750}>{item.modifierGroups.length} grupos de personalización</Typography>}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{item.category && <Chip label={item.category} size="small" variant="outlined" sx={{ borderRadius: 999 }} />}</TableCell>
                  <TableCell align="right"><Typography fontWeight={800}>${item.price.toFixed(2)}</Typography></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      <Switch checked={item.available} onChange={() => handleToggleAvailability(item.id)} size="small" />
                      <Typography variant="caption" color={item.available ? "success.main" : "text.secondary"}>{item.available ? "Disponible" : "Pausado"}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right"><ActionButtons item={item} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && filteredMenu.length > 0 && (
        <Grid container spacing={1.5}>
          {filteredMenu.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Fade in>
                <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, height: "100%", bgcolor: "rgba(255,255,255,.82)", overflow: "hidden" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5}>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 72, height: 72, borderRadius: 2 }}><ImageIcon /></Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={800} noWrap>{item.name}</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>${item.price.toFixed(2)}</Typography>
                          {item.category && <Typography variant="caption" color="text.secondary">{item.category}</Typography>}
                        </Box>
                      </Stack>

                      {item.description && <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</Typography>}

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Switch checked={item.available} onChange={() => handleToggleAvailability(item.id)} size="small" />
                          <Typography variant="caption" color={item.available ? "success.main" : "text.secondary"}>{item.available ? "Disponible" : "Pausado"}</Typography>
                        </Stack>
                        <ActionButtons item={item} />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      <MenuItemDialog open={menuDialog.open} editing={!!menuDialog.item} fullScreen={isSmall} loading={loading} form={menuForm} imagePreview={image.preview} onClose={handleCloseMenuDialog} onSave={handleSaveMenuItem} onImageChange={handleImageChange} onFormChange={handleFormChange} />
      <MenuModifierDialog open={modifierDialog.open} item={modifierDialog.item} fullScreen={isSmall} onClose={() => setModifierDialog({ open: false, item: null })} />
      <DeleteMenuDialog open={deleteDialog.open} loading={loading} onClose={() => setDeleteDialog({ open: false, itemId: null })} onConfirm={handleDeleteMenuItem} />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert severity={snackbar.severity} onClose={closeSnackbar}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default OwnerMenu;
