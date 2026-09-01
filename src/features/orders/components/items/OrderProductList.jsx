import { Box, Chip, Stack, Typography } from "@mui/material";
import { StickyNote2 } from "@mui/icons-material";
import PropTypes from "prop-types";
import { formatCurrency } from "@Features/orders/model/orderFormatters";

const ModifierSummary = ({ modifiers = [] }) => {
  if (!modifiers.length) return null;
  const selected = modifiers.filter((modifier) => modifier.state !== "removed");
  const removed = modifiers.filter((modifier) => modifier.state === "removed");
  return <Stack spacing={.3} sx={{ mt: .55 }}>
    {selected.length > 0 && <Typography variant="caption" color="text.secondary">{selected.map((modifier) => modifier.name).filter(Boolean).join(" · ")}</Typography>}
    {removed.length > 0 && <Typography variant="caption" color="warning.dark">Sin {removed.map((modifier) => modifier.name).filter(Boolean).join(" · sin ")}</Typography>}
  </Stack>;
};

const groupOrderItemsBySelection = (items = [], enabled = false, getGroupLabel) => {
  if (!enabled) return [{ label: null, items }];
  const groups = new Map();
  items.forEach((item) => {
    const label = getGroupLabel?.(item) || item.participantLabel || "Sin selección";
    const key = item.participantLabel || label;
    if (!groups.has(key)) groups.set(key, { label, items: [] });
    groups.get(key).items.push(item);
  });
  return [...groups.values()];
};

export default function OrderProductList({
  items = [],
  groupBySelection = false,
  total,
  showTotal = true,
  emptyMessage = "Todavía no hay productos.",
  getMeta,
  renderStatus,
  renderActions,
  getGroupLabel,
}) {
  const groups = groupOrderItemsBySelection(items, groupBySelection, getGroupLabel);
  if (!items.length) return <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>{emptyMessage}</Typography>;

  return <Box sx={{ overflow: "hidden", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
    {groups.map((group, groupIndex) => <Box key={group.label || "products"}>
      {group.label && <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.5, py: 1, bgcolor: "rgba(255,75,69,.045)", borderTop: groupIndex ? "1px solid" : "none", borderColor: "divider" }}><Typography variant="caption" fontWeight={900} color="primary.dark">{group.label}</Typography><Typography variant="caption" color="text.secondary">{group.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} piezas</Typography></Stack>}
      {group.items.map((item, index) => {
        const subtotal = Number(item.subtotal ?? (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 0)));
        const meta = getMeta?.(item);
        const status = renderStatus?.(item);
        const actions = renderActions?.(item);
        return <Box key={item.detailId || item.id || `${item.name}-${index}`} sx={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", columnGap: { xs: .9, sm: 1.2 }, rowGap: .75, alignItems: "start", px: { xs: .5, sm: .75 }, py: 1.35, borderTop: index || group.label ? "1px solid" : "none", borderColor: "divider" }}>
          <Chip label={`${Number(item.quantity || 0)}×`} size="small" sx={{ fontWeight: 850, minWidth: 38, height: 24, bgcolor: "rgba(255,75,69,.08)", color: "primary.main" }} />
          <Box minWidth={0}>
            <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.35 }}>{item.name}</Typography>
            {meta && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: .2 }}>{meta}</Typography>}
            <ModifierSummary modifiers={item.modifiers} />
            {item.note && <Stack direction="row" spacing={.5} alignItems="flex-start" sx={{ mt: .55 }}><StickyNote2 sx={{ fontSize: 13, color: "text.disabled", mt: "2px" }} /><Typography variant="caption" color="text.secondary" fontStyle="italic">{item.note}</Typography></Stack>}
          </Box>
          <Stack spacing={.55} alignItems="flex-end"><Typography variant="body2" fontWeight={850} whiteSpace="nowrap">{formatCurrency(subtotal)}</Typography>{status}</Stack>
          {actions && <Box sx={{ gridColumn: { xs: "1 / -1", sm: "2 / -1" }, display: "flex", justifyContent: "flex-end" }}>{actions}</Box>}
        </Box>;
      })}
    </Box>)}
    {showTotal && total != null && <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.6, py: 1.35, bgcolor: "rgba(248,248,248,.8)", borderTop: "1px solid", borderColor: "divider" }}><Typography variant="body2" fontWeight={750}>Total del pedido</Typography><Typography variant="subtitle1" fontWeight={900}>{formatCurrency(total)}</Typography></Stack>}
  </Box>;
}

const itemShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  detailId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  quantity: PropTypes.number,
  price: PropTypes.number,
  unitPrice: PropTypes.number,
  subtotal: PropTypes.number,
  note: PropTypes.string,
  participantLabel: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.object),
});

ModifierSummary.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.object),
};

OrderProductList.propTypes = {
  items: PropTypes.arrayOf(itemShape),
  groupBySelection: PropTypes.bool,
  total: PropTypes.number,
  showTotal: PropTypes.bool,
  emptyMessage: PropTypes.string,
  getMeta: PropTypes.func,
  renderStatus: PropTypes.func,
  renderActions: PropTypes.func,
  getGroupLabel: PropTypes.func,
};
