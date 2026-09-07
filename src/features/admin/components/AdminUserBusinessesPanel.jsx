import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { StorefrontRounded } from "@mui/icons-material";
import { adminUserBusinessesPropType } from "../model/adminUserPropTypes";

const roleLabel = (value = "") => String(value).replaceAll("_", " ");
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("es-MX") : "—";

export default function AdminUserBusinessesPanel({ businesses }) {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography variant="overline" color="text.secondary">NEGOCIOS</Typography>
        <Typography variant="h6" fontWeight={700}>Membresías</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Lectura administrativa de los roles que este usuario ya tiene dentro de cada negocio.
        </Typography>
      </Box>

      <Divider />

      {!businesses.length ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <StorefrontRounded sx={{ color: "text.disabled", fontSize: 36 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Este usuario no pertenece a ningún negocio.
          </Typography>
        </Box>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {businesses.map((membership) => (
            <Stack
              key={membership.membershipId || `${membership.businessId}-${membership.role}`}
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={1}
              sx={{ px: { xs: 2, md: 2.5 }, py: 1.6 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={650} noWrap>{membership.businessName || `Negocio #${membership.businessId}`}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Negocio #{membership.businessId} · Desde {dateLabel(membership.joinedAt)}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={roleLabel(membership.role)}
                variant="outlined"
                sx={{ textTransform: "capitalize", alignSelf: { xs: "flex-start", sm: "center" } }}
              />
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

AdminUserBusinessesPanel.propTypes = {
  businesses: adminUserBusinessesPropType.isRequired,
};
