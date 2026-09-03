import { useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CheckCircleOutline, Close, HelpOutline } from "@mui/icons-material";
import { useGetTransferPaymentQuery, useReviewTransferPaymentMutation } from "@Features/orders/api/orders.api";
import { useSocketEvent } from "@Shared/hooks/useSocket";
import ProtectedEvidenceImage from "./ProtectedEvidenceImage";

const labels = { reported: "Pendiente de revisión", reviewed: "Revisado", requires_clarification: "Requiere aclaración" };

export default function TransferPaymentReviewPanel({ order }) {
  const { data: response, isLoading: loadingReport, refetch } = useGetTransferPaymentQuery({ id: order.id });
  const [review, { isLoading }] = useReviewTransferPaymentMutation();
  const [message, setMessage] = useState("");
  const [viewer, setViewer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const state = response?.success === true && Object.prototype.hasOwnProperty.call(response, "data") ? response.data : response || null;
  const payment = state?.payment || null;

  useSocketEvent("order:transfer_payment_updated", (payload) => {
    if (String(payload?.orderId) === String(order.id)) refetch();
  }, { enabled: true, room: { type: "business", id: order.businessId } });

  const submit = async (status) => {
    try {
      await review({ id: order.id, status, message, expectedVersion: payment.version }).unwrap();
      setMessage("");
      setFeedback({ severity: "success", text: status === "reviewed" ? "Marcado como comprobante revisado." : "La aclaración fue enviada al cliente." });
    } catch (error) {
      setFeedback({ severity: "error", text: error?.data?.message || "No pudimos guardar la revisión." });
    }
  };

  if (loadingReport) return <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}><CircularProgress size={24} /></Box>;
  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: "8px", bgcolor: "rgba(255,255,255,.82)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5} gap={1}>
        <Box><Typography variant="overline" color="text.secondary">TRANSFERENCIA</Typography><Typography variant="subtitle1" fontWeight={600}>Comprobante del cliente</Typography></Box>
        {payment && <Chip size="small" label={labels[payment.status] || payment.status} color={payment.status === "reviewed" ? "success" : payment.status === "requires_clarification" ? "warning" : "default"} />}
      </Stack>
      {!payment ? <Alert severity="info">El cliente todavía no ha reportado el pago. Esto no bloquea la preparación ni la entrega.</Alert> : <Stack spacing={1.6}>
        <Typography variant="caption" color="text.secondary">La evidencia es inmutable: puedes revisarla o solicitar una aclaración, pero no eliminarla.</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{payment.evidences?.map((evidence) => <ProtectedEvidenceImage key={evidence.id} evidence={evidence} size={86} onOpen={setViewer} />)}</Stack>
        {payment.ownerMessage && <Alert severity={payment.status === "requires_clarification" ? "warning" : "info"}>{payment.ownerMessage}</Alert>}
        <TextField label="Respuesta para el cliente" placeholder="Obligatoria si requiere aclaración" value={message} onChange={(event) => setMessage(event.target.value)} multiline minRows={2} inputProps={{ maxLength: 1000 }} fullWidth />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button variant="outlined" color="warning" fullWidth startIcon={<HelpOutline />} disabled={isLoading || !message.trim()} onClick={() => submit("requires_clarification")} sx={{ textTransform: "none" }}>Requiere aclaración</Button>
          <Button variant="contained" color="success" fullWidth startIcon={<CheckCircleOutline />} disabled={isLoading} onClick={() => submit("reviewed")} sx={{ textTransform: "none" }}>Comprobante revisado</Button>
        </Stack>
        {feedback && <Alert severity={feedback.severity}>{feedback.text}</Alert>}
      </Stack>}
      <Dialog open={Boolean(viewer)} onClose={() => setViewer("")} maxWidth="md" fullWidth><DialogContent sx={{ p: 1, position: "relative", bgcolor: "#111" }}><IconButton onClick={() => setViewer("")} sx={{ position: "absolute", right: 8, top: 8, bgcolor: "rgba(255,255,255,.9)" }}><Close /></IconButton>{viewer && <Box component="img" src={viewer} alt="Comprobante ampliado" sx={{ display: "block", maxWidth: "100%", maxHeight: "calc(100dvh - 56px)", mx: "auto" }} />}</DialogContent></Dialog>
    </Box>
  );
}
