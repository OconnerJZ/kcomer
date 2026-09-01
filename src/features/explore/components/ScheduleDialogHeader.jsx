import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ScheduleDialogHeader = ({ presentation, onClose }) => (
  <Box
    sx={{
      position: "relative",
      minHeight: 185,
      px: 2.4,
      pt: 2.2,
      pb: 2.3,
      color: "common.white",
      backgroundImage: presentation.coverUrl
        ? `linear-gradient(180deg, rgba(18,18,18,.20), rgba(18,18,18,.78)), url(${presentation.coverUrl})`
        : "linear-gradient(135deg, #9f2623 0%, #c53d37 55%, #e05a4f 100%)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Typography
        variant="overline"
        sx={{
          color: "rgba(255,255,255,.78)",
          letterSpacing: ".16em",
          fontSize: ".62rem",
          fontWeight: 800,
        }}
      >
        Horarios del negocio
      </Typography>
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="cerrar horarios"
        sx={{
          color: "common.white",
          bgcolor: "rgba(255,255,255,.13)",
          backdropFilter: "blur(8px)",
          "&:hover": { bgcolor: "rgba(255,255,255,.20)" },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Stack>

    <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mt: 3.2 }}>
      <Avatar
        src={presentation.logoUrl}
        sx={{
          width: 54,
          height: 54,
          border: "2px solid rgba(255,255,255,.88)",
          bgcolor: "common.white",
          color: "text.primary",
          boxShadow: "0 7px 20px rgba(0,0,0,.18)",
        }}
      >
        {presentation.businessInitial}
      </Avatar>
      <Box minWidth={0}>
        <Typography variant="h5" fontWeight={900} noWrap sx={{ letterSpacing: "-.02em" }}>
          {presentation.businessName}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 0.7 }}
        >
          <Chip
            size="small"
            label={presentation.isOpenNow ? "Abierto ahora" : "Cerrado ahora"}
            sx={{
              height: 24,
              bgcolor: presentation.isOpenNow
                ? "rgba(229,255,235,.94)"
                : "rgba(255,255,255,.16)",
              color: presentation.isOpenNow ? "success.dark" : "common.white",
              fontWeight: 850,
              backdropFilter: "blur(8px)",
            }}
          />
          {presentation.todayHours && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,.82)", fontWeight: 700 }}
            >
              {presentation.todayHours}
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  </Box>
);

ScheduleDialogHeader.propTypes = {
  presentation: PropTypes.shape({
    coverUrl: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    businessName: PropTypes.string.isRequired,
    businessInitial: PropTypes.string.isRequired,
    isOpenNow: PropTypes.bool.isRequired,
    todayHours: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ScheduleDialogHeader;
