import { useMemo, useState } from "react";
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

  const handleScheduleOpen = (event) => {
    event.stopPropagation();
    setScheduleOpen(true);
  };

  return (
    <>
      <StyledCard sx={{ width: 340, borderRadius: 4, position: "relative" }} elevation={0}>
        <Box onClick={expandCard} sx={{ cursor: "pointer" }}>
          <Box
            sx={{
              position: "relative",
              height: 168,
              backgroundImage: business.logo ? `url(${getMediaUrl(business.logo)})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: "grey.200",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,.04) 20%, rgba(0,0,0,.58) 100%)",
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "absolute", inset: 12, bottom: "auto" }}>
              <Chip
                size="small"
                label={business.open ? "Abierto" : "Cerrado"}
                sx={{
                  bgcolor: business.open ? "rgba(255,255,255,.93)" : "rgba(22,22,22,.78)",
                  color: business.open ? "success.main" : "common.white",
                  fontWeight: 800,
                  backdropFilter: "blur(8px)",
                }}
              />
              <IconButton
                size="small"
                aria-label="ver horarios"
                onClick={handleScheduleOpen}
                sx={{ bgcolor: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "common.white" } }}
              >
                <AccessTime fontSize="small" />
              </IconButton>
            </Stack>

            <Box sx={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
              <Typography variant="h5" sx={{ color: "common.white", fontWeight: 900, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,.2)" }}>
                {business.name || "Negocio"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ px: 2, py: 1.75 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
              <Stack direction="row" spacing={1.4} alignItems="center" minWidth={0}>
                <Avatar
                  src={getMediaUrl(business.logo)}
                  alt={business.name || "Negocio"}
                  sx={{ width: 42, height: 42, border: "1px solid", borderColor: "divider" }}
                >
                  {business.name?.charAt(0) || "N"}
                </Avatar>
                <Box minWidth={0}>
                  <Typography variant="body2" fontWeight={800} noWrap>
                    {business.name || "Negocio"}
                  </Typography>
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 0.35 }}>
                    <Stack direction="row" spacing={0.4} alignItems="center">
                      <FavoriteRounded sx={{ fontSize: 16, color: "warning.main" }} />
                      <Typography variant="caption" color="text.secondary">{business.likes || 0}</Typography>
                    </Stack>
                    {business.hasDelivery && (
                      <Stack direction="row" spacing={0.4} alignItems="center">
                        <DeliveryDining sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">Delivery</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>

              <IconButton
                size="small"
                aria-label={expanded ? "contraer negocio" : "ver negocio"}
                sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }}
              >
                <KeyboardArrowDown />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
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
