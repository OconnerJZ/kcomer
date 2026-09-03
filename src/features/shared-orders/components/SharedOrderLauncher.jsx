import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { GroupAdd, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCreateSharedOrderMutation, useJoinSharedOrderByCodeMutation } from "../api/sharedOrders.api";
import { sharedOrderError } from "../model/sharedOrder";
import useOrderTarget from "../hooks/useOrderTarget";

export default function SharedOrderLauncher() {
  const navigate = useNavigate();
  const [, setOrderTarget] = useOrderTarget();
  const [mode, setMode] = useState(null);
  const [title, setTitle] = useState("");
  const [codeLength, setCodeLength] = useState(6);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [createSession, createState] = useCreateSharedOrderMutation();
  const [joinCode, joinState] = useJoinSharedOrderByCodeMutation();

  const submit = async () => {
    setError("");
    try {
      if (mode === "create") {
        const result = await createSession({ title, codeLength }).unwrap();
        setOrderTarget("shared");
        window.sessionStorage.setItem(`shared-order-secrets:${result.session.id}`, JSON.stringify(result.secrets));
        navigate(`/orden-compartida/${result.session.id}`);
      } else {
        const session = await joinCode(code).unwrap();
        setOrderTarget("shared");
        navigate(`/orden-compartida/${session.id}`);
      }
    } catch (requestError) { setError(sharedOrderError(requestError)); }
  };

  return (
    <>
      <Paper elevation={0} sx={{ maxWidth: 900, mx: "auto", mt: 2, p: { xs: 1.5, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: "10px", textAlign: "left" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
          <div><Typography variant="h6">Orden compartida</Typography><Typography color="text.secondary">Junten productos de uno o varios negocios y mantengan separado lo de cada persona.</Typography></div>
          <Stack direction={{ xs: "column", sm: "row" }} gap={1}><Button startIcon={<GroupAdd />} variant="contained" onClick={() => setMode("create")}>Crear</Button><Button startIcon={<Login />} variant="outlined" onClick={() => setMode("join")}>Unirme</Button></Stack>
        </Stack>
      </Paper>
      <Dialog open={Boolean(mode)} onClose={() => setMode(null)} fullWidth maxWidth="xs">
        <DialogTitle>{mode === "create" ? "Crear orden compartida" : "Unirme con código"}</DialogTitle>
        <DialogContent><Stack gap={2} sx={{ mt: 1 }}>
          {mode === "create" ? <><TextField label="Nombre (opcional)" value={title} onChange={(event) => setTitle(event.target.value)} inputProps={{ maxLength: 100 }} /><TextField select label="Longitud del código" value={codeLength} onChange={(event) => setCodeLength(Number(event.target.value))}><MenuItem value={4}>4 dígitos · más fácil</MenuItem><MenuItem value={6}>6 dígitos · más seguro</MenuItem></TextField></> : <TextField label="Código de 4 o 6 dígitos" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} autoFocus />}
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setMode(null)}>Cancelar</Button><Button variant="contained" disabled={createState.isLoading || joinState.isLoading || (mode === "join" && ![4, 6].includes(code.length))} onClick={submit}>Continuar</Button></DialogActions>
      </Dialog>
    </>
  );
}
