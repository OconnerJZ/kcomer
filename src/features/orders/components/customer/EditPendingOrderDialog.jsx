import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Close, DeleteOutline, EditRounded, Remove, TuneRounded } from "@mui/icons-material";
import { useGetMenuQuery } from "@Features/business/api/business.api";
import { normalizeCartItem } from "@Features/cart/model/cartItem";
import ProductCustomizationDialog from "@Features/menu/components/ProductCustomizationDialog";

const toDraftItem = (item, menuMap) => {
  const menu = menuMap.get(Number(item.id));
  const modifiers = (item.modifiers || []).map((modifier) => ({ choiceId: Number(modifier.choiceId), state: modifier.state || "selected" }));
  return {
    ...normalizeCartItem(menu || item),
    id: Number(item.id),
    quantity: Number(item.quantity || 1),
    note: item.note || "",
    modifiers,
    modifierSummary: (item.modifiers || []).map((modifier) => ({
      group: modifier.group,
      name: modifier.name,
      state: modifier.state || "selected",
      priceExtra: Number(modifier.priceExtra || 0),
    })),
    price: Number(item.price || menu?.price || 0),
    basePrice: Number(menu?.price || item.price || 0),
    modifierGroups: menu?.modifierGroups || menu?.optionGroups || [],
  };
};

export default function EditPendingOrderDialog({ open, order, onClose, onSave, saving = false }) {
  const { data: menuResponse, isFetching } = useGetMenuQuery(
    { businessId: order?.businessId },
    { skip: !open || !order?.businessId },
  );
  const menu = useMemo(() => (menuResponse?.data || menuResponse || []).map(normalizeCartItem), [menuResponse]);
  const menuMap = useMemo(() => new Map(menu.map((item) => [Number(item.id), item])), [menu]);
  const [items, setItems] = useState([]);
  const [customizingId, setCustomizingId] = useState(null);

  useEffect(() => {
    if (!open || !order) return;
    setItems((order.items || []).map((item) => toDraftItem(item, menuMap)));
  }, [open, order?.id, menuMap]);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [items]);
  const customizingItem = items.find((item) => Number(item.id) === Number(customizingId));

  const changeQty = (id, delta) => {
    setItems((current) => current
      .map((item) => Number(item.id) === Number(id) ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + delta) } : item)
      .filter((item) => item.quantity > 0));
  };

  const addMenuItem = (menuItem) => {
    setItems((current) => {
      const existing = current.find((item) => Number(item.id) === Number(menuItem.id));
      if (existing) return current.map((item) => Number(item.id) === Number(menuItem.id) ? { ...item, quantity: item.quantity + 1 } : item);
      const normalized = normalizeCartItem(menuItem);
      return [...current, { ...normalized, quantity: 1, modifiers: [], modifierSummary: [], note: "" }];
    });
    if ((menuItem.modifierGroups || []).length) setCustomizingId(menuItem.id);
  };

  const handleCustomized = (config) => {
    setItems((current) => current.map((item) => Number(item.id) === Number(customizingId) ? { ...item, ...config } : item));
    setCustomizingId(null);
  };

  const handleSave = () => {
    onSave(items.map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
      note: item.note || "",
      modifiers: (item.modifiers || []).map((modifier) => ({ choiceId: Number(modifier.choiceId), state: modifier.state || "selected" })),
    })));
  };

  return (
    <>
      <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={850}>EDITAR ORDEN #{order?.id}</Typography>
              <Typography variant="h5" fontWeight={900}>Aún puedes hacer cambios</Typography>
              <Typography variant="body2" color="text.secondary">Cuando el negocio acepte la orden, quedará bloqueada.</Typography>
            </Box>
            <IconButton onClick={onClose} disabled={saving}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box>
              <Typography fontWeight={850} sx={{ mb: 1.25 }}>Tu orden</Typography>
              <Stack spacing={1}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
                      <Box minWidth={0} flex={1}>
                        <Stack direction="row" spacing={.75} alignItems="center">
                          <Typography fontWeight={800} noWrap>{item.name}</Typography>
                          {item.modifierGroups?.length > 0 && <TuneRounded sx={{ fontSize: 15, color: "primary.main" }} />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">${Number(item.price || 0).toFixed(2)} c/u</Typography>
                        {!!item.modifierSummary?.length && (
                          <Stack direction="row" spacing={.5} flexWrap="wrap" useFlexGap sx={{ mt: .65 }}>
                            {item.modifierSummary.slice(0, 4).map((modifier, index) => (
                              <Chip key={`${modifier.name}-${index}`} size="small" variant="outlined" label={modifier.state === "removed" ? `Sin ${modifier.name}` : modifier.name} sx={{ height: 21, fontSize: ".64rem" }} />
                            ))}
                          </Stack>
                        )}
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={.5}>
                        {item.modifierGroups?.length > 0 && <IconButton size="small" onClick={() => setCustomizingId(item.id)}><EditRounded fontSize="small" /></IconButton>}
                        <IconButton size="small" onClick={() => changeQty(item.id, -1)}><Remove fontSize="small" /></IconButton>
                        <Typography fontWeight={850} sx={{ minWidth: 22, textAlign: "center" }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => changeQty(item.id, 1)}><Add fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}><DeleteOutline fontSize="small" /></IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography fontWeight={850}>Agregar productos</Typography>
              <Typography variant="caption" color="text.secondary">Se usan los precios y disponibilidad actuales del negocio.</Typography>
              <Stack spacing={.75} sx={{ mt: 1.25 }}>
                {menu.filter((menuItem) => !items.some((item) => Number(item.id) === Number(menuItem.id))).map((menuItem) => (
                  <Stack key={menuItem.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: .65 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={750}>{menuItem.name}</Typography>
                      <Typography variant="caption" color="text.secondary">${Number(menuItem.price || 0).toFixed(2)} {menuItem.modifierGroups?.length ? "· Personalizable" : ""}</Typography>
                    </Box>
                    <Button size="small" startIcon={<Add />} onClick={() => addMenuItem(menuItem)} sx={{ textTransform: "none" }}>Agregar</Button>
                  </Stack>
                ))}
                {!isFetching && menu.length > 0 && menu.every((menuItem) => items.some((item) => Number(item.id) === Number(menuItem.id))) && (
                  <Typography variant="caption" color="text.secondary">Ya agregaste todos los productos disponibles.</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Nuevo total</Typography>
            <Typography variant="h6" fontWeight={900}>${total.toFixed(2)}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none" }}>Cancelar</Button>
            <Button variant="contained" disableElevation disabled={saving || items.length === 0} onClick={handleSave} sx={{ textTransform: "none", borderRadius: 999, px: 2.5 }}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ProductCustomizationDialog
        open={Boolean(customizingItem)}
        item={customizingItem || {}}
        onClose={() => setCustomizingId(null)}
        onConfirm={handleCustomized}
      />
    </>
  );
}
