import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import EmptyState from "@Features/orders/components/EmptyState";
import KitchenBoard from "@Features/orders/components/KitchenBoard";
import OrderCard from "@Features/orders/components/OrderCard";
import OrderTable from "@Features/orders/components/OrderTable";

const OwnerOrdersContent = ({
  viewMode,
  filteredOrders,
  productionOrders,
  isMobile,
  isSmall,
  highlightedOrderId,
  now,
  onViewOrder,
  onUpdateStatus,
}) => {
  if (viewMode === "production") {
    return productionOrders.length > 0 ? (
      <KitchenBoard
        orders={productionOrders}
        now={now}
        onViewOrder={onViewOrder}
        onUpdateStatus={onUpdateStatus}
      />
    ) : <EmptyState />;
  }

  if (filteredOrders.length === 0) return <EmptyState />;

  if (!isMobile) {
    return (
      <OrderTable
        orders={filteredOrders}
        onViewOrder={onViewOrder}
        onUpdateStatus={onUpdateStatus}
        isSmall={isSmall}
        highlightedOrderId={highlightedOrderId}
        now={now}
      />
    );
  }

  return (
    <Stack spacing={{ xs: 0, sm: 2 }}>
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewOrder={onViewOrder}
          onUpdateStatus={onUpdateStatus}
          isSmall={isSmall}
          highlighted={String(order.id) === String(highlightedOrderId)}
          now={now}
        />
      ))}
    </Stack>
  );
};

OwnerOrdersContent.propTypes = {
  viewMode: PropTypes.oneOf(["list", "production"]).isRequired,
  filteredOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
  productionOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool.isRequired,
  highlightedOrderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  now: PropTypes.number.isRequired,
  onViewOrder: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func,
};

export default OwnerOrdersContent;
