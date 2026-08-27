import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "auto",
  height: "auto",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  perspective: "1000px",
}));

export const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "auto",
});

export const StyledFront = styled(StyledCardContent, {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  display: flipped ? "none" : "flex",
  position: "relative",
  opacity: flipped ? 0 : 1,
  transition: "opacity .16s ease",
}));

export const StyledBack = styled(StyledCardContent, {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  display: flipped ? "flex" : "none",
  position: "relative",
  opacity: flipped ? 1 : 0,
  width: "100%",
  transition: "opacity .16s ease",
}));
