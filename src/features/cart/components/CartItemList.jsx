import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";

export default function CartItemList({
  businessId,
  items,
  onRemove,
  onQuantityChange,
}) {
  return (
    <List disablePadding>
      {Object.entries(items).map(([itemId, item]) => (
        <ListItem
          key={itemId}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            px: { xs: 0, sm: .5 },
            py: 1.5,
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              gap: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              {item.note && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    color: "primary.main",
                    fontStyle: "italic",
                  }}
                >
                  📝 {item.note}
                </Typography>
              )}
            </Box>

            <IconButton
              edge="end"
              color="error"
              onClick={() => onRemove(businessId, itemId)}
              sx={{ alignSelf: "flex-start" }}
            >
              <Delete />
            </IconButton>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "space-between", sm: "flex-start" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${item.price.toFixed(2)}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  bgcolor: "background.default",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onQuantityChange(businessId, item, -1)}
                >
                  <Remove fontSize="small" />
                </IconButton>

                <Typography
                  sx={{
                    fontWeight: 600,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => onQuantityChange(businessId, item, 1)}
                  color="primary"
                >
                  <Add fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Chip
              label={`$${(item.price * item.quantity).toFixed(2)}`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
            />
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
