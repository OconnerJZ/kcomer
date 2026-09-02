import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { CheckCircle, Store } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@Features/auth/context/useAuth";
import { useAcceptBusinessInvitationCodeMutation, useAcceptBusinessInvitationMutation, useGetBusinessInvitationQuery } from "@Features/business/api/business.api";

export default function BusinessInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { data, isLoading, error } = useGetBusinessInvitationQuery({ token }, { skip: !token });
  const [acceptInvitation, { isLoading: accepting }] = useAcceptBusinessInvitationMutation();
  const [acceptCode, { isLoading: acceptingCode }] = useAcceptBusinessInvitationCodeMutation();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  const accept = async () => {
    try {
      const response = await acceptInvitation({ token }).unwrap();
      setResult(response);
      await updateUser();
    } catch (err) { setAcceptError(err?.data?.message || err?.message || "No se pudo aceptar la invitación"); }
  };

  const submitCode = async () => {
    try {
      setAcceptError("");
      const response = await acceptCode({ code: code.trim().toUpperCase() }).unwrap();
      setResult(response);
      await updateUser();
    } catch (err) { setAcceptError(err?.data?.message || err?.message || "El código no es válido o ya expiró"); }
  };

  return <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 8 }, px: { xs: 1.5, sm: 3 } }}><Paper elevation={0} sx={{ p: { xs: 2.5, sm: 5 }, border: "1px solid", borderColor: "divider", borderRadius: 3 }}><Stack spacing={2.5} alignItems="center" textAlign="center">
    <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: "rgba(255,75,69,.08)", color: "primary.main", display: "grid", placeItems: "center" }}>{result ? <CheckCircle fontSize="large" /> : <Store fontSize="large" />}</Box>
    {token && isLoading && <CircularProgress />}
    {error && <Alert severity="error">{error?.data?.message || "La invitación no está disponible"}</Alert>}
    {data && !result && <><Typography variant="h4" fontWeight={850}>{data.type === "ownership_transfer" ? "Traspaso de local" : "Invitación al equipo"}</Typography><Typography color="text.secondary"><strong>{data.businessName}</strong> te invita como <strong>{data.role}</strong>. La invitación está dirigida a {data.email}; iniciaste sesión como {user?.email}.</Typography><Button size="large" variant="contained" onClick={accept} disabled={accepting || data.status !== "pending"} sx={{ width: { xs: "100%", sm: "auto" } }}>{accepting ? <CircularProgress size={24} /> : "Aceptar invitación"}</Button></>}
    {!token && !result && <><Typography variant="h4" fontWeight={850}>Unirme a un equipo</Typography><Typography color="text.secondary">Escribe el código que te compartió el owner. El código sólo funcionará con el email al que fue enviada la invitación.</Typography><TextField label="Código de invitación" value={code} onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))} inputProps={{ maxLength: 8, style: { textAlign: "center", letterSpacing: ".22em", fontWeight: 800 } }} fullWidth /><Button size="large" variant="contained" onClick={submitCode} disabled={acceptingCode || code.length < 6}>{acceptingCode ? <CircularProgress size={24} /> : "Aceptar código"}</Button></>}
    {acceptError && <Alert severity="error">{acceptError}</Alert>}
    {result && <><Typography variant="h4" fontWeight={850}>Acceso confirmado</Typography><Typography color="text.secondary">El local ya aparece en tu panel con los permisos asignados.</Typography><Button variant="contained" onClick={() => navigate("/owner", { replace: true })}>Abrir panel del negocio</Button></>}
  </Stack></Paper></Container>;
}
