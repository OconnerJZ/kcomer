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
import { Collapse, Box, Stack } from "@mui/material";
import { ThumbUp, ThumbDown, DeliveryDining } from "@mui/icons-material";

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
  const { flipped, movement, expanded, onMovement, expandCard } =
    useCardPlace();
  return (
    <StyledCard sx={{ width: 340, borderRadius: "20px" }} elevation={7}>
      <CardHeader
        onClick={expandCard}
        avatar={
          <Avatar
            className="card-avatar"
            sx={{
              width: 120,
              height: 120,
              //border: "2px solid rgb(255,64,59)",
              border: "2px solid rgba(13, 158, 61, 1)",
              borderStyle: "dashed",
              padding: "2px",
            }}
            aria-label="recipe"
            src={data?.urlImage}
          />
        }
        title={<TitlePlace text={data?.title} />}
        subheader={
          <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={1}>
              <ThumbUp sx={{ fontSize: "23px", color: "#efb810" }} />
              <span>3</span>
              <DeliveryDining sx={{ fontSize: "27px" }} />           
            </Stack>
          </Box>
        }
        sx={{
          padding: expanded
            ? "16px 16px 0px 16px"
            : { xs: "16px 16px 16px 16px", sm: "16px 16px 0px 16px" },
          textAlign: "center",
        }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
      </Collapse>
    </StyledCard>
  );
};

export default CardPlace;
