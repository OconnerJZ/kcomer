import { Box, ButtonBase, Typography } from "@mui/material";
import PropTypes from "prop-types";
import PhotoLibraryRounded from "@mui/icons-material/PhotoLibraryRounded";
import RestaurantMenuRounded from "@mui/icons-material/RestaurantMenuRounded";
import NearMeRounded from "@mui/icons-material/NearMeRounded";
import ReviewsRounded from "@mui/icons-material/ReviewsRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import CardPlaceAccordion from "./CardPlaceAccordion";
import { StyledFront } from "./CardPlaceStyled";

const ACTIONS = [
  { key: "menu", label: "Menú", helper: "Qué pedir", icon: RestaurantMenuRounded, color: "#D97706", tint: "rgba(217,119,6,.10)" },
  { key: "location", label: "Llegar", helper: "Ubicación", icon: NearMeRounded, color: "#2563EB", tint: "rgba(37,99,235,.09)" },
  { key: "photo", label: "Fotos", helper: "Conócelo", icon: PhotoLibraryRounded, color: "#7C3AED", tint: "rgba(124,58,237,.09)" },
  { key: "review", label: "Reseñas", helper: "Opiniones", icon: ReviewsRounded, color: "#0F766E", tint: "rgba(15,118,110,.09)" },
];

const CardPlaceFront = ({ flipped, onMovement, data }) => (
  <StyledFront flipped={flipped} sx={{ p: "16px !important", alignItems: "stretch !important" }}>
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 1 }}>
      {ACTIONS.map(({ key, label, helper, icon: Icon, color, tint }) => (
        <ButtonBase
          key={key}
          onClick={(event) => {
            event.stopPropagation();
            onMovement({ movement: key });
          }}
          sx={{
            minHeight: 64,
            px: 1.35,
            py: 1.1,
            borderRadius: "10px",
            justifyContent: "flex-start",
            textAlign: "left",
            bgcolor: "rgba(247,245,243,.94)",
            border: "1px solid rgba(34,28,25,.055)",
            transition: "transform .18s ease, background-color .18s ease, box-shadow .18s ease",
            "&:hover": {
              bgcolor: "#fff",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 24px rgba(36,29,26,.08)",
            },
          }}
        >
          <Box sx={{ width: 34, height: 34, borderRadius: "8px", mr: 1.1, flexShrink: 0, display: "grid", placeItems: "center", bgcolor: tint, color }}>
            <Icon sx={{ fontSize: 18 }} />
          </Box>
          <Box minWidth={0} flex={1}>
            <Typography variant="body2" fontWeight={850} lineHeight={1.05}>{label}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: ".66rem" }}>{helper}</Typography>
          </Box>
          <ArrowOutwardRounded sx={{ fontSize: 15, color: "text.disabled" }} />
        </ButtonBase>
      ))}
    </Box>
    <Box sx={{ mt: 1.25 }}>
      <CardPlaceAccordion data={data} />
    </Box>
  </StyledFront>
);

CardPlaceFront.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default CardPlaceFront;
