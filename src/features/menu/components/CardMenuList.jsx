import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, EditNote, Image as ImageIcon, Remove } from "@mui/icons-material";
import { normalizeCartItem } from "@Features/cart/model/cartItem";

const CardMenuList = ({
  item,
  businessId,
  businessName,
  paymentMethods = [],
  onAddToCart,
}) => {
  const menuItem = useMemo(() => normalizeCartItem(item), [item]);
  const [quantity, setQuantity] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [note, setNote] = useState("");
  const [hasNote, setHasNote] = useState(false);

  const updateCart = (qty, itemNote) => {
    onAddToCart({
      itemId: menuItem.id,
      businessId,
      businessName,
      paymentMethods,
      item: { ...menuItem, quantity: qty, note: itemNote || "" },
    });
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateCart(newQty, note);
  };

  const handleDecrement = () => {
    if (quantity <= 0) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    if (newQty === 0) {
      setNote("");
      setHasNote(false);
    }
    updateCart(newQty, newQty === 0 ? "" : note);
  };

  const handleSaveNote = () => {
    setHasNote(note.trim() !== "");
    updateCart(quantity, note);
    setNoteDialogOpen(false);
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          mb: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          bgcolor: "rgba(255,255,255,.82)",
          transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 28px rgba(0,0,0,.06)",
            borderColor: "rgba(255, 75, 69, .28)",
          },
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "104px minmax(0, 1fr)" }}>
          <Box
            sx={{
              minHeight: 112,
              bgcolor: "grey.100",
              backgroundImage: menuItem.image ? `url(${menuItem.image})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "grid",
              placeItems: "center",
            }}
          >
            {!menuItem.image && <ImageIcon sx={{ color: "grey.300", fontSize: 34 }} />}
          </Box>

          <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
            <Stack spacing={1.15}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.25 }}>
                    {menuItem.name}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ whiteSpace: "nowrap" }}>
                    ${menuItem.price.toFixed(2)}
                  </Typography>
                </Stack>
                {menuItem.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mt: 0.4,
                      lineHeight: 1.45,
                    }}
                  >
                    {menuItem.description}
                  </Typography>
                )}
              </Box>

              {hasNote && note && (
                <Chip
                  size="small"
                  label={note.length > 26 ? `${note.slice(0, 26)}…` : note}
                  icon={<EditNote sx={{ fontSize: "16px !important" }} />}
                  sx={{ alignSelf: "flex-start", maxWidth: "100%", borderRadius: 999 }}
                />
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                {quantity > 0 ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton size="small" onClick={handleDecrement} sx={{ border: "1px solid", borderColor: "divider" }}>
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 800 }}>
                      {quantity}
                    </Typography>
                    <IconButton size="small" onClick={handleIncrement} color="primary" sx={{ border: "1px solid", borderColor: "primary.main" }}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Stack>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    startIcon={<Add />}
                    onClick={handleIncrement}
                    sx={{ textTransform: "none", borderRadius: 999, fontWeight: 700, px: 1.5 }}
                  >
                    Agregar
                  </Button>
                )}

                {quantity > 0 && (
                  <Button
                    size="small"
                    startIcon={<EditNote />}
                    onClick={() => setNoteDialogOpen(true)}
                    sx={{ textTransform: "none", color: "text.secondary", minWidth: 0 }}
                  >
                    Nota
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>

      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nota para cocina</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{menuItem.name}</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="Ej. Sin cebolla, extra salsa…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${note.length}/100 caracteres`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button variant="contained" disableElevation onClick={handleSaveNote} sx={{ textTransform: "none" }}>Guardar nota</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardMenuList;
