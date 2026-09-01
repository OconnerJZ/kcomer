import PropTypes from "prop-types";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { ViewKanban, ViewList } from "@mui/icons-material";
import OrderFilters from "@Features/orders/components/OrderFilters";

const OwnerOrdersToolbar = ({
  viewMode,
  canViewKitchen,
  filterStatus,
  orderCount,
  loading,
  onViewModeChange,
  onFilterChange,
  onRefresh,
}) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "stretch", sm: "center" }}
    gap={1.5}
    sx={{ mb: 1 }}
  >
    <Box sx={{ flex: 1 }}>
      {viewMode === "list" && (
        <OrderFilters
          filterStatus={filterStatus}
          onFilterChange={onFilterChange}
          orderCount={orderCount}
          onRefresh={onRefresh}
          loading={loading}
        />
      )}
    </Box>
    <ButtonGroup
      size="small"
      variant="outlined"
      aria-label="vista de órdenes"
      sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
    >
      <Button
        startIcon={<ViewList />}
        variant={viewMode === "list" ? "contained" : "outlined"}
        onClick={() => onViewModeChange("list")}
        sx={{ textTransform: "none" }}
      >
        Lista
      </Button>
      {canViewKitchen && (
        <Button
          startIcon={<ViewKanban />}
          variant={viewMode === "production" ? "contained" : "outlined"}
          onClick={() => onViewModeChange("production")}
          sx={{ textTransform: "none" }}
        >
          Producción
        </Button>
      )}
    </ButtonGroup>
  </Stack>
);

OwnerOrdersToolbar.propTypes = {
  viewMode: PropTypes.oneOf(["list", "production"]).isRequired,
  canViewKitchen: PropTypes.bool.isRequired,
  filterStatus: PropTypes.string.isRequired,
  orderCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default OwnerOrdersToolbar;
