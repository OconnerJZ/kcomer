import { Box, Button, CircularProgress, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";

export default function OwnershipTransferPanel({ email, retainPrevious, loading, onEmailChange, onRetainChange, onTransfer }) {
  return <Box sx={{ p: { xs: 1.5, sm: 2 }, borderLeft: "4px solid", borderColor: "warning.main", bgcolor: "rgba(242,140,40,.07)", borderRadius: "0 12px 12px 0" }}><Stack spacing={2}>
    <Stack direction="row" spacing={1} alignItems="center"><SwapHoriz color="warning" /><Box><Typography fontWeight={800}>Traspasar el local</Typography><Typography variant="caption" color="text.secondary">Requiere aceptación de la otra persona. Hasta entonces sigues siendo owner principal.</Typography></Box></Stack>
    <TextField label="Email del nuevo owner principal" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />
    <FormControlLabel control={<Switch checked={retainPrevious} onChange={(event) => onRetainChange(event.target.checked)} />} label="Conservar mi acceso como co-owner después del traspaso" />
    <Button color="warning" variant="outlined" disabled={loading || !email.trim()} onClick={onTransfer} sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>{loading ? <CircularProgress size={22} /> : "Crear solicitud de traspaso"}</Button>
  </Stack></Box>;
}
