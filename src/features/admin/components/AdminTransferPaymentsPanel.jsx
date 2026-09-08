import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import FactCheckRounded from "@mui/icons-material/FactCheckRounded";
import { useGetAdminTransferPaymentsQuery } from "../api/adminPayments.api";
import AdminTransferPaymentDetailDialog from "./AdminTransferPaymentDetailDialog";

const STATUS_LABELS = {
  reported: "Reportado",
  reviewed: "Revisado",
  requires_clarification: "Requiere aclaración",
};

const formatDate = (value) => value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const formatMoney = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value || 0));
const errorMessage = (error) => error?.data?.message || error?.data || error?.message || "No fue posible cargar las transferencias";

export default function AdminTransferPaymentsPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [filters, setFilters] = useState({ q: "", status: "", businessId: "", limit: 50 });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const query = useGetAdminTransferPaymentsQuery(filters);
  const rows = query.data || [];

  const applyFilters = (event) => {
    event.preventDefault();
    setFilters({
      q: search.trim(),
      status,
      businessId: businessId.trim(),
      limit: 50,
    });
  };

  return (
    <Stack spacing={2}>
      <Paper component="form" variant="outlined" onSubmit={applyFilters} sx={{ p: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(220px,1fr) 220px 150px auto" }, gap: 1.25, alignItems: "center" }}>
          <TextField
            size="small"
            label="Buscar"
            placeholder="Orden, negocio, cliente o email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FormControl size="small">
            <InputLabel id="admin-transfer-status-label">Estado</InputLabel>
            <Select
              labelId="admin-transfer-status-label"
              label="Estado"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="reported">Reportado</MenuItem>
              <MenuItem value="requires_clarification">Requiere aclaración</MenuItem>
              <MenuItem value="reviewed">Revisado</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="ID negocio"
            inputMode="numeric"
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value.replace(/[^0-9]/g, ""))}
          />
          <Button type="submit" variant="contained" startIcon={<SearchRounded />}>Buscar</Button>
        </Box>
      </Paper>

      {query.error && <Alert severity="error">{errorMessage(query.error)}</Alert>}

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover", display: { xs: "none", md: "grid" }, gridTemplateColumns: "95px minmax(180px,1.2fr) minmax(170px,1fr) 150px 140px 105px", gap: 1.5 }}>
          <Typography variant="caption" fontWeight={700}>ORDEN</Typography>
          <Typography variant="caption" fontWeight={700}>NEGOCIO</Typography>
          <Typography variant="caption" fontWeight={700}>CLIENTE</Typography>
          <Typography variant="caption" fontWeight={700}>ESTADO</Typography>
          <Typography variant="caption" fontWeight={700}>EVIDENCIA</Typography>
          <Typography variant="caption" fontWeight={700}>ACCIÓN</Typography>
        </Box>

        {query.isLoading ? (
          <Box sx={{ py: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
        ) : (
          <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />}>
            {rows.map((row) => (
              <Box key={row.transferPaymentId} sx={{ px: 2, py: 1.6, display: "grid", gridTemplateColumns: { xs: "1fr", md: "95px minmax(180px,1.2fr) minmax(170px,1fr) 150px 140px 105px" }, gap: { xs: 1, md: 1.5 }, alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>ORDEN</Typography>
                  <Typography variant="body2" fontWeight={700}>#{row.orderId}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatMoney(row.order?.total)}</Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>NEGOCIO</Typography>
                  <Typography variant="body2" fontWeight={700} noWrap>{row.business?.name || "—"}</Typography>
                  <Typography variant="caption" color="text.secondary">ID #{row.business?.id}</Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>CLIENTE</Typography>
                  <Typography variant="body2" fontWeight={700} noWrap>{row.customer?.name || "—"}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{row.customer?.email || "Sin email"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>ESTADO</Typography>
                  <Typography variant="body2" fontWeight={700}>{STATUS_LABELS[row.reviewStatus] || row.reviewStatus}</Typography>
                  {row.ownerMessage && <Typography variant="caption" color="text.secondary">Con mensaje del negocio</Typography>}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>EVIDENCIA</Typography>
                  <Typography variant="body2" fontWeight={700}>{row.evidenceCount} archivo{row.evidenceCount === 1 ? "" : "s"}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatDate(row.latestEvidenceAt)}</Typography>
                </Box>
                <Button size="small" startIcon={<FactCheckRounded />} onClick={() => setSelectedOrderId(row.orderId)}>Auditar</Button>
              </Box>
            ))}
            {!rows.length && !query.isLoading && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No se encontraron transferencias con esos filtros.</Typography>
              </Box>
            )}
          </Stack>
        )}
      </Paper>

      <AdminTransferPaymentDetailDialog
        orderId={selectedOrderId}
        open={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
      />
    </Stack>
  );
}
