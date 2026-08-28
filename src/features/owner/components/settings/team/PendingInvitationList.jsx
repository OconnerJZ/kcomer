import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { getBusinessRoleLabel } from "@Features/owner/model/teamAccess";

export default function PendingInvitationList({ invitations = [], onCancel }) {
  if (!invitations.length) return null;
  return <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}><Typography fontWeight={800} sx={{ mb: 1.5 }}>Invitaciones pendientes</Typography><Stack spacing={1}>
    {invitations.map((invitation) => <Stack key={invitation.id} direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={700}>{invitation.email}</Typography><Typography variant="caption" color="text.secondary">{getBusinessRoleLabel(invitation.role)} · vence {new Date(invitation.expiresAt).toLocaleDateString()}</Typography></Box>
      <Chip size="small" label={invitation.type === "ownership_transfer" ? "Traspaso" : "Pendiente"} />
      <IconButton color="error" onClick={() => onCancel(invitation)}><DeleteOutline /></IconButton>
    </Stack>)}
  </Stack></Paper>;
}

