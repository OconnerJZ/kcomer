import PropTypes from "prop-types";
import { Box, LinearProgress, Paper, Skeleton, Stack, Typography } from "@mui/material";

export default function AdminBreakdownPanel({ title, subtitle, rows, loading = false, emptyMessage }) {
  const max = Math.max(1, ...rows.map((row) => Number(row.amount) || 0));

  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.25 }}>
        {subtitle}
      </Typography>

      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((item) => <Skeleton key={item} height={42} />)}
        </Stack>
      ) : rows.length ? (
        <Stack spacing={2}>
          {rows.map((row) => (
            <Box key={row.key}>
              <Stack direction="row" justifyContent="space-between" gap={2} sx={{ mb: 0.75 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={650} noWrap>{row.label}</Typography>
                  {row.secondary && (
                    <Typography variant="caption" color="text.secondary">{row.secondary}</Typography>
                  )}
                </Box>
                <Typography variant="body2" fontWeight={700}>{row.value}</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((Number(row.amount) || 0) / max) * 100)}
                sx={{ height: 5, borderRadius: 4 }}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
      )}
    </Paper>
  );
}

AdminBreakdownPanel.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    amount: PropTypes.number.isRequired,
    secondary: PropTypes.string,
  })).isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string.isRequired,
};
