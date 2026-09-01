import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import CustomerOrderCard from "./CustomerOrderCard";

const CustomerOrdersGrid = ({
  orders,
  expandedOrder,
  expandedHistory,
  onToggleOrder,
  onToggleHistory,
  onCancel,
  onEdit,
}) => (
  <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center" alignItems="flex-start">
    {orders.map((order) => (
      <Grid item xs={12} sm={6} md={4} key={order.id}>
        <CustomerOrderCard
          order={order}
          expanded={expandedOrder === order.id}
          historyExpanded={expandedHistory === order.id}
          onToggle={() => onToggleOrder(order.id)}
          onToggleHistory={() => onToggleHistory(order.id)}
          onCancel={() => onCancel(order.id)}
          onEdit={() => onEdit(order)}
        />
      </Grid>
    ))}
  </Grid>
);

CustomerOrdersGrid.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  expandedOrder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  expandedHistory: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onToggleOrder: PropTypes.func.isRequired,
  onToggleHistory: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CustomerOrdersGrid;
