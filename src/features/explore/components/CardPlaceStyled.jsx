import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "auto",
  height: "auto",
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(14px)",
  perspective: "1000px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 18px 48px rgba(18,18,18,0.08)",
  transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 24px 64px rgba(18,18,18,0.12)",
    borderColor: "rgba(255,75,69,.24)",
  },
}));

export const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "auto",
});

export const StyledFront = styled(StyledCardContent, {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
  backfaceVisibility: "hidden",
  transition: "transform 0.45s ease",
  position: flipped ? "absolute" : "relative",
}));

export const StyledBack = styled(StyledCardContent, {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  transform: flipped ? "rotateY(0)" : "rotateY(-180deg)",
  backfaceVisibility: "hidden",
  transition: "transform 0.45s ease",
  position: flipped ? "relative" : "absolute",
}));
