import { Divider } from "antd";
import { StyledBack } from "./CardPlaceStyled";
import { Avatar } from "@mui/joy";
import FastRewindIcon from "@mui/icons-material/FastRewind";

const CardPlaceMovement = ({ flipped, onMovement, children }) => {
  return (
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
};

export default CardPlaceMovement;
