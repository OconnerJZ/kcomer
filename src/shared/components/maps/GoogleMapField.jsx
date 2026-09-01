import PropTypes from "prop-types";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import useGoogleMapField from "@Shared/hooks/useGoogleMapField";

const coordinateType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

const GoogleMapField = ({
  value,
  onChange,
  label = "Ubicación",
  apiKey,
  height = 320,
  compact = false,
}) => {
  const {
    mapNodeRef,
    loading,
    error,
    address,
    locate,
  } = useGoogleMapField({ value, onChange, apiKey, compact });

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      {error && <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>}
      <TextField
        fullWidth
        size={compact ? "small" : "medium"}
        value={address}
        placeholder="Selecciona el punto exacto en el mapa"
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <Tooltip title="Usar mi ubicación">
                <span>
                  <IconButton
                    size="small"
                    onClick={locate}
                    disabled={loading}
                    aria-label="Usar mi ubicación actual"
                  >
                    <MyLocation fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ),
          },
        }}
        sx={{ mb: 1.25 }}
      />
      <Paper
        elevation={0}
        sx={{
          height,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
        }}
      >
        <Box ref={mapNodeRef} sx={{ width: "100%", height: "100%" }} />
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(255,255,255,.72)",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

GoogleMapField.propTypes = {
  value: PropTypes.shape({
    lat: coordinateType,
    lng: coordinateType,
    latitude: coordinateType,
    longitude: coordinateType,
    address: PropTypes.string,
    formatted_address: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  apiKey: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  compact: PropTypes.bool,
};

export default GoogleMapField;
