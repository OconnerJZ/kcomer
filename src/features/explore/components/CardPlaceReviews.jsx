import PropTypes from "prop-types";
import { Avatar, List, Rate, Spin } from "antd";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { useGetReviewsByBusinessQuery } from "@Features/reviews/api/reviews.api";
import { normalizeReviews } from "@Features/reviews/model/review";
import { resolveExploreMediaUrl } from "../model/cardPlaceMovement";
import CardPlaceBack from "./CardPlaceBack";

const CardPlaceReviews = ({ flipped, onMovement, businessId }) => {
  const { data: reviewsResponse, isLoading, isError, error } = useGetReviewsByBusinessQuery(
    { businessId },
    { skip: !businessId },
  );
  const reviews = normalizeReviews(reviewsResponse?.data || reviewsResponse || []);

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {isLoading ? (
        <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </Box>
      ) : isError ? (
        <Alert severity="warning" sx={{ m: 2 }}>
          {error?.data?.message || "No pudimos cargar las reseñas en este momento"}
        </Alert>
      ) : reviews.length === 0 ? (
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
            Este negocio aún no tiene reseñas
          </Typography>
        </Box>
      ) : (
        <List
          itemLayout="vertical"
          size="default"
          pagination={reviews.length > 2
            ? { position: "bottom", align: "center", responsive: true, pageSize: 2 }
            : false}
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item
              key={item.id || `${item.userName}-${item.createdAt || item.comment}`}
              style={{ fontSize: "11.5px" }}
            >
              <List.Item.Meta
                avatar={(
                  <Avatar src={resolveExploreMediaUrl(item.avatar, API_URL_MEDIA_SERVER)}>
                    {item.userName?.charAt(0)}
                  </Avatar>
                )}
                title={(
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>{item.userName}</span>
                    {item.verifiedOrder && <Chip label="Compra verificada" size="small" variant="outlined" sx={{ height: 20, fontSize: 10 }} />}
                  </Stack>
                )}
                description={item.rating > 0
                  ? <Rate disabled allowHalf value={item.rating} style={{ fontSize: 13 }} />
                  : null}
              />
              <Typography variant="body2">{item.comment || "Sin comentario"}</Typography>
              {item.ownerResponse?.text && (
                <Box sx={{ mt: 1.25, p: 1.25, bgcolor: "grey.50", borderLeft: "3px solid", borderColor: "divider" }}>
                  <Typography variant="caption" fontWeight={700}>Respuesta del negocio</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">{item.ownerResponse.text}</Typography>
                </Box>
              )}
            </List.Item>
          )}
        />
      )}
    </CardPlaceBack>
  );
};

CardPlaceReviews.propTypes = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CardPlaceReviews;
