import {
  Dialog,
  DialogContent,
  Box,
  Stack,
  Typography,
  IconButton,
  Grid,
  Button,
  Fade,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";
import { getStatusColor, formatCurrency } from "@Features/orders/model/orderFormatters";
import CustomerInfo from "./dialog/CustomerInfo";
import DeliveryInfo from "./dialog/DeliveryInfo";
import OrderItems from "./dialog/OrderItems";
import ActionButton from "./ActionButton";

const OrderDialog = ({ open, order, onClose, onUpdateStatus, isSmall }) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "#666",
                  letterSpacing: "0.15em",
                  fontSize: "0.688rem",
                  fontWeight: 600,
                }}
              >
                Orden
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, fontFamily: "monospace", mt: 0.5 }}
              >
                #{order.id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  border: `1px solid ${getStatusColor(order.status)}`,
                  color: getStatusColor(order.status),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.813rem" }}>
                  {ORDER_STATUS[order.status]?.label || order.status}
                </Typography>
              </Box>
              <IconButton onClick={onClose} size="small" sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}>
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomerInfo order={order} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeliveryInfo order={order} />
            </Grid>
            <Grid item xs={12}>
              <OrderItems items={order.items} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: "1px solid #1a1a1a", p: { xs: 2, sm: 2.5 }, bgcolor: "#fafafa" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={{ xs: 1, sm: 0 }}>
                  <Typography variant="overline" sx={{ color: "#1a1a1a", letterSpacing: "0.15em", fontSize: "0.813rem", fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: "monospace", fontSize: { xs: "2rem", sm: "2.125rem" } }}>
                    {formatCurrency(order.total)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent={{ xs: "center", sm: "flex-end" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mt: 3, pt: 3, borderTop: "1px solid #e0e0e0" }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth={isSmall}
              sx={{
                borderColor: "#e0e0e0",
                color: "#666",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 0,
                px: 3,
                "&:hover": { borderColor: "#1a1a1a", bgcolor: "transparent" },
              }}
            >
              Cerrar
            </Button>
            <Box sx={{ width: isSmall ? "100%" : "auto" }}>
              <ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} />
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
