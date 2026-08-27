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

const CardPlace = ({ data, loadBusinessMenu, userLocation }) => {
  const business = useMemo(() => normalizeBusiness(data), [data]);
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({ data: business, loadBusinessMenu });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const backgroundUrl = getMediaUrl(business.coverImage || business.logo);
  const logoUrl = getMediaUrl(business.logo);
  const distance = useMemo(() => getDistanceKm(userLocation, business.location), [userLocation, business.location]);
  const tags = (business.tags || []).map((tag) => typeof tag === "string" ? { label: tag } : tag).filter((tag) => tag?.label).slice(0, 3);

  return (
    <>
      <StyledCard elevation={0} sx={{ width: { xs: "min(92vw,370px)", sm: 370 }, borderRadius: 5, overflow: "hidden", position: "relative", backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "linear-gradient(135deg,#f0dfd5,#e4c8b8 55%,#f6d2bc)", backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(255,255,255,.45)", boxShadow: "0 22px 58px rgba(35,29,26,.15)", transition: "transform .22s ease,box-shadow .22s ease", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 32px 76px rgba(35,29,26,.2)" }, "&::before": { content: '""', position: "absolute", inset: 0, background: "linear-gradient(145deg,rgba(26,21,19,.13),rgba(255,75,69,.07))", backdropFilter: "blur(1.5px)" } }}>
        <Box sx={{ position: "relative", zIndex: 1, p: 1.2 }}>
          <Box sx={{ borderRadius: 4, overflow: "hidden", bgcolor: "rgba(255,255,255,.84)", backdropFilter: "blur(18px) saturate(1.14)", border: "1px solid rgba(255,255,255,.66)", boxShadow: "0 12px 34px rgba(33,27,24,.10)" }}>
            <Box onClick={expandCard} sx={{ cursor: "pointer", px: 2, pt: 1.8, pb: 1.45 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.4}>
                <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                  <Avatar src={logoUrl} sx={{ width: 52, height: 52, bgcolor: "background.paper", border: "1px solid rgba(255,75,69,.14)", boxShadow: "0 6px 16px rgba(255,75,69,.08)" }}>{business.name?.charAt(0)}</Avatar>
                  <Box minWidth={0}>
                    <Typography noWrap sx={{ fontSize: "1.12rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.025em" }}>{business.name || "Negocio"}</Typography>
                    <Stack direction="row" spacing={.65} useFlexGap flexWrap="wrap" alignItems="center" sx={{ mt: .55, color: "text.secondary" }}>
                      {business.location?.city && <Stack direction="row" spacing={.3} alignItems="center"><PlaceRounded sx={{ fontSize: 13 }} /><Typography variant="caption" fontWeight={650}>{business.location.city}</Typography></Stack>}
                      {distance != null && <Stack direction="row" spacing={.3} alignItems="center"><NearMeRounded sx={{ fontSize: 13, color: "primary.main" }} /><Typography variant="caption" fontWeight={750}>{distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</Typography></Stack>}
                      {business.hasDelivery && <Stack direction="row" spacing={.3} alignItems="center"><DeliveryDiningRounded sx={{ fontSize: 14 }} /><Typography variant="caption">Delivery</Typography></Stack>}
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={.65} alignItems="center">
                  <Chip size="small" label={business.open ? "Abierto" : "Cerrado"} sx={{ height: 26, fontWeight: 800, fontSize: ".66rem", bgcolor: business.open ? "rgba(46,125,50,.10)" : "rgba(0,0,0,.07)", color: business.open ? "success.dark" : "text.secondary" }} />
                  <IconButton size="small" onClick={(event) => { event.stopPropagation(); setScheduleOpen(true); }} sx={{ width: 30, height: 30, bgcolor: "rgba(255,255,255,.72)", border: "1px solid rgba(255,75,69,.10)" }}><AccessTimeRounded sx={{ fontSize: 16 }} /></IconButton>
                </Stack>
              </Stack>

              {business.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1.3, lineHeight: 1.5 }}>{`${business.description.slice(0, 86)}${business.description.length > 86 ? "…" : ""}`}</Typography>}

              {tags.length > 0 && <Stack direction="row" spacing={.6} useFlexGap flexWrap="wrap" sx={{ mt: 1.15 }}>{tags.map((tag, index) => <Chip key={tag.id || `${tag.label}-${index}`} label={tag.label} size="small" sx={{ height: 24, borderRadius: 999, fontSize: ".65rem", fontWeight: 750, bgcolor: index === 0 ? "rgba(255,75,69,.10)" : "rgba(255,171,64,.11)", border: "1px solid rgba(255,75,69,.09)" }} />)}</Stack>}

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.2 }}>
                <Typography variant="caption" color="text.secondary">Menú, ubicación, fotos y contacto</Typography>
                <Stack direction="row" alignItems="center"><Typography variant="caption" fontWeight={850}>{expanded ? "Ocultar" : "Explorar"}</Typography><KeyboardArrowDownRounded sx={{ fontSize: 19, transform: expanded ? "rotate(180deg)" : "none", transition: ".2s" }} /></Stack>
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

export default CardPlace;
