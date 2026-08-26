import { useMemo, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import {
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Remove, NoteAdd } from "@mui/icons-material";
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
        variant="outlined"
        orientation="horizontal"
        sx={{
          width: "100%",
          padding: "5px 2px",
          alignItems: "center",
          mb: 0.5,
          "&:hover": {
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
          },
        }}
      >
        <AspectRatio ratio="1" sx={{ width: 90, borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
          <img src={menuItem.image} srcSet={menuItem.image} loading="lazy" alt={menuItem.name} />
        </AspectRatio>

        <CardContent sx={{ flex: 1 }}>
          <Typography level="title-md">{menuItem.name}</Typography>
          <Typography sx={{ fontSize: "11px", mb: "3px" }}>{menuItem.description}</Typography>

          {hasNote && note && (
            <Chip size="sm" variant="soft" color="warning" sx={{ mt: 0.5, fontSize: "10px" }}>
              📝 {note.length > 20 ? `${note.substring(0, 20)}...` : note}
            </Chip>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              variant="outlined"
              color="success"
              size="sm"
              sx={{ pointerEvents: "none", minHeight: 0, height: "23px", fontSize: "13px" }}
              startDecorator="$"
            >
              {menuItem.price.toFixed(2)}
            </Chip>

            {quantity > 0 && (
              <IconButton
                size="small"
                color={hasNote ? "warning" : "default"}
                onClick={() => setNoteDialogOpen(true)}
                sx={{ border: "1px solid", borderColor: hasNote ? "warning.main" : "divider" }}
              >
                <NoteAdd fontSize="small" />
              </IconButton>
            )}

            {quantity > 0 && (
              <IconButton size="small" onClick={handleDecrement}>
                <Remove fontSize="small" />
              </IconButton>
            )}
            <Chip onClick={handleIncrement} variant="solid" color="primary">Si quiero</Chip>
            <Typography sx={{ fontWeight: 600, minWidth: 20, textAlign: "center", mx: 0.5 }}>
              {quantity}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Agregar nota especial</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{menuItem.name}</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="Ej: Sin cebolla, sin crema, extra salsa..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${note.length}/100 caracteres`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveNote}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardMenuList;
