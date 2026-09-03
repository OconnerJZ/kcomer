import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { getBusinessPhotoUrls } from "../model/cardPlaceMovement";
import CardPlaceBack from "./CardPlaceBack";
import MemoriesPhotos from "./MemoriesPhotos";

const CardPlacePhotos = ({ flipped, onMovement, business }) => {
  const images = getBusinessPhotoUrls(business, API_URL_MEDIA_SERVER);

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {images.length > 0 ? (
        <MemoriesPhotos imgs={images} />
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
            Este negocio aún no tiene fotos publicadas
          </Typography>
        </Box>
      )}
    </CardPlaceBack>
  );
};

CardPlacePhotos.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  business: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  }).isRequired,
};

export default CardPlacePhotos;
