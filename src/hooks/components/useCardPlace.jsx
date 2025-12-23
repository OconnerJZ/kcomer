import { isMobile } from "@Utils/commons";
import { useState } from "react";

const useCardPlace = ({ data, loadBusinessMenu }) => {
  const [flipped, setFlipped] = useState(false);
  const [movement, setMovement] = useState("");
  const [expanded, setExpanded] = useState(!isMobile());

  const onMovement = ({ movement = "" }) => {
    setMovement(movement);
    if (movement === "menu") loadBusinessMenu(data?.id);
    setFlipped(!flipped);
  };

  const expandCard = () => {
    setExpanded(!expanded);
  };

  return {
    flipped,
    movement,
    onMovement,
    expandCard,
    expanded,
  };
};

export default useCardPlace;
