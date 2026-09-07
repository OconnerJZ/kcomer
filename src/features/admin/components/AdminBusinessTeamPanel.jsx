import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const ROLE_LABELS = Object.freeze({
  primary_owner: "Propietario principal",
  co_owner: "Co-owner",
  manager: "Manager",
  kitchen: "Cocina",
  cashier: "Caja",
});

const initials = (name = "") => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join("") || "?";

export default function AdminBusinessTeamPanel({ team = [] }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Equipo</Typography>
          <Typography variant="body2" color="text.secondary">
            {team.length} miembro{team.length === 1 ? "" : "s"} con acceso al negocio.
          </Typography>
        </Box>

        {!team.length && (
          <Typography variant="body2" color="text.secondary">No hay miembros registrados.</Typography>
        )}

        {team.map((member, index) => (
          <Box key={member.id || `${member.userId}-${member.role}`}>
            {index > 0 && <Divider sx={{ mb: 1.75 }} />}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={member.avatar || undefined} sx={{ width: 38, height: 38 }}>
                {initials(member.name || member.email)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{member.name || "Sin nombre"}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {member.email || "Sin email"}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={ROLE_LABELS[member.role] || member.role || "Miembro"}
                variant="outlined"
              />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
