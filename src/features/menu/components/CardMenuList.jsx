import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, EditRounded, Image as ImageIcon, Remove, TuneRounded } from "@mui/icons-material";
import { normalizeCartItem } from "@Features/cart/model/cartItem";
import ProductCustomizationDialog from "./ProductCustomizationDialog";

const CardMenuList = ({ item, businessId, businessName, paymentMethods = [], onAddToCart }) => {
  const menuItem = useMemo(() => normalizeCartItem(item), [item]);
  const [quantity, setQuantity] = useState(0);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [configuration, setConfiguration] = useState({ modifiers: [], modifierSummary: [], note: "", price: menuItem.price, basePrice: menuItem.price });
  const configurable = menuItem.modifierGroups.length > 0;

  const updateCart = (qty, config = configuration) => {
    onAddToCart({
      itemId: menuItem.id,
      businessId,
      businessName,
      paymentMethods,
      item: {
        ...menuItem,
        quantity: qty,
        note: config.note || "",
        modifiers: config.modifiers || [],
        modifierSummary: config.modifierSummary || [],
        price: Number(config.price ?? menuItem.price),
        basePrice: Number(config.basePrice ?? menuItem.price),
      },
    });
  };

  const handleIncrement = () => {
    if (quantity === 0 && configurable) {
      setCustomizerOpen(true);
      return;
    }
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateCart(newQty);
  };

  const handleDecrement = () => {
    if (quantity <= 0) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    updateCart(newQty);
  };

  const handleConfiguredAdd = (config) => {
    setConfiguration(config);
    const newQty = quantity > 0 ? quantity : 1;
    setQuantity(newQty);
    updateCart(newQty, config);
    setCustomizerOpen(false);
  };

  const removed = configuration.modifierSummary.filter((modifier) => modifier.state === "removed");
  const selectedExtras = configuration.modifierSummary.filter((modifier) => modifier.state === "selected" && Number(modifier.priceExtra || 0) > 0);

  return (
    <>
      <Card elevation={0} sx={{ width: "100%", mb: 1, overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: 2.5, bgcolor: "rgba(255,255,255,.82)", transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease", "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 28px rgba(0,0,0,.06)", borderColor: "rgba(255, 75, 69, .28)" } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "104px minmax(0, 1fr)" }}>
          <Box sx={{ minHeight: 112, bgcolor: "grey.100", backgroundImage: menuItem.image ? `url(${menuItem.image})` : "none", backgroundSize: "cover", backgroundPosition: "center", display: "grid", placeItems: "center" }}>
            {!menuItem.image && <ImageIcon sx={{ color: "grey.300", fontSize: 34 }} />}
          </Box>

          <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
            <Stack spacing={1.15}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                  <Box minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.25 }}>{menuItem.name}</Typography>
                    {configurable && <Stack direction="row" spacing={.5} alignItems="center" sx={{ mt: .35 }}><TuneRounded sx={{ fontSize: 14, color: "primary.main" }} /><Typography variant="caption" color="primary.main" fontWeight={750}>Personalizable</Typography></Stack>}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ whiteSpace: "nowrap" }}>${Number(quantity > 0 ? configuration.price : menuItem.price).toFixed(2)}</Typography>
                </Stack>
                {menuItem.description && <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mt: .4, lineHeight: 1.45 }}>{menuItem.description}</Typography>}
              </Box>

              {quantity > 0 && (removed.length > 0 || selectedExtras.length > 0) && (
                <Stack direction="row" spacing={.5} flexWrap="wrap" useFlexGap>
                  {removed.slice(0, 2).map((modifier) => <Chip key={`removed-${modifier.group}-${modifier.name}`} size="small" label={`Sin ${modifier.name}`} variant="outlined" sx={{ height: 22, fontSize: ".65rem" }} />)}
                  {selectedExtras.slice(0, 2).map((modifier) => <Chip key={`extra-${modifier.group}-${modifier.name}`} size="small" label={modifier.name} color="primary" variant="outlined" sx={{ height: 22, fontSize: ".65rem" }} />)}
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                {quantity > 0 ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton size="small" onClick={handleDecrement} sx={{ border: "1px solid", borderColor: "divider" }}><Remove fontSize="small" /></IconButton>
                    <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 800 }}>{quantity}</Typography>
                    <IconButton size="small" onClick={handleIncrement} color="primary" sx={{ border: "1px solid", borderColor: "primary.main" }}><Add fontSize="small" /></IconButton>
                  </Stack>
                ) : (
                  <Button size="small" variant="contained" disableElevation startIcon={configurable ? <TuneRounded /> : <Add />} onClick={handleIncrement} sx={{ textTransform: "none", borderRadius: 999, fontWeight: 700, px: 1.5 }}>
                    {configurable ? "Personalizar" : "Agregar"}
                  </Button>
                )}

                {quantity > 0 && configurable && (
                  <Button size="small" startIcon={<EditRounded />} onClick={() => setCustomizerOpen(true)} sx={{ textTransform: "none", color: "text.secondary", minWidth: 0 }}>Editar</Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>

      <ProductCustomizationDialog
        open={customizerOpen}
        item={{ ...menuItem, ...configuration, price: menuItem.basePrice || menuItem.price }}
        onClose={() => setCustomizerOpen(false)}
        onConfirm={handleConfiguredAdd}
      />
    </>
  );
};

export default CardMenuList;
