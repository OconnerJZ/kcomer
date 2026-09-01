import PropTypes from "prop-types";
import { Divider } from "antd";
import { Avatar } from "@mui/material";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { StyledBack } from "./CardPlaceStyled";

const CardPlaceBack = ({ flipped, onMovement, children }) => (
  <StyledBack flipped={flipped}>
    {children}
    <Divider />
    <Avatar
      onClick={() => onMovement({ movement: "" })}
      sx={{
        width: 48,
        height: 48,
        cursor: "pointer",
        bgcolor: "warning.main",
        color: "warning.contrastText",
      }}
    >
      <FastRewindIcon />
    </Avatar>
  </StyledBack>
);

CardPlaceBack.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default CardPlaceBack;
