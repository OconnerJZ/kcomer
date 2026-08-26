import { Box, Button, Typography } from "@mui/material";

const ACCOUNT_NUMBER = "4152313876210043";
const CLABE = "012345678901234567";

export default function TransferPaymentInfo() {
  const copy = async (value, message) => {
    await navigator.clipboard.writeText(value);
    alert(message);
  };

  return (
    <Box mt={2}>
      <Typography variant="body2" fontWeight={600} mb={2} color="text.secondary">
        Realiza tu transferencia a:
      </Typography>

      <Box
        sx={{
          background: "linear-gradient(135deg, #db9238ff 0%, #ff4b45 100%)",
          borderRadius: 3,
          p: 3,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box sx={{ width: 50, height: 40, background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", borderRadius: 1.5 }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>qsCome</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>Número de Cuenta</Typography>
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600, letterSpacing: 2, fontFamily: "monospace" }}>4152 3138 7621 0043</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>CLABE Interbancaria</Typography>
          <Typography variant="body2" sx={{ color: "white", fontWeight: 600, letterSpacing: 1, fontFamily: "monospace" }}>012 345 678 901 234 567</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>TITULAR</Typography>
            <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>Bryant Samuel Jaramillo Zarate</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>BANCO</Typography>
            <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>BBVA México</Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={2} display="flex" gap={1}>
        <Button size="small" variant="outlined" onClick={() => copy(ACCOUNT_NUMBER, "Número de cuenta copiado ✓")} sx={{ flex: 1, textTransform: "none" }}>
          Copiar Cuenta
        </Button>
        <Button size="small" variant="outlined" onClick={() => copy(CLABE, "CLABE copiada ✓")} sx={{ flex: 1, textTransform: "none" }}>
          Copiar CLABE
        </Button>
      </Box>
    </Box>
  );
}
