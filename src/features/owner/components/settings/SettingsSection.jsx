import PropTypes from "prop-types";
import { Box, Paper, Typography } from "@mui/material";

const SettingsSection = ({ eyebrow, title, description, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 3 },
      borderRadius: "10px",
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "rgba(255,255,255,.88)",
    }}
  >
    <Box sx={{ mb: 3 }}>
      {eyebrow && (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h6" fontWeight={800}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
          {description}
        </Typography>
      )}
    </Box>
    {children}
  </Paper>
);

SettingsSection.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SettingsSection;
