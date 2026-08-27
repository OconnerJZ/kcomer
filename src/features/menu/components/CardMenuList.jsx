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

const CardMenuList = ({ item, businessId, businessName, paymentMethods = [], onAddToCart }) => {
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
      <Card elevation={0} sx={{ width: "100%", mb: .75, overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: 2.25, bgcolor: "rgba(255,255,255,.84)", transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease", "&:hover": { transform: "translateY(-1px)", boxShadow: "0 8px 22px rgba(0,0,0,.055)", borderColor: "rgba(255,75,69,.24)" } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "84px minmax(0,1fr)" }}>
          <Box sx={{ minHeight: 94, bgcolor: "grey.100", backgroundImage: menuItem.image ? `url(${menuItem.image})` : "none", backgroundSize: "cover", backgroundPosition: "center", display: "grid", placeItems: "center" }}>
            {!menuItem.image && <ImageIcon sx={{ color: "grey.300", fontSize: 28 }} />}
          </Box>

          <CardContent sx={{ p: 1.15, "&:last-child": { pb: 1.15 } }}>
            <Stack spacing={.7}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                  <Typography variant="body2" fontWeight={850} sx={{ lineHeight: 1.2, fontSize: ".82rem" }}>{menuItem.name}</Typography>
                  <Typography variant="body2" fontWeight={850} color="primary.main" sx={{ whiteSpace: "nowrap", fontSize: ".8rem" }}>${menuItem.price.toFixed(2)}</Typography>
                </Stack>
                {menuItem.description && <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", mt: .25, lineHeight: 1.35, fontSize: ".68rem" }}>{menuItem.description}</Typography>}
              </Box>

              {hasNote && note && <Chip size="small" label={note.length > 22 ? `${note.slice(0, 22)}…` : note} icon={<EditNote sx={{ fontSize: "14px !important" }} />} sx={{ alignSelf: "flex-start", maxWidth: "100%", borderRadius: 999, height: 22, fontSize: ".64rem" }} />}

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={.75}>
                {quantity > 0 ? (
                  <Stack direction="row" spacing={.25} alignItems="center">
                    <IconButton size="small" onClick={handleDecrement} sx={{ width: 27, height: 27, border: "1px solid", borderColor: "divider" }}><Remove sx={{ fontSize: 16 }} /></IconButton>
                    <Typography sx={{ minWidth: 20, textAlign: "center", fontWeight: 850, fontSize: ".8rem" }}>{quantity}</Typography>
                    <IconButton size="small" onClick={handleIncrement} color="primary" sx={{ width: 27, height: 27, border: "1px solid", borderColor: "primary.main" }}><Add sx={{ fontSize: 16 }} /></IconButton>
                  </Stack>
                ) : (
                  <Button size="small" variant="contained" disableElevation startIcon={<Add sx={{ fontSize: "15px !important" }} />} onClick={handleIncrement} sx={{ textTransform: "none", borderRadius: 999, fontWeight: 750, px: 1.15, minHeight: 28, fontSize: ".7rem" }}>Agregar</Button>
                )}

                {quantity > 0 && <Button size="small" startIcon={<EditNote sx={{ fontSize: "15px !important" }} />} onClick={() => setNoteDialogOpen(true)} sx={{ textTransform: "none", color: "text.secondary", minWidth: 0, px: .45, fontSize: ".68rem" }}>Nota</Button>}
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>

      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nota para cocina</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{menuItem.name}</Typography>
          <TextField autoFocus fullWidth multiline rows={3} placeholder="Ej. Sin cebolla, extra salsa…" value={note} onChange={(event) => setNote(event.target.value)} inputProps={{ maxLength: 100 }} helperText={`${note.length}/100 caracteres`} />
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
