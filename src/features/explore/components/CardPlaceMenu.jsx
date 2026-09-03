import PropTypes from "prop-types";
import { Carousel } from "antd";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import CardMenuList from "@Features/menu/components/CardMenuList";
import {
  toSharedOrderItemConfiguration,
} from "@Features/shared-orders/model/sharedOrder";
import { separateByGroups } from "@Shared/utils/commons";
import useCardPlaceMenuOrder from "../hooks/useCardPlaceMenuOrder";
import CardPlaceBack from "./CardPlaceBack";

const EmptyMenu = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 200,
      p: 3,
    }}
  >
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Menú no disponible
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      Este negocio aún no ha cargado su menú
    </Typography>
  </Box>
);

const CardPlaceMenu = ({
  flipped,
  onMovement,
  businessId,
  businessName,
  paymentMethods = [],
  menu = [],
}) => {
  const order = useCardPlaceMenuOrder(businessId);

  if (menu.length === 0) {
    return (
      <CardPlaceBack flipped={flipped} onMovement={onMovement}>
        <EmptyMenu />
      </CardPlaceBack>
    );
  }

  const groups = separateByGroups({ lista: menu, limited: 3 });
  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {order.sharedTarget && (
        <Box
          sx={{
            mx: 1,
            mb: 1.25,
            px: 1.4,
            py: 1,
            borderRadius: 2,
            bgcolor: "rgba(255,75,69,.07)",
            border: "1px solid rgba(255,75,69,.15)",
          }}
        >
          <Typography variant="caption" color="primary.dark" fontWeight={800}>
            Los productos se agregarán directamente al pedido de {order.sharedTargetName}.
          </Typography>
        </Box>
      )}

      <Carousel adaptiveHeight draggable>
        {groups.map((items, groupIndex) => (
          <Box key={items[0]?.id ?? groupIndex}>
            {items.map((item) => {
              const sharedItem = order.sharedTarget ? order.getOwnSharedItem(item.id) : null;
              return (
                <CardMenuList
                  key={`${item.id}-${order.sharedTarget ? sharedItem?.version || "new" : "individual"}`}
                  item={item}
                  businessId={businessId}
                  businessName={businessName}
                  paymentMethods={paymentMethods}
                  onAddToCart={order.handleProductChange}
                  initialQuantity={Number(sharedItem?.quantity || 0)}
                  initialConfiguration={toSharedOrderItemConfiguration(sharedItem, item)}
                  busy={Number(order.busyMenuId) === Number(item.id)}
                  targetLabel={order.sharedTarget ? order.sharedTargetName : ""}
                />
              );
            })}
          </Box>
        ))}
      </Carousel>

      <Snackbar
        open={order.feedback.open}
        autoHideDuration={3000}
        onClose={order.closeFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={order.feedback.severity}
          variant="filled"
          onClose={order.closeFeedback}
        >
          {order.feedback.message}
        </Alert>
      </Snackbar>
    </CardPlaceBack>
  );
};

CardPlaceMenu.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  businessName: PropTypes.string,
  paymentMethods: PropTypes.arrayOf(PropTypes.object),
  menu: PropTypes.arrayOf(PropTypes.object),
};

export default CardPlaceMenu;
