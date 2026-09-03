import { Box, Button, CircularProgress, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { GroupAdd } from "@mui/icons-material";
import { BUSINESS_TEAM_ROLES } from "@Features/owner/model/teamAccess";

export default function InviteMemberPanel({ email, role, loading, onEmailChange, onRoleChange, onInvite }) {
  return <Box sx={{ py: 2, borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}><Stack spacing={2}>
    <Stack direction="row" spacing={1} alignItems="center"><GroupAdd color="primary" /><Typography fontWeight={600}>Invitar colaborador</Typography></Stack>
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
      <TextField label="Email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} fullWidth />
      <Select value={role} onChange={(event) => onRoleChange(event.target.value)} sx={{ minWidth: { md: 180 } }}>{BUSINESS_TEAM_ROLES.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select>
      <Button variant="contained" disabled={loading || !email.trim()} onClick={onInvite} sx={{ minWidth: 130 }}>{loading ? <CircularProgress size={22} /> : "Invitar"}</Button>
    </Stack>
  </Stack></Box>;
}
