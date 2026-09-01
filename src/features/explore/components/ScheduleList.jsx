import PropTypes from "prop-types";
import { AccessTime } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

const scheduleRowType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  day: PropTypes.string.isRequired,
  opened: PropTypes.string.isRequired,
  closedAt: PropTypes.string.isRequired,
  closed: PropTypes.bool.isRequired,
  isToday: PropTypes.bool.isRequired,
});

const ScheduleRow = ({ row }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "16px minmax(0,1fr)", sm: "22px minmax(88px,1fr) auto" },
      alignItems: "center",
      gap: 1.2,
      px: 1.4,
      py: 1.15,
      borderRadius: 2.4,
      bgcolor: row.isToday ? "rgba(255,75,69,.055)" : "transparent",
    }}
  >
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: row.isToday ? "primary.main" : row.closed ? "grey.300" : "grey.400",
        boxShadow: row.isToday ? "0 0 0 5px rgba(255,75,69,.10)" : "none",
        justifySelf: "center",
      }}
    />
    <Stack direction="row" spacing={0.8} alignItems="center" minWidth={0}>
      <Typography variant="body2" fontWeight={row.isToday ? 850 : 650} noWrap>
        {row.day}
      </Typography>
      {row.isToday && (
        <Typography
          variant="caption"
          color="primary.main"
          fontWeight={850}
          sx={{ fontSize: ".62rem", letterSpacing: ".08em" }}
        >
          HOY
        </Typography>
      )}
    </Stack>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 750,
        color: row.closed ? "text.disabled" : "text.primary",
        gridColumn: { xs: "2", sm: "3" },
        whiteSpace: "nowrap",
      }}
    >
      {row.closed ? "Cerrado" : `${row.opened} – ${row.closedAt}`}
    </Typography>
  </Box>
);

ScheduleRow.propTypes = {
  row: scheduleRowType.isRequired,
};

const EmptySchedule = () => (
  <Box sx={{ py: 4.5, px: 2, textAlign: "center" }}>
    <Box
      sx={{
        width: 52,
        height: 52,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        bgcolor: "action.hover",
        mx: "auto",
        mb: 1.4,
      }}
    >
      <AccessTime sx={{ color: "text.secondary" }} />
    </Box>
    <Typography variant="body2" fontWeight={800}>Horario no disponible</Typography>
    <Typography variant="caption" color="text.secondary">
      Este negocio todavía no ha publicado sus horarios.
    </Typography>
  </Box>
);

const ScheduleList = ({ rows }) => {
  if (rows.length === 0) return <EmptySchedule />;

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.35, mb: 1.1 }}>
        <AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={800}
          sx={{ letterSpacing: ".04em" }}
        >
          SEMANA HABITUAL
        </Typography>
      </Stack>
      <Stack spacing={0.12}>
        {rows.map((row) => <ScheduleRow key={row.id} row={row} />)}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1.7, px: 1.4, lineHeight: 1.55 }}
      >
        Los horarios pueden variar en días festivos o fechas especiales.
      </Typography>
    </>
  );
};

ScheduleList.propTypes = {
  rows: PropTypes.arrayOf(scheduleRowType).isRequired,
};

export default ScheduleList;
