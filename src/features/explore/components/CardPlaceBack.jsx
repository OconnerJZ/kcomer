import { Box, Button, Divider } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { StyledBack } from "./CardPlaceStyled";

const CardPlaceBack = ({ flipped, onMovement, children }) => (
  <StyledBack flipped={flipped} sx={{ p: "12px !important", alignItems: "stretch !important" }}>
    <Box sx={{ width: "100%", minWidth: 0 }}>{children}</Box>
    <Divider sx={{ my: 1.25 }} />
    <Button
      size="small"
      startIcon={<ArrowBackRounded />}
      onClick={(event) => { event.stopPropagation(); onMovement({ movement: "" }); }}
      sx={{ alignSelf: "flex-start", borderRadius: 999, textTransform: "none", color: "text.secondary", fontWeight: 750, px: 1.2 }}
    >
      Volver
    </Button>
  </StyledBack>
);
export default CardPlaceBack;
