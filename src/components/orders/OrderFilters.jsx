import {
  Paper,
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
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="overline"
            sx={{
              color: "#666",
              fontWeight: 600,
              letterSpacing: "0.1em",
              fontSize: "0.688rem",
            }}
          >
            Filtrar
          </Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              sx={{
                borderRadius: 0,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1a1a1a",
                },
              }}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="preparing">En preparación</MenuItem>
              <MenuItem value="ready">Listas</MenuItem>
              <MenuItem value="completed">Completadas</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant="caption"
            sx={{
              color: "#1a1a1a",
              fontWeight: 500,
              px: 1.5,
              py: 0.5,
            }}
          >
            {orderCount}
          </Typography>
        </Stack>

        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default OrderFilters;