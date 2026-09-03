import { useMemo } from "react";
import PropTypes from "prop-types";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useGetMenuQuery } from "@Features/business/api/business.api";
import { normalizeCartItem } from "@Features/cart/model/cartItem";
import ProductCustomizationDialog from "@Features/menu/components/ProductCustomizationDialog";
import usePendingOrderEditor from "../../hooks/usePendingOrderEditor";
import PendingOrderItemList from "./PendingOrderItemList";
import PendingOrderMenuList from "./PendingOrderMenuList";

const PendingOrderEditorDialog = ({ open, order, menu, loading, onClose, onSave, saving }) => {
  const editor = usePendingOrderEditor({ order, menu, onSave });

  return (
    <>
      <Dialog
        open={open}
        onClose={saving ? undefined : onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={850}>
                EDITAR ORDEN #{order.id}
              </Typography>
              <Typography variant="h5" fontWeight={900}>Aún puedes hacer cambios</Typography>
              <Typography variant="body2" color="text.secondary">
                Cuando el negocio acepte la orden, quedará bloqueada.
              </Typography>
            </Box>
            <IconButton onClick={onClose} disabled={saving}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5}>
            <PendingOrderItemList
              items={editor.items}
              onChangeQuantity={editor.changeQuantity}
              onEdit={editor.editItem}
              onRemove={editor.removeItem}
            />
            <Divider />
            <PendingOrderMenuList
              menu={editor.availableMenu}
              hasMenu={menu.length > 0}
              loading={loading}
              onAdd={editor.addMenuItem}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Nuevo total</Typography>
            <Typography variant="h6" fontWeight={900}>${editor.total.toFixed(2)}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none" }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              disableElevation
              disabled={saving || editor.items.length === 0}
              onClick={editor.save}
              sx={{ textTransform: "none", borderRadius: 999, px: 2.5 }}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ProductCustomizationDialog
        open={Boolean(editor.customizingItem)}
        item={editor.customizingItem || {}}
        onClose={editor.closeCustomizer}
        onConfirm={editor.confirmCustomization}
      />
    </>
  );
};

PendingOrderEditorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

const EditPendingOrderDialog = ({ open, order, onClose, onSave, saving = false }) => {
  const { data: menuResponse, isFetching } = useGetMenuQuery(
    { businessId: order?.businessId },
    { skip: !open || !order?.businessId },
  );
  const menu = useMemo(
    () => (menuResponse?.data || menuResponse || []).map(normalizeCartItem),
    [menuResponse],
  );

  if (!order) return null;

  return (
    <PendingOrderEditorDialog
      key={`${order.id}-${order.version ?? "current"}`}
      open={open}
      order={order}
      menu={menu}
      loading={isFetching}
      onClose={onClose}
      onSave={onSave}
      saving={saving}
    />
  );
};

EditPendingOrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    version: PropTypes.number,
    businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    items: PropTypes.arrayOf(PropTypes.object),
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default EditPendingOrderDialog;
