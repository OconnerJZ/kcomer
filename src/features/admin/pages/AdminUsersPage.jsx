import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PersonRounded, RefreshRounded, SearchRounded } from "@mui/icons-material";
import { useGetAdminUserQuery, useGetAdminUsersQuery } from "../api/admin.api";
import AdminUserActivityPanel from "../components/AdminUserActivityPanel";
import AdminUserBusinessesPanel from "../components/AdminUserBusinessesPanel";
import AdminUserRolePanel from "../components/AdminUserRolePanel";
import AdminUserStatusPanel from "../components/AdminUserStatusPanel";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible cargar los usuarios";
const roleLabel = (value = "") => String(value).replaceAll("_", " ");
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const usersQuery = useGetAdminUsersQuery({ q: appliedSearch, limit: 40 });
  const users = dataOf(usersQuery.data) || [];
  const detailQuery = useGetAdminUserQuery(
    { userId: selectedUserId },
    { skip: !selectedUserId },
  );
  const detail = dataOf(detailQuery.data);
  const user = detail?.user;

  const submitSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">PLATAFORMA</Typography>
          <Typography variant="h4" fontWeight={700}>Usuarios</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 780 }}>
            Consulta identidad, rol global, membresías y actividad; bloquea cuentas sin alterar sus datos históricos ni roles dentro de negocios.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={() => Promise.all([usersQuery.refetch(), selectedUserId ? detailQuery.refetch() : Promise.resolve()])}
          disabled={usersQuery.isFetching || detailQuery.isFetching}
          sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}
        >
          Actualizar
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "350px minmax(0,1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box component="form" onSubmit={submitSearch} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre, email, teléfono, rol o ID"
              />
              <Button type="submit" variant="contained" aria-label="Buscar usuario"><SearchRounded /></Button>
            </Stack>
          </Box>
          <Divider />

          {usersQuery.isLoading ? (
            <Box sx={{ p: 5, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
          ) : usersQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>{errorMessage(usersQuery.error)}</Alert>
          ) : (
            <List disablePadding sx={{ maxHeight: { xs: 360, lg: "calc(100vh - 300px)" }, overflow: "auto" }}>
              {users.map((item) => {
                const blocked = item.accountStatus === "blocked";
                const selected = Number(item.id) === Number(selectedUserId);
                return (
                  <ListItemButton
                    key={item.id}
                    selected={selected}
                    onClick={() => setSelectedUserId(Number(item.id))}
                    divider
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={item.name || item.email || `Usuario #${item.id}`}
                      secondary={item.email || `Usuario #${item.id}`}
                      primaryTypographyProps={{ fontWeight: selected ? 700 : 600, noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                    <Stack spacing={0.6} alignItems="flex-end" sx={{ ml: 1 }}>
                      <Chip
                        size="small"
                        label={roleLabel(item.role?.name || "customer")}
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                      {blocked && <Chip size="small" label="Bloqueada" color="warning" variant="outlined" />}
                    </Stack>
                  </ListItemButton>
                );
              })}
              {!users.length && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">No se encontraron usuarios.</Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>

        {!selectedUserId ? (
          <Paper variant="outlined" sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
            <PersonRounded sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>Selecciona un usuario</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              La ficha global aparecerá aquí sin modificar sus membresías de negocio.
            </Typography>
          </Paper>
        ) : detailQuery.isLoading ? (
          <Paper variant="outlined" sx={{ p: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Paper>
        ) : detailQuery.error ? (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={detailQuery.refetch}>Reintentar</Button>}>
            {errorMessage(detailQuery.error)}
          </Alert>
        ) : user ? (
          <Stack spacing={2.5}>
            <Box>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">USUARIO #{user.id}</Typography>
                  <Typography variant="h5" fontWeight={750}>{user.name || user.email || `Usuario #${user.id}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[user.email, user.phone].filter(Boolean).join(" · ") || "Sin datos de contacto"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.provider || "local"} · Alta {dateLabel(user.createdAt)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>
                  <Chip
                    label={roleLabel(user.role?.name || "customer")}
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />
                  <Chip
                    label={user.accountStatus === "blocked" ? "Cuenta bloqueada" : "Cuenta activa"}
                    color={user.accountStatus === "blocked" ? "warning" : "success"}
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0,1fr))" }, gap: 2.5, alignItems: "start" }}>
              <AdminUserStatusPanel key={`status-${user.id}`} user={user} />
              <AdminUserRolePanel key={`role-${user.id}`} user={user} roleCatalog={detail.roleCatalog || []} />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.1fr) minmax(300px,.9fr)" }, gap: 2.5, alignItems: "start" }}>
              <AdminUserBusinessesPanel businesses={detail.businesses || []} />
              <AdminUserActivityPanel activity={detail.activity || {}} />
            </Box>
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
