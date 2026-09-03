import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { Close, TuneRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
import MenuModifierManager from "./MenuModifierManager";

export default function MenuModifierDialog({ open, item, fullScreen, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen} PaperProps={{ sx: { borderRadius: fullScreen ? 0 : "10px" } }}>
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TuneRounded color="primary" />
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em" }}>PERSONALIZACIÓN</Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700}>{item?.name || "Platillo"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .4, maxWidth: 620 }}>
              Define qué puede quitar, elegir o agregar el cliente. Los cambios futuros no alterarán las órdenes históricas.
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="cerrar personalización"><Close /></IconButton>
        </Stack>
      </Box>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: "rgba(248,248,248,.62)" }}>
        <MenuModifierManager menuId={item?.id} />
      </DialogContent>
    </Dialog>
  );
}

MenuModifierDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
  }),
  fullScreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
