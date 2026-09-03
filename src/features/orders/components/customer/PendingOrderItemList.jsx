import PropTypes from "prop-types";
import { Add, DeleteOutline, EditRounded, Remove, TuneRounded } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";

const PendingOrderItemList = ({ items, onChangeQuantity, onEdit, onRemove }) => (
  <Box>
    <Typography fontWeight={600} sx={{ mb: 1.25 }}>Tu orden</Typography>
    <Stack spacing={1}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}
        >
          <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
            <Box minWidth={0} flex={1}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Typography fontWeight={600} noWrap>{item.name}</Typography>
                {item.modifierGroups?.length > 0 && (
                  <TuneRounded sx={{ fontSize: 15, color: "primary.main" }} />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                ${Number(item.price || 0).toFixed(2)} c/u
              </Typography>
              {!!item.modifierSummary?.length && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.65 }}>
                  {item.modifierSummary.slice(0, 4).map((modifier, index) => (
                    <Chip
                      key={`${modifier.name}-${index}`}
                      size="small"
                      variant="outlined"
                      label={modifier.state === "removed" ? `Sin ${modifier.name}` : modifier.name}
                      sx={{ height: 21, fontSize: ".64rem" }}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              {item.modifierGroups?.length > 0 && (
                <IconButton size="small" onClick={() => onEdit(item.id)}>
                  <EditRounded fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" onClick={() => onChangeQuantity(item.id, -1)}>
                <Remove fontSize="small" />
              </IconButton>
              <Typography fontWeight={600} sx={{ minWidth: 22, textAlign: "center" }}>
                {item.quantity}
              </Typography>
              <IconButton size="small" onClick={() => onChangeQuantity(item.id, 1)}>
                <Add fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onRemove(item.id)}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  </Box>
);

PendingOrderItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default PendingOrderItemList;
