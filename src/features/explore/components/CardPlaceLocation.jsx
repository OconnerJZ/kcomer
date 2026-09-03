import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { buildBusinessMapsEmbedUrl } from "../model/cardPlaceMovement";
import CardPlaceBack from "./CardPlaceBack";

const CardPlaceLocation = ({ flipped, onMovement, business }) => {
  const mapUrl = buildBusinessMapsEmbedUrl(business.location);

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {mapUrl ? (
        <iframe
          src={mapUrl}
          title={`Ubicación de ${business.name || "negocio"}`}
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <Box
          sx={{
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            Ubicación no disponible
          </Typography>
        </Box>
      )}
    </CardPlaceBack>
  );
};

CardPlaceLocation.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  business: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      address: PropTypes.string,
    }),
  }).isRequired,
};

export default CardPlaceLocation;
