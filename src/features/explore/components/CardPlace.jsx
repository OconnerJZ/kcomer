import { Avatar, Box, Chip, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { AccessTimeRounded, DeliveryDiningRounded, KeyboardArrowDownRounded, NearMeRounded, PlaceRounded } from "@mui/icons-material";
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Features/explore/hooks/useCardPlace";
import { CardPlaceLocation, CardPlaceMenu, CardPlacePhotos, CardPlaceReviews } from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";
import ScheduleDialog from "./ScheduleDialog";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { normalizeBusiness } from "@Features/business/model/business";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { distanceLabel, foodTypeLabels } from "@Features/explore/model/placePresentation";

const getMediaUrl = (value = "") => !value ? "" : /^https?:\/\//i.test(value) ? value : `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
const toRadians = (value) => (Number(value) * Math.PI) / 180;
const getDistanceKm = (origin, destination) => {
  if (!origin || destination?.latitude === "" || destination?.longitude === "") return null;
  const lat1 = Number(origin.latitude), lon1 = Number(origin.longitude), lat2 = Number(destination.latitude), lon2 = Number(destination.longitude);
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
  const dLat = toRadians(lat2 - lat1), dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MovementContent = ({ movement, flipped, onMovement, business }) => ({
  location: <CardPlaceLocation flipped={flipped} onMovement={onMovement} business={business} />,
  photo: <CardPlacePhotos flipped={flipped} onMovement={onMovement} business={business} />,
  menu: <CardPlaceMenu flipped={flipped} onMovement={onMovement} businessId={business.id} businessName={business.name} paymentMethods={business.paymentMethods} menu={business.menu} />,
  review: <CardPlaceReviews flipped={flipped} onMovement={onMovement} businessId={business.id} />,
}[movement] || null);

const businessPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  paymentMethods: PropTypes.array,
  menu: PropTypes.array,
});

MovementContent.propTypes = {
  movement: PropTypes.string,
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  business: businessPropType.isRequired,
};

const CardPlace = ({ data, userLocation, loadBusinessMenu }) => {
  const business = useMemo(() => normalizeBusiness(data), [data]);
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({ data: business, loadBusinessMenu });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const backgroundUrl = getMediaUrl(business.coverImage || business.logo);
  const logoUrl = getMediaUrl(business.logo);
  const distance = useMemo(
    () => distanceLabel(userLocation, business.location),
    [business.location, userLocation],
  );
  const hasServiceTag = Boolean(business.hasDelivery);
  const foodTagLimit = Math.max(1, 3 - (distance ? 1 : 0) - (hasServiceTag ? 1 : 0));
  const foodTags = useMemo(() => foodTypeLabels(business).slice(0, foodTagLimit), [business, foodTagLimit]);

  return (
    <>
      <StyledCard
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 370,
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
          backgroundColor: "#D9D2C8",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(56,50,44,.16)",
          boxShadow: "0 3px 12px rgba(35,29,26,.08)",
          transition: "transform .22s ease,box-shadow .22s ease",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 18px rgba(35,29,26,.11)" },
          "&::before": { content: '""', position: "absolute", inset: 0, bgcolor: "rgba(35,31,28,.12)" },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, p: .3 }}>
          <Box
            sx={{
              borderRadius: "8px",
              overflow: "hidden",
              bgcolor: "rgba(254,253,251,.80)",
              border: "1px solid rgba(56,50,44,.12)",
              boxShadow: "0 1px 4px rgba(33,27,24,.05)",
            }}
          >
            <Box onClick={expandCard} sx={{ cursor: "pointer", px: 2, pt: 1.8, pb: 1.45 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.4}>
                <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                  <Avatar src={logoUrl} sx={{ width: 56, height: 56, bgcolor: "background.paper", border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 6px 16px rgba(0,0,0,.08)" }}>{business.name?.charAt(0)}</Avatar>
                  <Box minWidth={0}>
                    <Typography noWrap sx={{ fontSize: "1.12rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.025em" }}>{business.name || "Negocio"}</Typography>
                    <Stack direction="row" spacing={.7} alignItems="center" sx={{ mt: .55, color: "text.secondary" }}>
                      {business.location?.city && <><PlaceRounded sx={{ fontSize: 13 }} /><Typography variant="caption" fontWeight={650}>{business.location.city}</Typography></>}
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={.65} alignItems="center">
                  <Chip size="small" label={business.open ? "Abierto" : "Cerrado"} sx={{ height: 26, borderRadius:"15px" , fontWeight: 600, fontSize: ".66rem", bgcolor: business.open ? "rgba(95,120,100,.11)" : "rgba(0,0,0,.07)", color: business.open ? "success.dark" : "text.secondary" }} />
                  <IconButton size="small" onClick={(event) => { event.stopPropagation(); setScheduleOpen(true); }} sx={{ width: 30, height: 30, bgcolor: "rgba(255,255,255,0)", border: "1px solid rgba(0,0,0,.05)" }}><AccessTimeRounded sx={{ fontSize: 16 }} /></IconButton>
                </Stack>
              </Stack>

             
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.25 }}>
                
              {(foodTags.length > 0 || distance || hasServiceTag) && (
                <Stack direction="row" spacing={.65} flexWrap="wrap" useFlexGap sx={{ mt: 1.35 }}>
                  {foodTags.map((label) => (
                  <Chip key={label} size="small" label={label} sx={{ height: 25, borderRadius:"15px", fontSize: ".67rem", fontWeight: 600, bgcolor: "rgba(198,90,80,.22)", color: "primary.dark", border: "1px solid rgba(198,90,80,.16)" }} />
                  ))}
                  {distance && <Chip size="small" icon={<PlaceRounded />} label={distance} sx={{ height: 25, borderRadius:"15px", fontSize: ".67rem", fontWeight: 600, bgcolor: "rgba(102,115,106,.22)", color: "secondary.dark", border: "1px solid rgba(102,115,106,.18)", "& .MuiChip-icon": { color: "secondary.main" } }} />}
                  {hasServiceTag && <Chip size="small" icon={<DeliveryDiningRounded />} label="Delivery" sx={{ height: 25, borderRadius:"15px",  fontSize: ".67rem", fontWeight: 600, bgcolor: "rgba(198,90,80,.22)", color: "primary.dark", border: "1px solid rgba(198,90,80,.16)", "& .MuiChip-icon": { color: "primary.main" } }} />}
                </Stack>
              )}
                <Stack direction="row" alignItems="center"><Typography variant="caption" fontWeight={600}>{expanded ? "" : ""}</Typography><KeyboardArrowDownRounded sx={{ fontSize: 19, transform: expanded ? "rotate(180deg)" : "none", transition: ".2s" }} /></Stack>
              </Stack>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ borderTop: "1px solid rgba(255,75,69,.08)", bgcolor: "rgba(255,248,245,.58)" }}>
                <CardPlaceFront flipped={flipped} onMovement={onMovement} data={business} />
                {movement && <MovementContent movement={movement} flipped={flipped} onMovement={onMovement} business={business} />}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </StyledCard>
      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} data={business} />
    </>
  );
};

CardPlace.propTypes = {
  data: PropTypes.object.isRequired,
  userLocation: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  ]),
  loadBusinessMenu: PropTypes.func.isRequired,
};

export default CardPlace;
