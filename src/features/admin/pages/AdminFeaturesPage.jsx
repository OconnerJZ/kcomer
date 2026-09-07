import { Alert, Stack, Typography } from "@mui/material";
import AdminBusinessFeaturePanel from "../components/AdminBusinessFeaturePanel";
import AdminFeatureCatalogPanel from "../components/AdminFeatureCatalogPanel";

export default function AdminFeaturesPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="overline" color="text.secondary">CONTROL DE PRODUCTO</Typography>
        <Typography variant="h4" fontWeight={700}>Feature Control Center</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 900 }}>
          Controla funciones comerciales sin alterar el catálogo core. Los overrides se resuelven en backend y afectan el acceso real de cada negocio.
        </Typography>
      </div>

      <Alert severity="info">
        Las funciones core y las marcadas como “Próximamente” están protegidas. “Solo lectura” conserva consulta/uso existente, pero bloquea mutaciones administrativas del módulo.
      </Alert>

      <AdminFeatureCatalogPanel />
      <AdminBusinessFeaturePanel />
    </Stack>
  );
}
