import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import { CheckCircle, Store } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useAcceptBusinessInvitationMutation, useGetBusinessInvitationQuery } from "@Features/business/api/business.api";

export default function BusinessInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { data, isLoading, error } = useGetBusinessInvitationQuery({ token });
  const [acceptInvitation, { isLoading: accepting }] = useAcceptBusinessInvitationMutation();
  const [result, setResult] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  const accept = async () => {
    try {
      const response = await acceptInvitation({ token }).unwrap();
      setResult(response);
      await updateUser();
    } catch (err) { setAcceptError(err?.data?.message || err?.message || "No se pudo aceptar la invitación"); }
  };

  return <Container maxWidth="sm" sx={{ py: 8 }}><Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}><Stack spacing={2.5} alignItems="center" textAlign="center">
    <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: "rgba(255,75,69,.08)", color: "primary.main", display: "grid", placeItems: "center" }}>{result ? <CheckCircle fontSize="large" /> : <Store fontSize="large" />}</Box>
    {isLoading && <CircularProgress />}
    {error && <Alert severity="error">{error?.data?.message || "La invitación no está disponible"}</Alert>}
    {data && !result && <><Typography variant="h4" fontWeight={850}>{data.type === "ownership_transfer" ? "Traspaso de local" : "Invitación al equipo"}</Typography><Typography color="text.secondary"><strong>{data.businessName}</strong> te invita como <strong>{data.role}</strong>. La invitación está dirigida a {data.email}; iniciaste sesión como {user?.email}.</Typography><Button size="large" variant="contained" onClick={accept} disabled={accepting || data.status !== "pending"}>{accepting ? <CircularProgress size={24} /> : "Aceptar invitación"}</Button></>}
    {acceptError && <Alert severity="error">{acceptError}</Alert>}
    {result && <><Typography variant="h4" fontWeight={850}>Acceso confirmado</Typography><Typography color="text.secondary">El local ya aparece en tu panel con los permisos asignados.</Typography><Button variant="contained" onClick={() => navigate("/owner", { replace: true })}>Abrir panel del negocio</Button></>}
  </Stack></Paper></Container>;
}

