import { useState } from 'react';
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
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { menuAPI, uploadAPI, handleApiError } from '@Services/apiService';

const OwnerMenu = ({ menu: initialMenu, businessId, onRefresh }) => {
  const [menu, setMenu] = useState(initialMenu || []);
  const [loading, setLoading] = useState(false);
  const [menuDialog, setMenuDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [menuForm, setMenuForm] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleOpenMenuDialog = (item = null) => {
    if (item) {
      setMenuForm({
        item_name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category || '',
        image_url: item.image || '',
        is_available: item.available
      });
      setImagePreview(item.image || '');
    } else {
      setMenuForm({
        item_name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        is_available: true,
      });
      setImagePreview('');
      setImageFile(null);
    }
    setMenuDialog({ open: true, item });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ 
          open: true, 
          message: 'La imagen debe pesar menos de 5MB', 
          severity: 'error' 
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMenuItem = async () => {
    try {
      setLoading(true);

      // Validaciones básicas
      if (!menuForm.item_name || !menuForm.price) {
        setSnackbar({ 
          open: true, 
          message: 'Nombre y precio son requeridos', 
          severity: 'error' 
        });
        return;
      }

      let imageUrl = menuForm.image_url;

      // Subir imagen si hay una nueva
      if (imageFile) {
        const uploadResponse = await uploadAPI.uploadImage(imageFile);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.url;
        }
      }

      const menuData = {
        business_id: businessId,
        item_name: menuForm.item_name,
        description: menuForm.description,
        price: parseFloat(menuForm.price),
        category: menuForm.category,
        image_url: imageUrl,
        is_available: menuForm.is_available
      };

      if (menuDialog.item) {
        // Actualizar
        const response = await menuAPI.update(menuDialog.item.id, menuData);
        
        if (response.data.success) {
          setMenu(prev => prev.map(m => 
            m.id === menuDialog.item.id 
              ? { ...m, ...response.data.data } 
              : m
          ));
          setSnackbar({ 
            open: true, 
            message: 'Platillo actualizado exitosamente', 
            severity: 'success' 
          });
        }
      } else {
        // Crear
        const response = await menuAPI.create(menuData);
        
        if (response.data.success) {
          setMenu(prev => [...prev, response.data.data]);
          setSnackbar({ 
            open: true, 
            message: 'Platillo agregado exitosamente', 
            severity: 'success' 
          });
        }
      }

      setMenuDialog({ open: false, item: null });
      if (onRefresh) onRefresh();

    } catch (error) {
      console.error('Error saving menu item:', error);
      const errorData = handleApiError(error);
      setSnackbar({ 
        open: true, 
        message: errorData.message, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      setLoading(true);
      
      const response = await menuAPI.delete(id);
      
      if (response.data.success) {
        setMenu(prev => prev.filter(m => m.id !== id));
        setSnackbar({ 
          open: true, 
          message: 'Platillo eliminado', 
          severity: 'success' 
        });
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      const errorData = handleApiError(error);
      setSnackbar({ 
        open: true, 
        message: errorData.message, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, itemId: null });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Gestión de Menú</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenMenuDialog()}
        >
          Agregar platillo
        </Button>
      </Stack>

      {menu.length === 0 ? (
        <Alert severity="info">
          No tienes platillos en tu menú. Agrega el primero para empezar.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {menu.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <Chip
                    label={item.available ? 'Disponible' : 'No disponible'}
                    color={item.available ? 'success' : 'error'}
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                </Box>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" noWrap>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.description}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="success.main">
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenMenuDialog(item)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, itemId: item.id })}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Agregar/Editar */}
      <Dialog 
        open={menuDialog.open} 
        onClose={() => setMenuDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {menuDialog.item ? 'Editar platillo' : 'Agregar platillo'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del platillo"
              value={menuForm.item_name}
              onChange={(e) => setMenuForm({ ...menuForm, item_name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              value={menuForm.description}
              onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Precio"
              type="number"
              value={menuForm.price}
              onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
              fullWidth
              required
              InputProps={{ startAdornment: '$' }}
            />
            <TextField
              label="Categoría"
              value={menuForm.category}
              onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
              fullWidth
              placeholder="Ej: Tacos, Bebidas, Postres"
            />
            
            <Box>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{ 
                    width: '100%', 
                    height: 200, 
                    objectFit: 'cover', 
                    mt: 2,
                    borderRadius: 2
                  }}
                />
              )}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={menuForm.is_available}
                  onChange={(e) => setMenuForm({ 
                    ...menuForm, 
                    is_available: e.target.checked 
                  })}
                />
              }
              label="Disponible"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuDialog({ open: false, item: null })}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveMenuItem} 
            variant="contained"
            disabled={loading || !menuForm.item_name || !menuForm.price}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: null })}
      >
        <DialogTitle>¿Eliminar platillo?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemId: null })}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleDeleteMenuItem(deleteDialog.itemId)} 
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerMenu;