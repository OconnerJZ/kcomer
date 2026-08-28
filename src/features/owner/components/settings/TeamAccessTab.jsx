import { useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Divider, FormControlLabel,
  IconButton, MenuItem, Paper, Select, Snackbar, Stack, Switch, TextField, Typography,
} from "@mui/material";
import { ContentCopy, DeleteOutline, GroupAdd, Key, SwapHoriz } from "@mui/icons-material";
import {
  useCancelBusinessInvitationMutation,
  useCreateOwnershipTransferMutation,
  useGetBusinessTeamQuery,
  useInviteBusinessMemberMutation,
  useRemoveBusinessMemberMutation,
  useUpdateBusinessMemberMutation,
} from "@Features/business/api/business.api";

const ROLES = [
  { value: "co_owner", label: "Co-owner" },
  { value: "manager", label: "Manager" },
  { value: "kitchen", label: "Cocina" },
  { value: "cashier", label: "Caja" },
];
const roleLabel = (role) => role === "primary_owner" ? "Owner principal" : ROLES.find((item) => item.value === role)?.label || role;
const messageFrom = (error) => error?.data?.message || error?.message || "No se pudo completar la acción";

export default function TeamAccessTab({ businessId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [transferEmail, setTransferEmail] = useState("");
  const [retainPrevious, setRetainPrevious] = useState(true);
  const [latestInvite, setLatestInvite] = useState(null);
  const [notice, setNotice] = useState({ open: false, severity: "success", message: "" });
  const { data, isLoading, error } = useGetBusinessTeamQuery({ businessId });
  const [inviteMember, { isLoading: inviting }] = useInviteBusinessMemberMutation();
  const [cancelInvitation] = useCancelBusinessInvitationMutation();
  const [updateMember] = useUpdateBusinessMemberMutation();
  const [removeMember] = useRemoveBusinessMemberMutation();
  const [createTransfer, { isLoading: transferring }] = useCreateOwnershipTransferMutation();

  const team = data || { members: [], invitations: [] };
  const show = (message, severity = "success") => setNotice({ open: true, message, severity });
  const copy = async (value) => {
    await navigator.clipboard.writeText(value);
    show("Copiado al portapapeles");
  };

  const handleInvite = async () => {
    try {
      const result = await inviteMember({ businessId, email, role }).unwrap();
      setLatestInvite(result);
      setEmail("");
      show("Invitación creada. Comparte el enlace o el código.");
    } catch (err) { show(messageFrom(err), "error"); }
  };

  const handleTransfer = async () => {
    if (!window.confirm("La otra persona deberá aceptar. Al hacerlo será el owner principal del local.")) return;
    try {
      const result = await createTransfer({ businessId, email: transferEmail, retainPreviousAsCoOwner: retainPrevious }).unwrap();
      setLatestInvite(result);
      setTransferEmail("");
      show("Solicitud de traspaso creada. La propiedad no cambia hasta que sea aceptada.");
    } catch (err) { show(messageFrom(err), "error"); }
  };

  if (isLoading) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em" }}>EQUIPO Y ACCESO</Typography>
        <Typography variant="h5" fontWeight={850}>Personas que operan este local</Typography>
        <Typography variant="body2" color="text.secondary">Cada permiso está limitado a este negocio. Un colaborador no obtiene acceso a tus otros locales.</Typography>
      </Box>

      {error && <Alert severity="error">{messageFrom(error)}</Alert>}
      {latestInvite && (
        <Alert severity={latestInvite.type === "ownership_transfer" ? "warning" : "success"} icon={<Key />}>
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={800}>{latestInvite.type === "ownership_transfer" ? "Solicitud de traspaso" : "Invitación lista"}</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button size="small" variant="outlined" startIcon={<ContentCopy />} onClick={() => copy(latestInvite.invitationUrl)}>Copiar enlace</Button>
              <Button size="small" variant="outlined" startIcon={<ContentCopy />} onClick={() => copy(latestInvite.code)}>Código: {latestInvite.code}</Button>
            </Stack>
            <Typography variant="caption">Este secreto sólo se muestra ahora. La invitación vence en 7 días.</Typography>
          </Stack>
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center"><GroupAdd color="primary" /><Typography fontWeight={800}>Invitar colaborador</Typography></Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
            <Select value={role} onChange={(event) => setRole(event.target.value)} sx={{ minWidth: 180 }}>{ROLES.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select>
            <Button variant="contained" disabled={inviting || !email.trim()} onClick={handleInvite} sx={{ minWidth: 130 }}>{inviting ? <CircularProgress size={22} /> : "Invitar"}</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 2 }}><Typography fontWeight={800}>Miembros activos</Typography><Typography variant="caption" color="text.secondary">{team.members?.length || 0} personas</Typography></Box>
        <Divider />
        {(team.members || []).map((member, index) => (
          <Box key={member.userId} sx={{ px: 2.5, py: 1.5, display: "flex", gap: 1.5, alignItems: "center", borderBottom: index < team.members.length - 1 ? "1px solid" : 0, borderColor: "divider" }}>
            <Avatar src={member.avatar}>{member.name?.[0]}</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" fontWeight={800}>{member.name || member.email}</Typography><Typography variant="caption" color="text.secondary">{member.email}</Typography></Box>
            {member.role === "primary_owner" ? <Chip label="Owner principal" size="small" color="primary" /> : (
              <>
                <Select size="small" value={member.role} onChange={async (event) => { try { await updateMember({ businessId, userId: member.userId, role: event.target.value }).unwrap(); show("Rol actualizado"); } catch (err) { show(messageFrom(err), "error"); } }}>{ROLES.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select>
                <IconButton color="error" aria-label="quitar miembro" onClick={async () => { if (!window.confirm(`¿Quitar a ${member.name || member.email} de este local?`)) return; try { await removeMember({ businessId, userId: member.userId }).unwrap(); show("Miembro eliminado"); } catch (err) { show(messageFrom(err), "error"); } }}><DeleteOutline /></IconButton>
              </>
            )}
          </Box>
        ))}
      </Paper>

      {(team.invitations || []).length > 0 && <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}><Typography fontWeight={800} sx={{ mb: 1.5 }}>Invitaciones pendientes</Typography><Stack spacing={1}>{team.invitations.map((invitation) => <Stack key={invitation.id} direction="row" alignItems="center" spacing={1.5}><Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={700}>{invitation.email}</Typography><Typography variant="caption" color="text.secondary">{roleLabel(invitation.role)} · vence {new Date(invitation.expiresAt).toLocaleDateString()}</Typography></Box><Chip size="small" label={invitation.type === "ownership_transfer" ? "Traspaso" : "Pendiente"} /><IconButton color="error" onClick={async () => { try { await cancelInvitation({ businessId, invitationId: invitation.id }).unwrap(); show("Invitación cancelada"); } catch (err) { show(messageFrom(err), "error"); } }}><DeleteOutline /></IconButton></Stack>)}</Stack></Paper>}

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "warning.light" }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center"><SwapHoriz color="warning" /><Box><Typography fontWeight={800}>Traspasar el local</Typography><Typography variant="caption" color="text.secondary">Requiere aceptación de la otra persona. Hasta entonces sigues siendo owner principal.</Typography></Box></Stack>
          <TextField label="Email del nuevo owner principal" type="email" value={transferEmail} onChange={(event) => setTransferEmail(event.target.value)} />
          <FormControlLabel control={<Switch checked={retainPrevious} onChange={(event) => setRetainPrevious(event.target.checked)} />} label="Conservar mi acceso como co-owner después del traspaso" />
          <Button color="warning" variant="outlined" disabled={transferring || !transferEmail.trim()} onClick={handleTransfer} sx={{ alignSelf: "flex-start" }}>{transferring ? <CircularProgress size={22} /> : "Crear solicitud de traspaso"}</Button>
        </Stack>
      </Paper>

      <Snackbar open={notice.open} autoHideDuration={4500} onClose={() => setNotice((current) => ({ ...current, open: false }))}><Alert severity={notice.severity}>{notice.message}</Alert></Snackbar>
    </Stack>
  );
}

