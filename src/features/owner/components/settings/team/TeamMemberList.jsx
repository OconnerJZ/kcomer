import { Avatar, Box, Chip, Divider, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { BUSINESS_TEAM_ROLES } from "@Features/owner/model/teamAccess";

export default function TeamMemberList({ members = [], onRoleChange, onRemove }) {
  return <Box sx={{ overflow: "hidden" }}>
    <Box sx={{ py: 1.5 }}><Typography fontWeight={600}>Miembros activos</Typography><Typography variant="caption" color="text.secondary">{members.length} personas</Typography></Box><Divider />
    {members.map((member, index) => <Box key={member.userId} sx={{ py: 1.5, display: "grid", gridTemplateColumns: { xs: "auto minmax(0,1fr)", sm: "auto minmax(0,1fr) auto auto" }, gap: 1.25, alignItems: "center", borderBottom: index < members.length - 1 ? "1px solid" : 0, borderColor: "divider" }}>
      <Avatar src={member.avatar}>{member.name?.[0]}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" fontWeight={600}>{member.name || member.email}</Typography><Typography variant="caption" color="text.secondary">{member.email}</Typography></Box>
      {member.role === "primary_owner" ? <Chip label="Owner principal" size="small" color="primary" sx={{ gridColumn: { xs: "2", sm: "auto" }, justifySelf: "start" }} /> : <>
        <Select size="small" value={member.role} onChange={(event) => onRoleChange(member, event.target.value)} sx={{ gridColumn: { xs: "2", sm: "auto" } }}>{BUSINESS_TEAM_ROLES.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select>
        <IconButton color="error" aria-label="quitar miembro" onClick={() => onRemove(member)} sx={{ gridColumn: { xs: "1", sm: "auto" }, gridRow: { xs: "2", sm: "auto" } }}><DeleteOutline /></IconButton>
      </>}
    </Box>)}
  </Box>;
}
