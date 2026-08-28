import { Avatar, Box, Chip, Divider, IconButton, MenuItem, Paper, Select, Typography } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { BUSINESS_TEAM_ROLES } from "@Features/owner/model/teamAccess";

export default function TeamMemberList({ members = [], onRoleChange, onRemove }) {
  return <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
    <Box sx={{ px: 2.5, py: 2 }}><Typography fontWeight={800}>Miembros activos</Typography><Typography variant="caption" color="text.secondary">{members.length} personas</Typography></Box><Divider />
    {members.map((member, index) => <Box key={member.userId} sx={{ px: 2.5, py: 1.5, display: "flex", gap: 1.5, alignItems: "center", borderBottom: index < members.length - 1 ? "1px solid" : 0, borderColor: "divider" }}>
      <Avatar src={member.avatar}>{member.name?.[0]}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" fontWeight={800}>{member.name || member.email}</Typography><Typography variant="caption" color="text.secondary">{member.email}</Typography></Box>
      {member.role === "primary_owner" ? <Chip label="Owner principal" size="small" color="primary" /> : <>
        <Select size="small" value={member.role} onChange={(event) => onRoleChange(member, event.target.value)}>{BUSINESS_TEAM_ROLES.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select>
        <IconButton color="error" aria-label="quitar miembro" onClick={() => onRemove(member)}><DeleteOutline /></IconButton>
      </>}
    </Box>)}
  </Paper>;
}

