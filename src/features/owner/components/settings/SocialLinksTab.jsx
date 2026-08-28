import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import PublicRounded from "@mui/icons-material/PublicRounded";

export default function SocialLinksTab({ socialInfo, setSocialInfo, onSave, loading }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3.5, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,.9)" }}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: .75 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2.2, display: "grid", placeItems: "center", bgcolor: "rgba(126,87,194,.10)", color: "secondary.main" }}><PublicRounded fontSize="small" /></Box>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>PRESENCIA DIGITAL</Typography>
          <Typography variant="h6" fontWeight={850}>Redes sociales</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 680 }}>
        Agrega solo los perfiles oficiales del negocio. WhatsApp se genera automáticamente a partir del teléfono registrado.
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 680 }}>
        <TextField label="Facebook" placeholder="https://facebook.com/tu-negocio" value={socialInfo.facebook || ""} onChange={(e) => setSocialInfo((current) => ({ ...current, facebook: e.target.value }))} fullWidth />
        <TextField label="Instagram" placeholder="https://instagram.com/tu-negocio" value={socialInfo.instagram || ""} onChange={(e) => setSocialInfo((current) => ({ ...current, instagram: e.target.value }))} fullWidth />
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2.2, minWidth: 160 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar redes"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
