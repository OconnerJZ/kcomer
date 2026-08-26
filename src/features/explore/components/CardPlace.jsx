import { useState } from "react";
import PropTypes from "prop-types";
import {
  CardHeader,
  Avatar,
  Typography,
  Collapse,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { ThumbUp, DeliveryDining, AccessTime } from "@mui/icons-material";
import { StyledCard } from "@Components/card/CardPlaceStyled";
import useCardPlace from "@Features/explore/hooks/useCardPlace";
import {
  CardPlaceLocation,
  CardPlaceMenu,
  CardPlacePhotos,
  CardPlaceReviews,
} from "@Components/card/CardPlaceMovements";
import CardPlaceFront from "@Components/card/CardPlaceFront";
import ScheduleDialog from "@Components/card/ScheduleDialog";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";

const MEDIA_PATH = API_URL_MEDIA_SERVER;

const TitlePlace = ({ text = "Tacos el pariente" }) => (
  <Typography className="titlePrimary" sx={{ fontWeight: 900, fontSize: "23px" }} level="title-sm">
    {text}
  </Typography>
);

TitlePlace.propTypes = { text: PropTypes.string };

const BusinessAvatar = ({ data }) => (
  <Avatar
    className="card-avatar"
    sx={{
      width: 110,
      height: 110,
      border: data?.isOpen
        ? "2px solid rgba(13, 158, 61, 1)"
        : "2px solid rgb(255,64,59)",
      borderStyle: "dashed",
      padding: "2px",
      cursor: "pointer",
    }}
    aria-label="recipe"
    src={`${MEDIA_PATH}/${data?.urlImage}`}
  >
    {data?.title?.charAt(0) || "T"}
  </Avatar>
);

BusinessAvatar.propTypes = {
  data: PropTypes.shape({
    isOpen: PropTypes.bool,
    urlImage: PropTypes.string,
    title: PropTypes.string,
  }),
};

const BusinessStats = ({ likes, hasDelivery }) => (
  <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <ThumbUp sx={{ fontSize: "23px", color: "#efb810" }} />
      <Typography variant="body2">{likes || 0}</Typography>
      {hasDelivery && <DeliveryDining sx={{ fontSize: "27px" }} />}
    </Stack>
  </Box>
);

BusinessStats.propTypes = {
  likes: PropTypes.number,
  hasDelivery: PropTypes.bool,
};

const ScheduleButton = ({ onClick }) => (
  <IconButton
    color="default"
    aria-label="ver horarios"
    onClick={onClick}
    sx={{
      fontSize: "18px",
      bgcolor: "rgba(255,255,255,0.9)",
      "&:hover": {
        bgcolor: "rgba(255,255,255,1)",
        transform: "scale(1.1)",
      },
      transition: "all 0.2s",
    }}
  >
    <AccessTime />
  </IconButton>
);

ScheduleButton.propTypes = { onClick: PropTypes.func.isRequired };

const MovementContent = ({ movement, flipped, onMovement, data }) => {
  const movementMap = {
    location: <CardPlaceLocation flipped={flipped} onMovement={onMovement} />,
    photo: <CardPlacePhotos flipped={flipped} onMovement={onMovement} />,
    menu: (
      <CardPlaceMenu
        flipped={flipped}
        onMovement={onMovement}
        businessId={data.id}
        businessName={data.title}
        menu={data.menu || []}
      />
    ),
    review: <CardPlaceReviews flipped={flipped} onMovement={onMovement} />,
  };

  return movementMap[movement] || null;
};

MovementContent.propTypes = {
  movement: PropTypes.string,
  flipped: PropTypes.bool,
  onMovement: PropTypes.func,
  data: PropTypes.object,
};

const CardPlace = ({ data, loadBusinessMenu }) => {
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({
    data,
    loadBusinessMenu,
  });
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const handleScheduleOpen = (event) => {
    event.stopPropagation();
    setScheduleOpen(true);
  };

  return (
    <>
      <StyledCard sx={{ width: 340, borderRadius: "20px", position: "relative" }} elevation={7}>
        <CardHeader
          onClick={expandCard}
          avatar={<BusinessAvatar data={data} />}
          title={<TitlePlace text={data?.title} />}
          subheader={
            <Stack direction="row" spacing={1} justifyContent="center">
              <ScheduleButton onClick={handleScheduleOpen} />
              <BusinessStats likes={data?.likes} hasDelivery={data?.hasDelivery} />
            </Stack>
          }
          sx={{
            padding: expanded
              ? "16px 16px 0px 16px"
              : { xs: "16px 16px 16px 16px", sm: "16px 16px 0px 16px" },
            textAlign: "center",
            cursor: "pointer",
          }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardPlaceFront flipped={flipped} onMovement={onMovement} data={data} />
          <MovementContent movement={movement} flipped={flipped} onMovement={onMovement} data={data} />
        </Collapse>
      </StyledCard>

      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} data={data} />
    </>
  );
};

CardPlace.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    urlImage: PropTypes.string,
    isOpen: PropTypes.bool,
    likes: PropTypes.number,
    hasDelivery: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.object),
    schedule: PropTypes.object,
    menu: PropTypes.array,
  }).isRequired,
  loadBusinessMenu: PropTypes.func.isRequired,
};

export default CardPlace;
