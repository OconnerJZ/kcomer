// src/pages/owner/OwnerMenu.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAuth } from '@Context/AuthContext';
import { menuAPI, uploadAPI } from '@Services/apiService';
import GeneralContent from '@Components/layout/GeneralContent';

const OwnerMenu = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await menuAPI.getByBusiness(user.businessId);
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let imageUrl = formData.imageUrl;
      
      // Upload image if new
      if (formData.image) {
        const uploadResponse = await uploadAPI.uploadImage(formData.image);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.filename;
        }
      }

      const itemData = {
        ...formData,
        businessId: user.businessId,
        image: imageUrl,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await menuAPI.update(editingItem.id, itemData);
      } else {
        await menuAPI.create(itemData);
      }

      await loadMenuItems();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error al guardar el platillo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      imageUrl: item.image,
    });
    setImagePreview(item.image);
    setDialogOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('¿Estás seguro de eliminar este platillo?')) return;

    try {
      await menuAPI.delete(itemId);
      await loadMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error al eliminar el platillo');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <GeneralContent title="Gestión del Menú">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Mi Menú
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Agregar Platillo
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={2}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
                  alt={item.name}
                />
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.available ? 'Disponible' : 'No disponible'}
                        color={item.available ? 'success' : 'default'}
                        size="small"
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                      {item.description}
                    </Typography>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.id)}
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

        {/* Dialog para agregar/editar platillo */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? 'Editar Platillo' : 'Nuevo Platillo'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {/* Image Upload */}
              <Box>
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<ImageIcon />}
                    sx={{ mb: 1 }}
                  >
                    Subir Imagen
                  </Button>
                </label>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>

              <TextField
                label="Nombre del platillo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />

              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
                fullWidth
              />

              <TextField
                label="Precio"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                type="number"
                inputProps={{ step: '0.01' }}
                required
                fullWidth
              />

              <TextField
                label="Categoría"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Entradas, Plato fuerte, Postres"
                required
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                }
                label="Disponible"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !formData.name || !formData.price}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GeneralContent>
  );
};

export default OwnerMenu;