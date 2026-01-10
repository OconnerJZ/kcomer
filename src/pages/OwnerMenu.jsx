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
  Category,
  AttachMoney,
  Restaurant,
} from "@mui/icons-material";
import { menuAPI, uploadAPI, handleApiError } from '@Api';

const OwnerMenu = ({ menu: initialMenu, businessId, onRefresh }) => {
  const [menu, setMenu] = useState(initialMenu || []);
  const [loading, setLoading] = useState(false);
  const [menuDialog, setMenuDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleOpenMenuDialog = (item = null) => {
    if (item) {
      setMenuForm({
        item_name: item.name,
        description: item.description || "",
        price: item.price,
        category: item.category || "",
        image_url: item.image || "",
        is_available: item.available,
      });
      setImagePreview(item.image || "");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "La imagen debe pesar menos de 5MB",
          severity: "error",
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

      if (!menuForm.item_name || !menuForm.price) {
        setSnackbar({
          open: true,
          message: "Nombre y precio son requeridos",
          severity: "error",
        });
        return;
      }

      let imageUrl = menuForm.image_url;

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
        is_available: menuForm.is_available,
      };

      if (menuDialog.item) {
        const response = await menuAPI.update(menuDialog.item.id, menuData);

        if (response.data.success) {
          setMenu((prev) =>
            prev.map((m) =>
              m.id === menuDialog.item.id ? { ...m, ...response.data.data } : m
            )
          );
          setSnackbar({
            open: true,
            message: "Platillo actualizado exitosamente",
            severity: "success",
          });
        }
      } else {
        const response = await menuAPI.create(menuData);

        if (response.data.success) {
          setMenu((prev) => [...prev, response.data.data]);
          setSnackbar({
            open: true,
            message: "Platillo agregado exitosamente",
            severity: "success",
          });
        }
      }

      setMenuDialog({ open: false, item: null });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error saving menu item:", error);
      const errorData = handleApiError(error);
      setSnackbar({
        open: true,
        message: errorData.message,
        severity: "error",
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
        setMenu((prev) => prev.filter((m) => m.id !== id));
        setSnackbar({
          open: true,
          message: "Platillo eliminado",
          severity: "success",
        });
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      const errorData = handleApiError(error);
      setSnackbar({
        open: true,
        message: errorData.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, itemId: null });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 0,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#666",
                letterSpacing: "0.15em",
                fontSize: "0.688rem",
                fontWeight: 600,
                display: "block",
              }}
            >
              Gestión de
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
              Menú
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            onClick={() => handleOpenMenuDialog()}
            sx={{
              bgcolor: "#1a1a1a",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
              borderRadius: 0,
              "&:hover": {
                bgcolor: "#2a2a2a",
              },
            }}
          >
            Agregar platillo
          </Button>
        </Stack>
      </Paper>

      {menu.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px solid #e0e0e0",
            borderRadius: 0,
          }}
        >
          <Restaurant sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
          <Typography sx={{ color: "#666", mb: 1 }}>
            No tienes platillos en tu menú
          </Typography>
          <Typography variant="caption" sx={{ color: "#999" }}>
            Agrega el primero para empezar
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Vista Desktop: Tabla */}
          {!isMobile && (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 0,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: "2px solid #1a1a1a" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                        py: 2,
                        width: 80,
                      }}
                    >
                      Imagen
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                      }}
                    >
                      Platillo
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                      }}
                    >
                      Categoría
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                      }}
                    >
                      Precio
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                      }}
                    >
                      Estado
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#666",
                      }}
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        borderBottom: "1px solid #f0f0f0",
                        "&:hover": {
                          bgcolor: "#fafafa",
                        },
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      <TableCell>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                              border: "1px solid #e0e0e0",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <ImageIcon sx={{ color: "#ccc", fontSize: 24 }} />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 0.25 }}
                        >
                          {item.name}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#999",
                              display: "block",
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontSize: "0.875rem" }}
                        >
                          {item.category || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontFamily: "monospace" }}
                        >
                          ${item.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.25,
                            border: `1px solid ${
                              item.available ? "#38a169" : "#e53e3e"
                            }`,
                            color: item.available ? "#38a169" : "#e53e3e",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {item.available ? "Disponible" : "No disponible"}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleOpenMenuDialog(item)}
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(0,0,0,0.04)",
                              },
                            }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDeleteDialog({ open: true, itemId: item.id })
                            }
                            sx={{
                              color: "#e53e3e",
                              "&:hover": {
                                bgcolor: "rgba(229,62,62,0.04)",
                              },
                            }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Vista Mobile: Tarjetas Mejoradas */}
          {isMobile && (
            <Grid container spacing={2}>
              {menu.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 0,
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                      "&:hover": {
                        borderColor: "#1a1a1a",
                      },
                    }}
                  >
                    {/* Imagen */}
                    <Box
                      sx={{
                        height: 180,
                        bgcolor: "#f5f5f5",
                        backgroundImage: item.image
                          ? `url(${item.image})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!item.image && (
                        <ImageIcon sx={{ fontSize: 48, color: "#ccc" }} />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          px: 1,
                          py: 0.5,
                          bgcolor: item.available
                            ? "rgba(56, 161, 105, 0.9)"
                            : "rgba(229, 62, 62, 0.9)",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.available ? "DISPONIBLE" : "NO DISPONIBLE"}
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1.5}>
                        {/* Nombre y Categoría */}
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              mb: 0.25,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </Typography>
                          {item.category && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#999",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontSize: "0.688rem",
                              }}
                            >
                              {item.category}
                            </Typography>
                          )}
                        </Box>

                        {/* Descripción */}
                        {item.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              fontSize: "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            pt: 1,
                            borderTop: "1px solid #f0f0f0",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontFamily: "monospace",
                                fontSize: "1.25rem",
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenMenuDialog(item)}
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 0,
                                  "&:hover": {
                                    borderColor: "#1a1a1a",
                                    bgcolor: "transparent",
                                  },
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    itemId: item.id,
                                  })
                                }
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 0,
                                  color: "#e53e3e",
                                  "&:hover": {
                                    borderColor: "#e53e3e",
                                    bgcolor: "transparent",
                                  },
                                }}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialog Agregar/Editar */}
      <Dialog
        open={menuDialog.open}
        onClose={() => setMenuDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmall}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 0,
            border: "1px solid #e0e0e0",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "#666",
              letterSpacing: "0.15em",
              fontSize: "0.688rem",
              fontWeight: 600,
            }}
          >
            {menuDialog.item ? "Editar" : "Nuevo"}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Platillo
          </Typography>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Nombre */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Restaurant sx={{ fontSize: 16, color: "#666" }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#999",
                    textTransform: "uppercase",
                    fontSize: "0.688rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  Nombre del platillo *
                </Typography>
              </Stack>
              <TextField
                value={menuForm.item_name}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, item_name: e.target.value })
                }
                fullWidth
                required
                placeholder="Ej: Tacos al pastor"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1a1a1a",
                    },
                  },
                }}
              />
            </Box>

            {/* Descripción */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#999",
                  textTransform: "uppercase",
                  fontSize: "0.688rem",
                  letterSpacing: "0.1em",
                  display: "block",
                  mb: 1,
                }}
              >
                Descripción
              </Typography>
              <TextField
                value={menuForm.description}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
                placeholder="Describe tu platillo..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1a1a1a",
                    },
                  },
                }}
              />
            </Box>

            {/* Precio y Categoría */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <AttachMoney sx={{ fontSize: 16, color: "#666" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      textTransform: "uppercase",
                      fontSize: "0.688rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Precio *
                  </Typography>
                </Stack>
                <TextField
                  type="number"
                  value={menuForm.price}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, price: e.target.value })
                  }
                  fullWidth
                  required
                  placeholder="0.00"
                  InputProps={{ startAdornment: "$" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1a1a1a",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Category sx={{ fontSize: 16, color: "#666" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      textTransform: "uppercase",
                      fontSize: "0.688rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Categoría
                  </Typography>
                </Stack>
                <TextField
                  value={menuForm.category}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, category: e.target.value })
                  }
                  fullWidth
                  placeholder="Ej: Tacos, Bebidas"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1a1a1a",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Imagen */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#999",
                  textTransform: "uppercase",
                  fontSize: "0.688rem",
                  letterSpacing: "0.1em",
                  display: "block",
                  mb: 1,
                }}
              >
                Imagen del platillo
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#666",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 0,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#1a1a1a",
                    bgcolor: "transparent",
                  },
                }}
              >
                {imagePreview ? "Cambiar imagen" : "Subir imagen"}
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
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    mt: 2,
                    border: "1px solid #e0e0e0",
                  }}
                />
              )}
            </Box>

            {/* Disponibilidad */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                p: 2,
                bgcolor: "#fafafa",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={menuForm.is_available}
                    onChange={(e) =>
                      setMenuForm({
                        ...menuForm,
                        is_available: e.target.checked,
                      })
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#38a169",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#38a169",
                        },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Marcar como disponible
                  </Typography>
                }
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            onClick={() => setMenuDialog({ open: false, item: null })}
            fullWidth={isSmall}
            sx={{
              borderColor: "#e0e0e0",
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 0,
              px: 3,
              border: "1px solid #e0e0e0",
              "&:hover": {
                borderColor: "#1a1a1a",
                bgcolor: "transparent",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveMenuItem}
            variant="contained"
            disableElevation
            fullWidth={isSmall}
            disabled={loading || !menuForm.item_name || !menuForm.price}
            sx={{
              bgcolor: "#1a1a1a",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              borderRadius: 0,
              "&:hover": {
                bgcolor: "#2a2a2a",
              },
              "&:disabled": {
                bgcolor: "#e0e0e0",
                color: "#999",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#999" }} />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: null })}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 0,
            border: "1px solid #e0e0e0",
            maxWidth: 400,
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ¿Eliminar platillo?
          </Typography>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ color: "#666" }}>
            Esta acción no se puede deshacer. El platillo será eliminado
            permanentemente de tu menú.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, itemId: null })}
            sx={{
              borderColor: "#e0e0e0",
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 0,
              px: 3,
              border: "1px solid #e0e0e0",
              "&:hover": {
                borderColor: "#1a1a1a",
                bgcolor: "transparent",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleDeleteMenuItem(deleteDialog.itemId)}
            variant="contained"
            disableElevation
            disabled={loading}
            sx={{
              bgcolor: "#e53e3e",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              borderRadius: 0,
              "&:hover": {
                bgcolor: "#c53030",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerMenu;