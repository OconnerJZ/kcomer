import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ContentCopyRounded, IosShareRounded, QrCode2Rounded, RefreshRounded, TagRounded } from "@mui/icons-material";
import { QRCode } from "antd";

export default function SharedOrderInvitePanel({ code, shareLink, onRotate, rotating = false }) {
  const [tab, setTab] = useState("code");
  const [copied, setCopied] = useState(false);
  const hasInvite = Boolean(code && shareLink);

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
  };

  const share = async () => {
    if (!shareLink) return;
    if (navigator.share) {
      await navigator.share({ title: "Únete a mi orden compartida", text: `Código: ${code}`, url: shareLink });
      return;
    }
    await copyLink();
  };

  return <Box sx={{ overflow: "hidden", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
    <Box sx={{ px: { xs: 1.75, sm: 2.5 }, pt: 2.25, textAlign: "center" }}>
      <Typography variant="h6" fontWeight={600}>Invitar al grupo</Typography>
      <Typography variant="body2" color="text.secondary">Comparte sólo la opción que resulte más cómoda.</Typography>
    </Box>

    <Tabs value={tab} onChange={(_event, value) => setTab(value)} centered sx={{ mt: 1, minHeight: 42, "& .MuiTab-root": { minHeight: 42, textTransform: "none", fontWeight: 600 } }}>
      <Tab value="code" icon={<TagRounded />} iconPosition="start" label="Código" />
      <Tab value="qr" icon={<QrCode2Rounded />} iconPosition="start" label="QR" />
    </Tabs>

    <Box sx={{ minHeight: { xs: 164, sm: 190 }, display: "grid", placeItems: "center", px: 2, py: 2.25, bgcolor: "rgba(168,117,60,.07)", borderTop: "1px solid", borderColor: "divider" }}>
      {tab === "code"
        ? <Stack alignItems="center" spacing={0.5}><Typography variant="overline" color="text.secondary">CÓDIGO PARA UNIRSE</Typography><Typography variant="h3" fontWeight={700} sx={{ letterSpacing: { xs: 5, sm: 8 } }}>{code || "••••••"}</Typography>{!hasInvite && <Typography variant="caption" color="text.secondary" textAlign="center">Genera una nueva invitación para mostrar el código.</Typography>}</Stack>
        : <Stack alignItems="center" spacing={1}><QRCode value={shareLink || "Invitación protegida"} size={148} /><Typography variant="caption" color="text.secondary">Escanea para entrar directamente</Typography></Stack>}
    </Box>

    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ p: { xs: 1.25, sm: 1.5 } }}>
      <Button fullWidth variant="contained" disableElevation disabled={!shareLink} startIcon={<ContentCopyRounded />} onClick={copyLink}>{copied ? "Enlace copiado" : "Copiar enlace"}</Button>
      <Button fullWidth variant="outlined" disabled={!shareLink} startIcon={<IosShareRounded />} onClick={share}>Compartir</Button>
      <Button fullWidth color="inherit" disabled={rotating} startIcon={<RefreshRounded />} onClick={onRotate}>Nueva invitación</Button>
    </Stack>
  </Box>;
}

SharedOrderInvitePanel.propTypes = {
  code: PropTypes.string,
  shareLink: PropTypes.string,
  onRotate: PropTypes.func.isRequired,
  rotating: PropTypes.bool,
};
