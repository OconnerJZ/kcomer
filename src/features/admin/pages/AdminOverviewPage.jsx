import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForwardRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MODULES,
  ADMIN_MODULE_STATUS,
} from "../model/adminNavigation";

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const modules = ADMIN_MODULES.filter((module) => module.id !== "overview");

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="text.secondary">ADMINISTRACIÓN DE PLATAFORMA</Typography>
        <Typography variant="h4" fontWeight={700}>Admin Control Center</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 760 }}>
          Centro operativo de qsCome. Cada módulo se habilitará únicamente cuando su backend,
          permisos, auditoría y estados de error estén completos.
        </Typography>
      </Box>

      <Alert severity="info">
        La fundación del Control Center está activa. Planes & Trials conserva la operación existente;
        el resto de módulos se incorporará por bloques sin simular datos ni acciones administrativas.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {modules.map((module) => {
          const ready = module.status === ADMIN_MODULE_STATUS.READY;

          return (
            <Paper
              key={module.id}
              variant="outlined"
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                minHeight: 190,
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{module.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{module.section}</Typography>
                </Box>
                <Chip
                  label={ready ? "Disponible" : "Siguiente fase"}
                  size="small"
                  color={ready ? "success" : "default"}
                  variant="outlined"
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, flex: 1 }}>
                {module.description}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant={ready ? "contained" : "outlined"}
                  disabled={!ready}
                  endIcon={ready ? <ArrowForwardRounded /> : undefined}
                  onClick={() => ready && navigate(module.path)}
                >
                  {ready ? "Abrir módulo" : "Pendiente"}
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
}
