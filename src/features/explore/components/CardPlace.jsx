import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  DeliveryDining,
  FavoriteRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
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
import { useMemo, useState } from "react";

const getMediaUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

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
  const coverUrl = getMediaUrl(business.coverImage);
  const logoUrl = getMediaUrl(business.logo);

  const handleScheduleOpen = (event) => {
    event.stopPropagation();
    setScheduleOpen(true);
  };

  return (
    <>
      <StyledCard
        sx={{
          width: 350,
          borderRadius: 5,
          position: "relative",
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,.76)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,.82)",
          boxShadow: "0 18px 48px rgba(32,28,26,.10)",
          transition: "transform .22s ease, box-shadow .22s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 26px 60px rgba(32,28,26,.14)",
          },
        }}
        elevation={0}
      >
        <Box onClick={expandCard} sx={{ cursor: "pointer" }}>
          <Box
            sx={{
              position: "relative",
              height: 218,
              backgroundImage: coverUrl ? `url(${coverUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: "grey.200",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.04) 25%, rgba(0,0,0,.78) 100%)" }} />

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "absolute", inset: 14, bottom: "auto" }}>
              <Chip
                size="small"
                label={business.open ? "Abierto" : "Cerrado"}
                sx={{
                  bgcolor: business.open ? "rgba(255,255,255,.94)" : "rgba(22,22,22,.78)",
                  color: business.open ? "success.main" : "common.white",
                  fontWeight: 800,
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,.34)",
                }}
              />
              <IconButton
                size="small"
                aria-label="ver horarios"
                onClick={handleScheduleOpen}
                sx={{
                  bgcolor: "rgba(255,255,255,.90)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 5px 16px rgba(0,0,0,.12)",
                  "&:hover": { bgcolor: "common.white", transform: "scale(1.04)" },
                }}
              >
                <AccessTime fontSize="small" />
              </IconButton>
            </Stack>

            <Box sx={{ position: "absolute", left: 18, right: 18, bottom: 17 }}>
              <Stack direction="row" spacing={1.35} alignItems="center">
                <Avatar
                  src={logoUrl}
                  alt={business.name || "Negocio"}
                  sx={{
                    width: 58,
                    height: 58,
                    border: "2px solid rgba(255,255,255,.94)",
                    boxShadow: "0 5px 18px rgba(0,0,0,.2)",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    flexShrink: 0,
                  }}
                >
                  {business.name?.charAt(0) || "N"}
                </Avatar>
                <Box minWidth={0} sx={{ flex: 1 }}>
                  <Typography variant="h5" noWrap sx={{ color: "common.white", fontWeight: 900, lineHeight: 1.05, textShadow: "0 2px 14px rgba(0,0,0,.22)" }}>
                    {business.name || "Negocio"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .45 }}>
                    {business.location?.city && (
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,.82)", fontWeight: 600 }}>
                        {business.location.city}
                      </Typography>
                    )}
                    {business.hasDelivery && (
                      <Stack direction="row" spacing={0.35} alignItems="center">
                        <DeliveryDining sx={{ fontSize: 16, color: "rgba(255,255,255,.82)" }} />
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,.82)" }}>Delivery</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ px: 2.1, py: 1.45 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
              <Stack direction="row" spacing={1.1} alignItems="center" minWidth={0}>
                <FavoriteRounded sx={{ fontSize: 18, color: "warning.main" }} />
                <Typography variant="caption" color="text.secondary">{business.likes || 0}</Typography>
                {(business.tags || []).slice(0, 1).map((tag) => (
                  <Chip key={tag.label} label={tag.label} size="small" variant="outlined" sx={{ height: 24, borderRadius: 999, fontSize: ".68rem", bgcolor: "rgba(255,255,255,.46)" }} />
                ))}
              </Stack>

              <Stack direction="row" spacing={0.35} alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {expanded ? "Cerrar" : "Descubrir"}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={expanded ? "contraer negocio" : "ver negocio"}
                  sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ borderTop: "1px solid rgba(0,0,0,.06)", px: .3, pb: .5 }}>
            <CardPlaceFront flipped={flipped} onMovement={onMovement} data={business} />
            <MovementContent movement={movement} flipped={flipped} onMovement={onMovement} business={business} />
          </Box>
        </Collapse>
      </StyledCard>

      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} data={business} />
    </>
  );
};

export default CardPlace;
