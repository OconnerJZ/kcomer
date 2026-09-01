import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { getBusinessRoleLabel } from "@Features/owner/model/teamAccess";

export default function PendingInvitationList({ invitations = [], onCancel }) {
  if (!invitations.length) return null;
  return <Box sx={{ py: 2, borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}><Typography fontWeight={800} sx={{ mb: 1.5 }}>Invitaciones pendientes</Typography><Stack spacing={1}>
    {invitations.map((invitation) => <Stack key={invitation.id} direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} spacing={1.25}>
      <Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={700}>{invitation.email}</Typography><Typography variant="caption" color="text.secondary">{getBusinessRoleLabel(invitation.role)} · vence {new Date(invitation.expiresAt).toLocaleDateString()}</Typography></Box>
      <Chip size="small" label={invitation.type === "ownership_transfer" ? "Traspaso" : "Pendiente"} />
      <IconButton color="error" onClick={() => onCancel(invitation)}><DeleteOutline /></IconButton>
    </Stack>)}
  </Stack></Box>;
}
