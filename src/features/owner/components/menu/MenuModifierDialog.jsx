import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { Close, TuneRounded } from "@mui/icons-material";
import MenuModifierManager from "./MenuModifierManager";

export default function MenuModifierDialog({ open, item, fullScreen, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen} PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 4 } }}>
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TuneRounded color="primary" />
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em" }}>PERSONALIZACIÓN</Typography>
            </Stack>
            <Typography variant="h5" fontWeight={900}>{item?.name || "Platillo"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .4, maxWidth: 620 }}>
              Define qué puede quitar, elegir o agregar el cliente. Los cambios futuros no alterarán las órdenes históricas.
            </Typography>
          </Box>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Stack>
      </Box>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: "rgba(248,248,248,.62)" }}>
        <MenuModifierManager menuId={item?.id} />
      </DialogContent>
    </Dialog>
  );
}
