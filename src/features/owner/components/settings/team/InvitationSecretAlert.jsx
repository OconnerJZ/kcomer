import { Alert, Button, Stack, Typography } from "@mui/material";
import { ContentCopy, Key } from "@mui/icons-material";

export default function InvitationSecretAlert({ invitation, onCopy }) {
  if (!invitation) return null;
  const isTransfer = invitation.type === "ownership_transfer";
  return <Alert severity={isTransfer ? "warning" : "success"} icon={<Key />}><Stack spacing={1}>
    <Typography variant="body2" fontWeight={800}>{isTransfer ? "Solicitud de traspaso" : "Invitación lista"}</Typography>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <Button size="small" variant="outlined" startIcon={<ContentCopy />} onClick={() => onCopy(invitation.invitationUrl)}>Copiar enlace</Button>
      <Button size="small" variant="outlined" startIcon={<ContentCopy />} onClick={() => onCopy(invitation.code)}>Código: {invitation.code}</Button>
    </Stack>
    <Typography variant="caption">Este secreto sólo se muestra ahora. La invitación vence en 7 días.</Typography>
  </Stack></Alert>;
}

