import { useState } from "react";
import { Alert, Box, CircularProgress, Paper, Snackbar, Stack, Typography } from "@mui/material";
import useBusinessTeam from "@Features/owner/hooks/useBusinessTeam";
import { getTeamErrorMessage } from "@Features/owner/model/teamAccess";
import InvitationSecretAlert from "./team/InvitationSecretAlert";
import InviteMemberPanel from "./team/InviteMemberPanel";
import TeamMemberList from "./team/TeamMemberList";
import PendingInvitationList from "./team/PendingInvitationList";
import OwnershipTransferPanel from "./team/OwnershipTransferPanel";

export default function TeamAccessTab({ businessId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [transferEmail, setTransferEmail] = useState("");
  const [retainPrevious, setRetainPrevious] = useState(true);
  const [latestInvite, setLatestInvite] = useState(null);
  const [notice, setNotice] = useState({ open: false, severity: "success", message: "" });
  const teamAccess = useBusinessTeam(businessId);
  const show = (message, severity = "success") => setNotice({ open: true, message, severity });
  const run = async (action, successMessage) => {
    try { const result = await action(); show(successMessage); return result; }
    catch (error) { show(getTeamErrorMessage(error), "error"); return null; }
  };
  const copy = async (value) => {
    try { await navigator.clipboard.writeText(value); show("Copiado al portapapeles"); }
    catch { show("No se pudo copiar; selecciona el texto manualmente", "error"); }
  };

  if (teamAccess.isLoading) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  const handleInvite = async () => {
    const invitation = await run(() => teamAccess.invite(email, role), "Invitación creada. Comparte el enlace o el código.");
    if (invitation) { setLatestInvite(invitation); setEmail(""); }
  };
  const handleTransfer = async () => {
    if (!window.confirm("La otra persona deberá aceptar. Al hacerlo será el owner principal del local.")) return;
    const invitation = await run(() => teamAccess.transferOwnership(transferEmail, retainPrevious), "Solicitud de traspaso creada. La propiedad no cambia hasta que sea aceptada.");
    if (invitation) { setLatestInvite(invitation); setTransferEmail(""); }
  };

  return <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: "10px", border: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,.88)" }}><Stack spacing={{ xs: 2, sm: 3 }}>
    <Box><Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em" }}>EQUIPO Y ACCESO</Typography><Typography variant="h5" fontWeight={850}>Personas que operan este local</Typography><Typography variant="body2" color="text.secondary">Cada permiso está limitado a este negocio. Un colaborador no obtiene acceso a tus otros locales.</Typography></Box>
    {teamAccess.error && <Alert severity="error">{getTeamErrorMessage(teamAccess.error)}</Alert>}
    <InvitationSecretAlert invitation={latestInvite} onCopy={copy} />
    <InviteMemberPanel email={email} role={role} loading={teamAccess.isInviting} onEmailChange={setEmail} onRoleChange={setRole} onInvite={handleInvite} />
    <TeamMemberList members={teamAccess.team.members} onRoleChange={(member, nextRole) => run(() => teamAccess.changeRole(member.userId, nextRole), "Rol actualizado")} onRemove={(member) => { if (window.confirm(`¿Quitar a ${member.name || member.email} de este local?`)) run(() => teamAccess.removeMember(member.userId), "Miembro eliminado"); }} />
    <PendingInvitationList invitations={teamAccess.team.invitations} onCancel={(invitation) => run(() => teamAccess.cancelInvitation(invitation.id), "Invitación cancelada")} />
    <OwnershipTransferPanel email={transferEmail} retainPrevious={retainPrevious} loading={teamAccess.isTransferring} onEmailChange={setTransferEmail} onRetainChange={setRetainPrevious} onTransfer={handleTransfer} />
    <Snackbar open={notice.open} autoHideDuration={4500} onClose={() => setNotice((current) => ({ ...current, open: false }))}><Alert severity={notice.severity}>{notice.message}</Alert></Snackbar>
  </Stack></Paper>;
}
