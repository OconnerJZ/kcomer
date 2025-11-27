import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const StyledCard = styled(Card)`
  width: auto; /* Ancho automático */
  height: auto; /* Altura automática */
  background-color: rgba(255,255,255,0.35);
  backdrop-filter: blur(5px);
  perspective: 1000px;
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
`;

export const StyledFront = styled(StyledCardContent, {
  shouldForwardProp: (props) => props !== "flipped",
})`
  transform: ${(props) => (props.flipped ? "rotateY(180deg)" : "rotateY(0)")};
  backface-visibility: hidden;
  transition: transform 0.5s;
  position: ${(props) => (props.flipped ? "absolute" : "relative")};
`;

export const StyledBack = styled(StyledCardContent, {
  shouldForwardProp: (props) => props !== "flipped",
})`
  transform: ${(props) => (props.flipped ? "rotateY(0)" : "rotateY(-180deg)")};
  backface-visibility: hidden;
  transition: transform 0.5s; 
  position: ${(props) => (props.flipped ? "relative" : "absolute")};
`;
