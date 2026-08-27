import { Box, Typography } from "@mui/material";
import { Ballot } from "@mui/icons-material";

export default function EmptyCartState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        px: 3,
      }}
    >
      <Ballot sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Parece que no hay pedidos todavía
      </Typography>
      <Typography color="text.secondary">
        Descubre negocios cercanos y empieza a pedir
      </Typography>
    </Box>
  );
}
