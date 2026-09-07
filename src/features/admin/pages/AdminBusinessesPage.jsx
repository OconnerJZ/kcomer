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
import { BusinessRounded, RefreshRounded, SearchRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAdminBusinessQuery, useGetAdminBusinessesQuery } from "../api/admin.api";
import AdminBusinessConfigurationPanel from "../components/AdminBusinessConfigurationPanel";
import AdminBusinessPlanPanel from "../components/AdminBusinessPlanPanel";
import AdminBusinessStatusPanel from "../components/AdminBusinessStatusPanel";
import AdminBusinessTeamPanel from "../components/AdminBusinessTeamPanel";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible cargar los negocios";
const planLabel = (code = "free") => String(code).replace("level_", "L").toUpperCase();

export default function AdminBusinessesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const businessesQuery = useGetAdminBusinessesQuery({ q: appliedSearch, limit: 40 });
  const businesses = dataOf(businessesQuery.data) || [];
  const detailQuery = useGetAdminBusinessQuery(
    { businessId: selectedBusinessId },
    { skip: !selectedBusinessId },
  );
  const detail = dataOf(detailQuery.data);
  const business = detail?.business;

  const submitSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">PLATAFORMA</Typography>
          <Typography variant="h4" fontWeight={700}>Negocios</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 780 }}>
            Consulta configuración, equipo y capacidad comercial; verifica o suspende negocios sin mezclar su estado operativo.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={() => Promise.all([businessesQuery.refetch(), selectedBusinessId ? detailQuery.refetch() : Promise.resolve()])}
          disabled={businessesQuery.isFetching || detailQuery.isFetching}
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
                placeholder="Nombre, owner, email o ID"
              />
              <Button type="submit" variant="contained" aria-label="Buscar negocio"><SearchRounded /></Button>
            </Stack>
          </Box>
          <Divider />

          {businessesQuery.isLoading ? (
            <Box sx={{ p: 5, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
          ) : businessesQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>{errorMessage(businessesQuery.error)}</Alert>
          ) : (
            <List disablePadding sx={{ maxHeight: { xs: 360, lg: "calc(100vh - 300px)" }, overflow: "auto" }}>
              {businesses.map((item) => {
                const suspended = item.platformStatus === "suspended";
                return (
                  <ListItemButton
                    key={item.id}
                    selected={Number(item.id) === Number(selectedBusinessId)}
                    onClick={() => setSelectedBusinessId(Number(item.id))}
                    divider
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={item.name || `Negocio #${item.id}`}
                      secondary={item.owner?.email || item.email || `#${item.id}`}
                      primaryTypographyProps={{ fontWeight: Number(item.id) === Number(selectedBusinessId) ? 700 : 600, noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                    <Stack spacing={0.6} alignItems="flex-end" sx={{ ml: 1 }}>
                      <Chip size="small" label={planLabel(item.plan?.effectivePlanCode)} variant="outlined" />
                      {suspended && <Chip size="small" label="Suspendido" color="warning" variant="outlined" />}
                    </Stack>
                  </ListItemButton>
                );
              })}
              {!businesses.length && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">No se encontraron negocios.</Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>

        {!selectedBusinessId ? (
          <Paper variant="outlined" sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
            <BusinessRounded sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>Selecciona un negocio</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              La ficha administrativa aparecerá aquí sin modificar su configuración de propietario.
            </Typography>
          </Paper>
        ) : detailQuery.isLoading ? (
          <Paper variant="outlined" sx={{ p: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Paper>
        ) : detailQuery.error ? (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={detailQuery.refetch}>Reintentar</Button>}>
            {errorMessage(detailQuery.error)}
          </Alert>
        ) : business ? (
          <Stack spacing={2.5}>
            <Box>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">NEGOCIO #{business.id}</Typography>
                  <Typography variant="h5" fontWeight={750}>{business.name || `Negocio #${business.id}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[business.email, business.phone].filter(Boolean).join(" · ") || "Sin datos de contacto"}
                  </Typography>
                </Box>
                <Chip
                  label={business.platformStatus === "suspended" ? "Suspendido por plataforma" : "Activo en plataforma"}
                  color={business.platformStatus === "suspended" ? "warning" : "success"}
                  variant="outlined"
                  sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                />
              </Stack>
              {business.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, maxWidth: 900 }}>
                  {business.description}
                </Typography>
              )}
            </Box>

            <AdminBusinessStatusPanel business={business} />
            <AdminBusinessPlanPanel
              plan={detail.plan}
              onManage={() => navigate(`/admin/plans?businessId=${business.id}`)}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(280px, .8fr) minmax(0,1.2fr)" }, gap: 2.5, alignItems: "start" }}>
              <AdminBusinessTeamPanel team={detail.team} />
              <AdminBusinessConfigurationPanel configuration={detail.configuration} />
            </Box>
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
