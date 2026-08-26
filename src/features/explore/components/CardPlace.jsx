import { Avatar, Box, Chip, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { AccessTimeRounded, DeliveryDiningRounded, KeyboardArrowDownRounded, PlaceRounded } from "@mui/icons-material";
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Features/explore/hooks/useCardPlace";
import { CardPlaceLocation, CardPlaceMenu, CardPlacePhotos, CardPlaceReviews } from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";
import ScheduleDialog from "./ScheduleDialog";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { normalizeBusiness } from "@Features/business/model/business";
import { useMemo, useState } from "react";

const getMediaUrl = (value = "") => !value ? "" : /^https?:\/\//i.test(value) ? value : `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;

const MovementContent = ({ movement, flipped, onMovement, business }) => ({
  location: <CardPlaceLocation flipped={flipped} onMovement={onMovement} business={business} />,
  photo: <CardPlacePhotos flipped={flipped} onMovement={onMovement} business={business} />,
  menu: <CardPlaceMenu flipped={flipped} onMovement={onMovement} businessId={business.id} businessName={business.name} paymentMethods={business.paymentMethods} menu={business.menu} />,
  review: <CardPlaceReviews flipped={flipped} onMovement={onMovement} businessId={business.id} />,
}[movement] || null);

const CardPlace = ({ data, loadBusinessMenu }) => {
  const business = useMemo(() => normalizeBusiness(data), [data]);
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({ data: business, loadBusinessMenu });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const coverUrl = getMediaUrl(business.coverImage);
  const logoUrl = getMediaUrl(business.logo);

  return (
    <>
      <StyledCard elevation={0} sx={{ width: { xs: "min(92vw,370px)", sm: 370 }, borderRadius: 5, overflow: "hidden", bgcolor: "#fff", border: "1px solid rgba(38,31,28,.07)", boxShadow: "0 20px 55px rgba(35,29,26,.10)", transition: "transform .22s ease,box-shadow .22s ease", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 30px 70px rgba(35,29,26,.15)" } }}>
        <Box onClick={expandCard} sx={{ cursor: "pointer" }}>
          <Box sx={{ position: "relative", height: 164, m: 1.15, mb: 0, borderRadius: 4, overflow: "hidden", backgroundImage: coverUrl ? `url(${coverUrl})` : "linear-gradient(135deg,#ede7e3,#d8cec8)", backgroundSize: "cover", backgroundPosition: "center" }}>
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.03) 28%,rgba(18,14,12,.65) 100%)" }} />
            <Stack direction="row" justifyContent="space-between" sx={{ position: "absolute", top: 11, left: 11, right: 11 }}>
              <Chip size="small" label={business.open ? "Abierto ahora" : "Cerrado"} sx={{ height: 27, bgcolor: business.open ? "rgba(255,255,255,.94)" : "rgba(25,22,21,.82)", color: business.open ? "success.dark" : "white", fontWeight: 850, fontSize: ".68rem", backdropFilter: "blur(8px)" }} />
              <IconButton size="small" onClick={(event) => { event.stopPropagation(); setScheduleOpen(true); }} sx={{ width: 31, height: 31, bgcolor: "rgba(255,255,255,.92)", "&:hover": { bgcolor: "white" } }}>
                <AccessTimeRounded sx={{ fontSize: 17 }} />
              </IconButton>
            </Stack>
            <Box sx={{ position: "absolute", left: 14, right: 14, bottom: 12 }}>
              <Stack direction="row" spacing={1.1} alignItems="flex-end">
                <Avatar src={logoUrl} sx={{ width: 48, height: 48, border: "2px solid white", boxShadow: "0 5px 16px rgba(0,0,0,.2)" }}>{business.name?.charAt(0)}</Avatar>
                <Box minWidth={0} flex={1}>
                  <Typography noWrap sx={{ color: "white", fontSize: "1.18rem", fontWeight: 900, lineHeight: 1.05, textShadow: "0 2px 10px rgba(0,0,0,.2)" }}>{business.name || "Negocio"}</Typography>
                  <Stack direction="row" spacing={.8} alignItems="center" sx={{ mt: .45, color: "rgba(255,255,255,.86)" }}>
                    {business.location?.city && <><PlaceRounded sx={{ fontSize: 13 }} /><Typography variant="caption" fontWeight={650}>{business.location.city}</Typography></>}
                    {business.hasDelivery && <><DeliveryDiningRounded sx={{ fontSize: 14 }} /><Typography variant="caption">Delivery</Typography></>}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ px: 2, pt: 1.45, pb: 1.25 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box minWidth={0}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {business.description ? business.description.slice(0, 54) : "Descubre su menú, ubicación y experiencia."}{business.description?.length > 54 ? "…" : ""}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" sx={{ ml: 1 }}>
                <Typography variant="caption" fontWeight={800}>{expanded ? "Ocultar" : "Explorar"}</Typography>
                <KeyboardArrowDownRounded sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: ".2s" }} />
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ borderTop: "1px solid rgba(35,29,26,.06)", bgcolor: "#fff" }}>
            <CardPlaceFront flipped={flipped} onMovement={onMovement} data={business} />
            {movement && <MovementContent movement={movement} flipped={flipped} onMovement={onMovement} business={business} />}
          </Box>
        </Collapse>
      </StyledCard>
      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} data={business} />
    </>
  );
};

export default CardPlace;
