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
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  useGetAdminBusinessesQuery,
  useGetAdminBusinessFeaturesQuery,
  useUpdateAdminBusinessFeatureMutation,
} from "../api/admin.api";
import { FEATURE_MODE_LABELS, FEATURE_SOURCE_LABELS } from "../model/featureControl";
import FeatureModeSelect from "./FeatureModeSelect";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";
const modeColor = (mode) => mode === "enabled" ? "success" : mode === "read_only" ? "warning" : "default";

export default function AdminBusinessFeaturePanel() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [businessId, setBusinessId] = useState(null);
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);

  const businessesQuery = useGetAdminBusinessesQuery({ q: appliedSearch, limit: 20 });
  const businesses = dataOf(businessesQuery.data) || [];
  const featureQuery = useGetAdminBusinessFeaturesQuery({ businessId }, { skip: !businessId });
  const detail = dataOf(featureQuery.data);
  const [updateFeature, updateState] = useUpdateAdminBusinessFeatureMutation();

  const queueChange = (feature, value) => {
    setPending({ feature, mode: value === "inherit" ? null : value });
    setReason("");
    setFeedback(null);
  };

  const apply = async () => {
    if (!pending || !businessId || reason.trim().length < 3) return;
    try {
      await updateFeature({
        featureKey: pending.feature.key,
        businessId,
        mode: pending.mode,
        reason: reason.trim(),
      }).unwrap();
      setFeedback({ severity: "success", message: "Excepción del negocio actualizada." });
      setPending(null);
      setReason("");
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>Excepciones por negocio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          El override de negocio domina al plan, pero nunca puede saltarse un kill switch global ni modificar features protegidas.
        </Typography>
      </Box>
      <Divider />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0,1fr)" }, minHeight: 460 }}>
        <Box sx={{ borderRight: { lg: "1px solid" }, borderColor: { lg: "divider" } }}>
          <Box component="form" onSubmit={(event) => { event.preventDefault(); setAppliedSearch(search.trim()); }} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField fullWidth size="small" placeholder="Nombre, owner, email o ID" value={search} onChange={(event) => setSearch(event.target.value)} />
              <Button type="submit" variant="contained" aria-label="Buscar negocio"><SearchRounded /></Button>
            </Stack>
          </Box>
          <Divider />
          {businessesQuery.isLoading ? (
            <Box sx={{ p: 4, display: "grid", placeItems: "center" }}><CircularProgress size={26} /></Box>
          ) : businessesQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>{errorMessage(businessesQuery.error)}</Alert>
          ) : (
            <List disablePadding sx={{ maxHeight: 520, overflow: "auto" }}>
              {businesses.map((business) => (
                <ListItemButton key={business.id} selected={business.id === businessId} onClick={() => { setBusinessId(business.id); setPending(null); setFeedback(null); }} divider>
                  <ListItemText primary={business.name} secondary={`#${business.id} · ${business.plan?.effectivePlanCode || "free"}`} />
                </ListItemButton>
              ))}
              {!businesses.length && <Box sx={{ p: 3 }}><Typography variant="body2" color="text.secondary">No se encontraron negocios.</Typography></Box>}
            </List>
          )}
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 }, minWidth: 0 }}>
          {!businessId ? (
            <Box sx={{ py: 7, textAlign: "center" }}><Typography color="text.secondary">Selecciona un negocio para revisar su acceso efectivo.</Typography></Box>
          ) : featureQuery.isLoading ? (
            <Box sx={{ py: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
          ) : featureQuery.error ? (
            <Alert severity="error">{errorMessage(featureQuery.error)}</Alert>
          ) : (
            <Stack spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">NEGOCIO #{detail?.business?.id}</Typography>
                <Typography variant="h6" fontWeight={700}>{detail?.business?.name}</Typography>
                <Chip size="small" label={`Plan efectivo: ${detail?.plan?.name || detail?.plan?.code}`} variant="outlined" sx={{ mt: 0.75 }} />
              </Box>

              {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

              {pending && (
                <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                  <Stack spacing={1.25}>
                    <Typography fontWeight={700}>{pending.feature.label} → {pending.mode ? FEATURE_MODE_LABELS[pending.mode] : "Heredar"}</Typography>
                    <TextField size="small" label="Motivo administrativo" value={reason} onChange={(event) => setReason(event.target.value)} inputProps={{ maxLength: 500 }} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" disabled={updateState.isLoading || reason.trim().length < 3} onClick={apply}>Aplicar</Button>
                      <Button disabled={updateState.isLoading} onClick={() => { setPending(null); setReason(""); }}>Cancelar</Button>
                    </Stack>
                  </Stack>
                </Box>
              )}

              <Stack spacing={1}>
                {(detail?.features || []).map((feature) => (
                  <Box key={feature.key} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(0,1fr) 165px" }, gap: 1.5, alignItems: "center", py: 1.4, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box>
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
                        <Typography variant="body2" fontWeight={700}>{feature.label}</Typography>
                        <Chip size="small" label={FEATURE_MODE_LABELS[feature.effectiveMode]} color={modeColor(feature.effectiveMode)} variant="outlined" />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{feature.key}</Typography>
                      <Typography variant="caption" color="text.secondary">Fuente: {FEATURE_SOURCE_LABELS[feature.source] || feature.source}</Typography>
                    </Box>
                    <FeatureModeSelect
                      value={feature.override?.mode || "inherit"}
                      disabled={feature.immutable}
                      ariaLabel={`Excepción ${feature.label}`}
                      onChange={(value) => queueChange(feature, value)}
                    />
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
