import PropTypes from "prop-types";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";

export default function AdminMetricCard({ label, value, detail, loading = false }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.25, minHeight: 128 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width="58%" height={42} />
        ) : (
          <Typography variant="h4" fontWeight={750} sx={{ letterSpacing: "-0.025em" }}>
            {value}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {detail}
        </Typography>
      </Stack>
    </Paper>
  );
}

AdminMetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  detail: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};
