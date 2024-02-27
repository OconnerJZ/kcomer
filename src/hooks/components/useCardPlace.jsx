import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";

const feedback = (
  <Box sx={{ mt: 1 }}>
    <IconButton size="small">
      <ThumbUp sx={{ fontSize: "23px" }} />
    </IconButton>
    <IconButton size="small">
      <ThumbDown sx={{ fontSize: "23px" }} />
    </IconButton>
  </Box>
);

const useCardPlace = () => {
  const [flipped, setFlipped] = useState(false);
  const [movement, setMovement] = useState("");

  const onMovement = ({ movement = "" }) => {
    setMovement(movement);
    setFlipped(!flipped);
  };

  return {
    flipped,
    movement,
    onMovement,
    feedback,
  };
};

export default useCardPlace;
