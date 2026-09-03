import PropTypes from "prop-types";
import { Box, Fade } from "@mui/material";
import OwnerMenu from "../../pages/OwnerMenu";
import OwnerOrders from "../../pages/OwnerOrders";
import OwnerReports from "../../pages/OwnerReports";
import OwnerSettings from "../../pages/OwnerSettings";

const OwnerDashboardContent = ({
  displayedTab,
  allowedTabs,
  businessId,
  selectedBusiness,
  businessOrders,
  focusedOrderId,
  onFocusHandled,
  onRefreshBusinesses,
  isAdmin,
}) => (
  <Fade in timeout={500}>
    <Box>
      {displayedTab === 0 && allowedTabs.includes(0) && (
        <OwnerOrders
          ordersState={businessOrders}
          focusedOrderId={focusedOrderId}
          onFocusHandled={onFocusHandled}
          permissions={selectedBusiness.permissions}
          isAdmin={isAdmin}
        />
      )}
      {displayedTab === 1 && allowedTabs.includes(1) && (
        <OwnerMenu businessId={businessId} />
      )}
      {displayedTab === 2 && allowedTabs.includes(2) && (
        <OwnerReports businessId={businessId} />
      )}
      {displayedTab === 3 && allowedTabs.includes(3) && (
        <OwnerSettings businessData={selectedBusiness} onRefresh={onRefreshBusinesses} />
      )}
    </Box>
  </Fade>
);

OwnerDashboardContent.propTypes = {
  displayedTab: PropTypes.number.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.number).isRequired,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selectedBusiness: PropTypes.shape({
    permissions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  businessOrders: PropTypes.shape({
    orders: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    updateOrderStatus: PropTypes.func.isRequired,
    updateKitchenItemStatus: PropTypes.func.isRequired,
    refreshOrders: PropTypes.func.isRequired,
  }).isRequired,
  focusedOrderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onFocusHandled: PropTypes.func.isRequired,
  onRefreshBusinesses: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default OwnerDashboardContent;
