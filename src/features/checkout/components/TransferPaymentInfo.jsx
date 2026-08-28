import { Alert, Box, Button, Stack, Typography } from "@mui/material";

const spaced = (value = "", size = 4) => String(value).replace(/\s/g, "").replace(new RegExp(`(.{${size}})`, "g"), "$1 ").trim();

export default function TransferPaymentInfo({ config = {}, compact = false }) {
  const copy = async (value) => value && navigator.clipboard?.writeText(String(value));
  const hasDetails = config.accountHolder && config.bankName && (config.clabe || config.accountNumber);
  if (!hasDetails) return <Alert severity="warning">El negocio aún no ha completado sus datos bancarios.</Alert>;

  return (
    <Box mt={compact ? 0 : 2}>
      <Box sx={{ background: "linear-gradient(135deg, #b96b22 0%, #ff4b45 100%)", borderRadius: 3, p: compact ? 2 : 3, color: "white", boxShadow: "0 8px 20px rgba(255,75,69,.2)" }}>
        <Stack direction="row" justifyContent="space-between" mb={2} gap={2}>
          <Box><Typography variant="caption" sx={{ opacity: .72 }}>BANCO</Typography><Typography fontWeight={800}>{config.bankName}</Typography></Box>
          <Box textAlign="right"><Typography variant="caption" sx={{ opacity: .72 }}>TITULAR</Typography><Typography variant="body2" fontWeight={750}>{config.accountHolder}</Typography></Box>
        </Stack>
        {config.accountNumber && <Box mb={1.5}><Typography variant="caption" sx={{ opacity: .72 }}>NÚMERO DE CUENTA</Typography><Typography fontFamily="monospace" fontWeight={800}>{spaced(config.accountNumber)}</Typography></Box>}
        {config.clabe && <Box><Typography variant="caption" sx={{ opacity: .72 }}>CLABE INTERBANCARIA</Typography><Typography fontFamily="monospace" fontWeight={800}>{spaced(config.clabe, 3)}</Typography></Box>}
        {config.referenceInstructions && <Typography variant="caption" sx={{ display: "block", mt: 2, opacity: .88 }}>{config.referenceInstructions}</Typography>}
      </Box>
      <Stack direction="row" spacing={1} mt={1.5}>
        {config.accountNumber && <Button size="small" variant="outlined" fullWidth onClick={() => copy(config.accountNumber)} sx={{ textTransform: "none" }}>Copiar cuenta</Button>}
        {config.clabe && <Button size="small" variant="outlined" fullWidth onClick={() => copy(config.clabe)} sx={{ textTransform: "none" }}>Copiar CLABE</Button>}
      </Stack>
    </Box>
  );
}
