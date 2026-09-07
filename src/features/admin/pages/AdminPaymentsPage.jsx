import { Alert, Stack, Typography } from "@mui/material";
import AdminPaymentsSummaryPanel from "../components/AdminPaymentsSummaryPanel";
import AdminTransferPaymentsPanel from "../components/AdminTransferPaymentsPanel";

export default function AdminPaymentsPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="overline" color="text.secondary">AUDITORÍA OPERATIVA</Typography>
        <Typography variant="h4" fontWeight={700}>Pagos & Evidencias</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 920 }}>
          Revisa transferencias, comprobantes y solicitudes de aclaración de toda la plataforma sin alterar la decisión operativa del negocio.
        </Typography>
      </div>

      <Alert severity="info">
        Esta vista es de solo lectura. El negocio conserva la revisión del comprobante y el estado de pago no bloquea la aceptación ni la preparación de la orden.
      </Alert>

      <AdminPaymentsSummaryPanel />
      <AdminTransferPaymentsPanel />
    </Stack>
  );
}
