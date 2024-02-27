import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Hooks/components/useCardPlace";
import {
  CardPlaceLocation,
  CardPlaceMenu,
  CardPlacePhotos,
  CardPlaceReviews,
} from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";

const TitlePlace = ({ text = "Tacos el pariente" }) => {
  return (
    <Typography
      className="titlePrimary"
      sx={{ fontWeight: 900, fontSize: "23px" }}
      level="title-sm"
    >
      {text}
    </Typography>
  );
};

const CardPlace = ({ data }) => {
  const { flipped, movement, feedback, onMovement } = useCardPlace();
  return (
    <StyledCard sx={{ width: 340, borderRadius: "20px" }} elevation={7}>
      <CardHeader
        avatar={
          <Avatar
            className="card-avatar"
            sx={{
              width: 120,
              height: 120,
              border: "2px solid rgb(255,64,59)",
              borderStyle: "dashed",
              padding: "2px",
            }}
            aria-label="recipe"
            src={data?.urlImage}
          />
        }
        title={<TitlePlace text={data?.title} />}
        subheader={feedback}
        sx={{ padding: "16px 16px 0px 16px", textAlign: "center" }}
      />
      <CardPlaceFront flipped={flipped} onMovement={onMovement} data={data} />
      {movement === "location" && (
        <CardPlaceLocation flipped={flipped} onMovement={onMovement} />
      )}
      {movement === "photo" && (
        <CardPlacePhotos flipped={flipped} onMovement={onMovement} />
      )}
      {movement === "menu" && (
        <CardPlaceMenu flipped={flipped} onMovement={onMovement} />
      )}
      {movement === "review" && (
        <CardPlaceReviews flipped={flipped} onMovement={onMovement} />
      )}
    </StyledCard>
  );
};

export default CardPlace;
