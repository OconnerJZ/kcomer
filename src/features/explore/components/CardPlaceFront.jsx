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
  { key: "menu", label: "Menú", helper: "Qué pedir", icon: RestaurantMenuRounded, color: "#8F3E38", tint: "rgba(198,90,80,.09)" },
  { key: "location", label: "Llegar", helper: "Ubicación", icon: NearMeRounded, color: "#0d70e8", tint: "rgba(102,115,106,.09)" },
  { key: "photo", label: "Fotos", helper: "Conócelo", icon: PhotoLibraryRounded, color: "#465048", tint: "rgba(102,115,106,.09)" },
  { key: "review", label: "Reseñas", helper: "Opiniones", icon: ReviewsRounded, color: "#6935a4", tint: "rgba(198,90,80,.09)" },
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
            borderRadius: "8px",
            justifyContent: "flex-start",
            textAlign: "left",
            bgcolor: "#F7F4EF",
            border: "1px solid rgba(56,50,44,.10)",
            transition: "transform .18s ease, background-color .18s ease, box-shadow .18s ease",
            "&:hover": {
              bgcolor: "#fff",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 7px rgba(36,29,26,.07)",
            },
          }}
        >
          <Box sx={{ width: 34, height: 34, borderRadius: "50%", mr: 1.1, flexShrink: 0, display: "grid", placeItems: "center", bgcolor: tint, color }}>
            <Icon sx={{ fontSize: 18 }} />
          </Box>
          <Box minWidth={0} flex={1}>
            <Typography variant="body2" fontWeight={600} lineHeight={1.05}>{label}</Typography>
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
