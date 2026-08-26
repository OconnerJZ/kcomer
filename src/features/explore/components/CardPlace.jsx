import { useMemo, useState } from "react";
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
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Features/explore/hooks/useCardPlace";
import {
  CardPlaceLocation,
  CardPlaceMenu,
  CardPlacePhotos,
  CardPlaceReviews,
} from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";
import ScheduleDialog from "./ScheduleDialog";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { normalizeBusiness } from "@Features/business/model/business";

const MEDIA_PATH = API_URL_MEDIA_SERVER;

const getMediaUrl = (logo = "") => {
  if (!logo) return "";
  if (/^https?:\/\//i.test(logo)) return logo;
  return `${MEDIA_PATH.replace(/\/$/, "")}/${String(logo).replace(/^\/+/, "")}`;
};

const TitlePlace = ({ text = "Negocio" }) => (
  <Typography className="titlePrimary" sx={{ fontWeight: 900, fontSize: "23px" }} level="title-sm">
    {text}
  </Typography>
);

const BusinessAvatar = ({ business }) => (
  <Avatar
    className="card-avatar"
    sx={{
      width: 110,
      height: 110,
      border: business.open
        ? "2px solid rgba(13, 158, 61, 1)"
        : "2px solid rgb(255,64,59)",
      borderStyle: "dashed",
      padding: "2px",
      cursor: "pointer",
    }}
    aria-label={business.name || "negocio"}
    src={getMediaUrl(business.logo)}
  >
    {business.name?.charAt(0) || "N"}
  </Avatar>
);

const BusinessStats = ({ likes, hasDelivery }) => (
  <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <ThumbUp sx={{ fontSize: "23px", color: "#efb810" }} />
      <Typography variant="body2">{likes || 0}</Typography>
      {hasDelivery && <DeliveryDining sx={{ fontSize: "27px" }} />}
    </Stack>
  </Box>
);

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

const MovementContent = ({ movement, flipped, onMovement, business }) => {
  const movementMap = {
    location: <CardPlaceLocation flipped={flipped} onMovement={onMovement} business={business} />,
    photo: <CardPlacePhotos flipped={flipped} onMovement={onMovement} business={business} />,
    menu: (
      <CardPlaceMenu
        flipped={flipped}
        onMovement={onMovement}
        businessId={business.id}
        businessName={business.name}
        paymentMethods={business.paymentMethods}
        menu={business.menu}
      />
    ),
    review: (
      <CardPlaceReviews
        flipped={flipped}
        onMovement={onMovement}
        businessId={business.id}
      />
    ),
  };

  return movementMap[movement] || null;
};

const CardPlace = ({ data, loadBusinessMenu }) => {
  const business = useMemo(() => normalizeBusiness(data), [data]);
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({
    data: business,
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
          avatar={<BusinessAvatar business={business} />}
          title={<TitlePlace text={business.name} />}
          subheader={
            <Stack direction="row" spacing={1} justifyContent="center">
              <ScheduleButton onClick={handleScheduleOpen} />
              <BusinessStats likes={business.likes} hasDelivery={business.hasDelivery} />
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
          <CardPlaceFront flipped={flipped} onMovement={onMovement} data={business} />
          <MovementContent movement={movement} flipped={flipped} onMovement={onMovement} business={business} />
        </Collapse>
      </StyledCard>

      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} data={business} />
    </>
  );
};

export default CardPlace;
