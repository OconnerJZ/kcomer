import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { CloudUpload, Close, ExpandMore, ImageOutlined, VerifiedOutlined } from "@mui/icons-material";
import TransferPaymentInfo from "@Features/checkout/components/TransferPaymentInfo";
import { useGetTransferPaymentQuery, useSubmitTransferPaymentEvidenceMutation } from "@Features/orders/api/orders.api";
import { useSocketEvent } from "@Shared/hooks/useSocket";
import ProtectedEvidenceImage from "./ProtectedEvidenceImage";

const COLLAPSED_BANK_STATUSES = ["ready", "in_delivery", "completed", "cancelled"];
const statusCopy = {
  reported: { severity: "info", text: "Pago reportado. El negocio todavía no revisa el comprobante." },
  reviewed: { severity: "success", text: "Comprobante revisado por el negocio." },
  requires_clarification: { severity: "warning", text: "El negocio necesita una aclaración sobre el comprobante." },
};

export default function TransferPaymentPanel({ order }) {
  const [submitEvidence, { isLoading }] = useSubmitTransferPaymentEvidenceMutation();
  const { data: paymentResponse, refetch } = useGetTransferPaymentQuery({ id: order.id }, { skip: order.paymentMethod !== "transfer" });
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [viewer, setViewer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const state = paymentResponse?.success === true && Object.prototype.hasOwnProperty.call(paymentResponse, "data") ? paymentResponse.data : paymentResponse || null;
  const payment = state?.payment || null;
  const bankCollapsed = COLLAPSED_BANK_STATUSES.includes(order.status);

  useEffect(() => {
    if (!file) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useSocketEvent("order:transfer_payment_updated", (payload) => {
    if (String(payload?.orderId) === String(order.id)) refetch();
  }, { enabled: order.paymentMethod === "transfer" });

  if (order.paymentMethod !== "transfer") return null;
  const selectFile = (candidate) => {
    if (!candidate) return;
    if (!candidate.type.startsWith("image/")) { setFeedback({ severity: "error", text: "Selecciona una imagen JPG, PNG o WebP." }); return; }
    if (candidate.size > 5 * 1024 * 1024) { setFeedback({ severity: "error", text: "La imagen no puede exceder 5 MB." }); return; }
    setFile(candidate);
    setFeedback(null);
  };
  const send = async () => {
    if (!file) return;
    try {
      await submitEvidence({ id: order.id, file }).unwrap();
      setFile(null);
      setFeedback({ severity: "success", text: "Comprobante enviado. La evidencia quedó registrada con fecha y usuario." });
    } catch (error) {
      setFeedback({ severity: "error", text: error?.data?.message || "No pudimos enviar el comprobante." });
    }
  };

  const bankContent = <TransferPaymentInfo config={state?.bankDetails || {}} compact />;
  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5} gap={1}>
        <Box><Typography variant="subtitle2" fontWeight={600}>Pago por transferencia</Typography><Typography variant="caption" color="text.secondary">Tu orden continúa su proceso aunque la revisión esté pendiente.</Typography></Box>
        {payment?.status === "reviewed" && <Chip size="small" color="success" icon={<VerifiedOutlined />} label="Revisado" />}
      </Stack>

      {bankCollapsed ? <Accordion elevation={0} disableGutters sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px !important", "&:before": { display: "none" } }}><AccordionSummary expandIcon={<ExpandMore />}><Typography variant="body2" fontWeight={600}>Ver datos bancarios</Typography></AccordionSummary><AccordionDetails>{bankContent}</AccordionDetails></Accordion> : bankContent}

      {payment && <Alert severity={statusCopy[payment.status]?.severity || "info"} sx={{ mt: 1.5, borderRadius: "8px" }}>{statusCopy[payment.status]?.text}{payment.ownerMessage && <Typography variant="body2" fontWeight={700} sx={{ mt: .5 }}>{payment.ownerMessage}</Typography>}</Alert>}

      {payment?.evidences?.length > 0 && <Box sx={{ mt: 1.5 }}><Typography variant="caption" color="text.secondary">Evidencias registradas</Typography><Stack direction="row" spacing={1} mt={.7} flexWrap="wrap" useFlexGap>{payment.evidences.map((evidence) => <ProtectedEvidenceImage key={evidence.id} evidence={evidence} size={58} onOpen={setViewer} />)}</Stack></Box>}

      <Box onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} onClick={() => inputRef.current?.click()} sx={{ mt: 1.5, p: 2, border: "1.5px dashed", borderColor: file ? "primary.main" : "divider", borderRadius: "8px", textAlign: "center", cursor: "pointer", bgcolor: file ? "rgba(198,90,80,.035)" : "grey.50" }}>
        <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0])} />
        {preview ? <Stack direction="row" spacing={1.5} alignItems="center"><Box component="img" src={preview} alt="Vista previa" sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: "8px" }} /><Box textAlign="left" minWidth={0}><Typography variant="body2" fontWeight={600} noWrap>{file.name}</Typography><Typography variant="caption" color="text.secondary">Toca para cambiar la imagen</Typography></Box></Stack> : <><CloudUpload color="action" /><Typography variant="body2" fontWeight={600}>Arrastra o selecciona tu comprobante</Typography><Typography variant="caption" color="text.secondary">JPG, PNG o WebP · máximo 5 MB</Typography></>}
      </Box>
      {file && <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={1}><Button variant="outlined" fullWidth onClick={() => setViewer(preview)} startIcon={<ImageOutlined />}>Vista previa</Button><Button variant="contained" fullWidth disabled={isLoading} onClick={send}>{isLoading ? <CircularProgress size={20} color="inherit" /> : payment ? "Enviar nueva evidencia" : "Reportar pago"}</Button></Stack>}
      {feedback && <Alert severity={feedback.severity} sx={{ mt: 1.2 }}>{feedback.text}</Alert>}

      <Dialog open={Boolean(viewer)} onClose={() => setViewer("")} maxWidth="md" fullWidth><DialogContent sx={{ p: 1, position: "relative", bgcolor: "#111" }}><IconButton onClick={() => setViewer("")} sx={{ position: "absolute", right: 8, top: 8, bgcolor: "rgba(255,255,255,.9)", zIndex: 1 }}><Close /></IconButton>{viewer && <Box component="img" src={viewer} alt="Comprobante ampliado" sx={{ display: "block", maxWidth: "100%", maxHeight: "calc(100dvh - 56px)", mx: "auto" }} />}</DialogContent></Dialog>
    </Box>
  );
}
