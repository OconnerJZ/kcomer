import { Divider } from "antd";
import { Avatar } from "@mui/joy";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { StyledBack } from "./CardPlaceStyled";

const CardPlaceBack = ({ flipped, onMovement, children }) => (
  <StyledBack flipped={flipped}>
    {children}
    <Divider />
    <Avatar
      color="warning"
      style={{ cursor: "pointer" }}
      size="lg"
      onClick={() => onMovement({ movement: "" })}
    >
      <FastRewindIcon />
    </Avatar>
  </StyledBack>
);

export default CardPlaceBack;
