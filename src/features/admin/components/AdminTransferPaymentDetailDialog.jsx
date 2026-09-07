import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import { useTheme } from "@mui/material/styles";
import client from "@Shared/api/http/client";
import { useGetAdminTransferPaymentQuery } from "../api/adminPayments.api";

const STATUS_LABELS = {
  reported: "Reportado",
  reviewed: "Revisado",
  requires_clarification: "Requiere aclaración",
};

const ACTION_LABELS = {
  TRANSFER_PAYMENT_REPORTED: "Cliente reportó transferencia",
  TRANSFER_PAYMENT_REVIEWED: "Negocio marcó comprobante como revisado",
  TRANSFER_PAYMENT_CLARIFICATION_REQUESTED: "Negocio solicitó aclaración",
};

const formatDate = (value) => value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const formatMoney = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value || 0));
const formatBytes = (value) => {
  const bytes = Number(value || 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
const errorMessage = (error) => error?.data?.message || error?.data || error?.message || "No fue posible cargar la auditoría";

export default function AdminTransferPaymentDetailDialog({ orderId, open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const query = useGetAdminTransferPaymentQuery({ orderId }, { skip: !open || !orderId });
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [loadingEvidenceId, setLoadingEvidenceId] = useState(null);

  useEffect(() => () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
  }, [preview]);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setPreviewError("");
      setLoadingEvidenceId(null);
    }
  }, [open]);

  const openEvidence = async (evidence) => {
    setPreviewError("");
    setLoadingEvidenceId(evidence.id);
    try {
      const response = await client.get(evidence.fileUrl, { responseType: "blob" });
      if (preview?.url) URL.revokeObjectURL(preview.url);
      setPreview({
        id: evidence.id,
        name: evidence.originalName || `Comprobante ${evidence.id}`,
        url: URL.createObjectURL(response.data),
      });
    } catch (error) {
      setPreviewError(error?.friendlyMessage || "No fue posible abrir el comprobante");
    } finally {
      setLoadingEvidenceId(null);
    }
  };

  const data = query.data;
  const bankEntries = data?.bankDetails && typeof data.bankDetails === "object"
    ? Object.entries(data.bankDetails)
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
      <DialogTitle sx={{ pr: 6 }}>
        Auditoría de transferencia · Orden #{orderId}
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ position: "absolute", right: 12, top: 12 }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {query.isLoading ? (
          <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
        ) : query.error ? (
          <Alert severity="error">{errorMessage(query.error)}</Alert>
        ) : (
          <Stack spacing={3}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))" }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">NEGOCIO</Typography>
                <Typography fontWeight={700}>{data?.business?.name || "—"}</Typography>
                <Typography variant="body2" color="text.secondary">ID #{data?.business?.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">CLIENTE</Typography>
                <Typography fontWeight={700}>{data?.customer?.name || "—"}</Typography>
                <Typography variant="body2" color="text.secondary">{data?.customer?.email || "Sin email"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ORDEN</Typography>
                <Typography fontWeight={700}>{formatMoney(data?.order?.total)}</Typography>
                <Typography variant="body2" color="text.secondary">Estado: {data?.order?.status || "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">REVISIÓN DEL NEGOCIO</Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.4 }}>
                  <Chip size="small" label={STATUS_LABELS[data?.reviewStatus] || data?.reviewStatus} variant="outlined" />
                  <Typography variant="body2" color="text.secondary">{formatDate(data?.reviewedAt)}</Typography>
                </Stack>
              </Box>
            </Box>

            {data?.ownerMessage && (
              <Alert severity={data.reviewStatus === "requires_clarification" ? "warning" : "info"}>
                {data.ownerMessage}
              </Alert>
            )}

            <Box>
              <Typography variant="h6" fontWeight={700}>Cuenta destino registrada</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Snapshot conservado con la orden para revisar a qué datos bancarios fue dirigida la transferencia.
              </Typography>
              {bankEntries.length ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))" }, gap: 1.5 }}>
                  {bankEntries.map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="caption" color="text.secondary">{key}</Typography>
                      <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                        {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No hay snapshot bancario disponible.</Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700}>Comprobantes</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Las evidencias son históricas y no se eliminan desde esta vista.
              </Typography>
              {previewError && <Alert severity="error" sx={{ mb: 1.5 }}>{previewError}</Alert>}
              <Stack spacing={1}>
                {(data?.evidences || []).map((evidence) => (
                  <Box key={evidence.id} sx={{ display: "flex", gap: 1.5, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={700}>{evidence.originalName || `Comprobante ${evidence.id}`}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(evidence.createdAt)} · {formatBytes(evidence.size)} · {evidence.mimeType}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={loadingEvidenceId === evidence.id ? <CircularProgress size={14} /> : <VisibilityRounded />}
                      onClick={() => openEvidence(evidence)}
                      disabled={loadingEvidenceId === evidence.id}
                    >
                      Ver comprobante
                    </Button>
                  </Box>
                ))}
                {!data?.evidences?.length && <Typography variant="body2" color="text.secondary">No hay comprobantes registrados.</Typography>}
              </Stack>
              {preview?.url && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>{preview.name}</Typography>
                  <Box component="img" src={preview.url} alt={preview.name} sx={{ display: "block", maxWidth: "100%", maxHeight: 520, objectFit: "contain", borderRadius: 2 }} />
                </Box>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700}>Trazabilidad</Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {(data?.timeline || []).map((event) => (
                  <Box key={event.id} sx={{ pl: 1.5, borderLeft: "2px solid", borderColor: "divider" }}>
                    <Typography variant="body2" fontWeight={700}>{ACTION_LABELS[event.action] || event.action}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(event.createdAt)} · actor {event.actorRole || "sistema"}{event.actorUserId ? ` #${event.actorUserId}` : ""}
                    </Typography>
                  </Box>
                ))}
                {!data?.timeline?.length && <Typography variant="body2" color="text.secondary">Sin eventos de transferencia registrados.</Typography>}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
