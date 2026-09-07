import PropTypes from "prop-types";
import { Box, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const shortDay = (value) => {
  const [, month = "", day = ""] = String(value || "").split("-");
  return month && day ? `${day}/${month}` : String(value || "");
};

export default function AdminTrendChart({ rows, loading = false }) {
  const theme = useTheme();
  const data = rows.map((row) => ({ ...row, label: shortDay(row.day) }));

  return (
    <Paper variant="outlined" sx={{ p: 2.5, minHeight: 340 }}>
      <Typography variant="h6" fontWeight={700}>Actividad de órdenes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        Órdenes creadas durante los últimos 14 días.
      </Typography>

      {loading ? (
        <Skeleton variant="rounded" height={245} />
      ) : data.length ? (
        <Box sx={{ width: "100%", height: 245 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                formatter={(value) => [Number(value).toLocaleString("es-MX"), "Órdenes"]}
                labelFormatter={(label) => `Día ${label}`}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={theme.palette.primary.main}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ minHeight: 245, display: "grid", placeItems: "center" }}>
          <Typography variant="body2" color="text.secondary">Aún no hay órdenes en este periodo.</Typography>
        </Box>
      )}
    </Paper>
  );
}

AdminTrendChart.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string.isRequired,
    orders: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
  })).isRequired,
  loading: PropTypes.bool,
};
