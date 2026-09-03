import { Avatar, Box, Chip, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { AccessTimeRounded, DeliveryDiningRounded, KeyboardArrowDownRounded, PlaceRounded } from "@mui/icons-material";
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Features/explore/hooks/useCardPlace";
import { CardPlaceLocation, CardPlaceMenu, CardPlacePhotos } from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";
import ScheduleDialog from "./ScheduleDialog";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { normalizeBusiness } from "@Features/business/model/business";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { distanceLabel, foodTypeLabels } from "@Features/explore/model/placePresentation";

const getMediaUrl = (value = "") => !value ? "" : /^https?:\/\//i.test(value) ? value : `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;

const MovementContent = ({ movement, flipped, onMovement, business }) => ({
  location: <CardPlaceLocation flipped={flipped} onMovement={onMovement} business={business} />,
  photo: <CardPlacePhotos flipped={flipped} onMovement={onMovement} business={business} />,
  menu: <CardPlaceMenu flipped={flipped} onMovement={onMovement} businessId={business.id} businessName={business.name} paymentMethods={business.paymentMethods} menu={business.menu} />,
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
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "linear-gradient(135deg,#e8ded8,#cdbdb4)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(255,255,255,.45)",
          boxShadow: "0 22px 58px rgba(35,29,26,.15)",
          transition: "transform .22s ease,box-shadow .22s ease",
          "&:hover": { transform: "translateY(-5px)", boxShadow: "0 32px 76px rgba(35,29,26,.2)" },
          "&::before": { content: '""', position: "absolute", inset: 0, bgcolor: "rgba(26,21,19,.16)", backdropFilter: "blur(1.5px)" },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, p: 1.2 }}>
          <Box
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: "rgba(255,255,255,.82)",
              backdropFilter: "blur(18px) saturate(1.12)",
              border: "1px solid rgba(255,255,255,.62)",
              boxShadow: "0 12px 34px rgba(33,27,24,.10)",
            }}
          >
            <Box onClick={expandCard} sx={{ cursor: "pointer", px: 2, pt: 1.8, pb: 1.45 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.4}>
                <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                  <Avatar src={logoUrl} sx={{ width: 52, height: 52, bgcolor: "background.paper", border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 6px 16px rgba(0,0,0,.08)" }}>{business.name?.charAt(0)}</Avatar>
                  <Box minWidth={0}>
                    <Typography noWrap sx={{ fontSize: "1.12rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.025em" }}>{business.name || "Negocio"}</Typography>
                    <Stack direction="row" spacing={.7} alignItems="center" sx={{ mt: .55, color: "text.secondary" }}>
                      {business.location?.city && <><PlaceRounded sx={{ fontSize: 13 }} /><Typography variant="caption" fontWeight={650}>{business.location.city}</Typography></>}
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={.65} alignItems="center">
                  <Chip size="small" label={business.open ? "Abierto" : "Cerrado"} sx={{ height: 26, fontWeight: 800, fontSize: ".66rem", bgcolor: business.open ? "rgba(46,173,103,.11)" : "rgba(0,0,0,.07)", color: business.open ? "success.dark" : "text.secondary" }} />
                  <IconButton size="small" onClick={(event) => { event.stopPropagation(); setScheduleOpen(true); }} sx={{ width: 30, height: 30, bgcolor: "rgba(255,255,255,.7)", border: "1px solid rgba(0,0,0,.05)" }}><AccessTimeRounded sx={{ fontSize: 16 }} /></IconButton>
                </Stack>
              </Stack>

              {(foodTags.length > 0 || distance || hasServiceTag) && (
                <Stack direction="row" spacing={.65} flexWrap="wrap" useFlexGap sx={{ mt: 1.35 }}>
                  {foodTags.map((label) => (
                    <Chip key={label} size="small" label={label} sx={{ height: 25, fontSize: ".67rem", fontWeight: 750, bgcolor: "rgba(255,159,28,.14)", color: "secondary.dark", border: "1px solid rgba(255,159,28,.22)" }} />
                  ))}
                  {distance && <Chip size="small" icon={<PlaceRounded />} label={distance} sx={{ height: 25, fontSize: ".67rem", fontWeight: 750, bgcolor: "rgba(46,173,103,.13)", color: "success.dark", border: "1px solid rgba(46,173,103,.2)", "& .MuiChip-icon": { color: "success.main" } }} />}
                  {hasServiceTag && <Chip size="small" icon={<DeliveryDiningRounded />} label="Delivery" sx={{ height: 25, fontSize: ".67rem", fontWeight: 750, bgcolor: "rgba(255,75,69,.11)", color: "primary.dark", border: "1px solid rgba(255,75,69,.18)", "& .MuiChip-icon": { color: "primary.main" } }} />}
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.25 }}>
                <Typography variant="caption" color="text.secondary">Todo lo esencial, sin salir de la tarjeta</Typography>
                <Stack direction="row" alignItems="center"><Typography variant="caption" fontWeight={850}>{expanded ? "Ocultar" : "Explorar"}</Typography><KeyboardArrowDownRounded sx={{ fontSize: 19, transform: expanded ? "rotate(180deg)" : "none", transition: ".2s" }} /></Stack>
              </Stack>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ borderTop: "1px solid rgba(35,29,26,.07)", bgcolor: "rgba(255,255,255,.54)" }}>
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
