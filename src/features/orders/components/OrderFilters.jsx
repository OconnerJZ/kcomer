import {
  Box,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

const OrderFilters = ({ filterStatus, onFilterChange, orderCount, onRefresh, loading }) => {
  return (
    <Box sx={{ pb: 1.5, mb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", sm: "center" }}>
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.688rem" }}
          >
            Filtrar
          </Typography>
          <FormControl size="small" sx={{ minWidth: { sm: 180 } }}>
            <Select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              sx={{
                fontSize: "0.875rem",
              }}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="preparing">En preparación</MenuItem>
              <MenuItem value="ready">Listas</MenuItem>
              <MenuItem value="completed">Completadas</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: "secondary.dark", fontWeight: 600 }}>
            {orderCount} {orderCount === 1 ? "orden" : "órdenes"}
          </Typography>
        </Stack>

        <IconButton onClick={onRefresh} disabled={loading} size="small" sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default OrderFilters;
