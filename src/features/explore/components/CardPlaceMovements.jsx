import { Swiper } from "antd-mobile";
import { Avatar, List, Rate, Spin } from "antd";
import { Box, Typography } from "@mui/material";
import CardPlaceBack from "./CardPlaceBack";
import MemoriesPhotos from "./MemoriesPhotos";
import CardMenuList from "@Features/menu/components/CardMenuList";
import { separateByGroups } from "@Shared/utils/commons";
import useCart from "@Features/cart/context/CartContext";
import { useGetReviewsByBusinessQuery } from "@Features/reviews/api/reviews.api";
import { normalizeReviews } from "@Features/reviews/model/review";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";

const resolveMediaUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\//, "")}`;
};

const buildMapsEmbedUrl = ({ latitude, longitude, address }) => {
  const query = latitude && longitude ? `${latitude},${longitude}` : address;
  if (!query) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

export const CardPlaceLocation = ({ flipped, onMovement, business }) => {
  const location = business?.location || {};
  const mapUrl = buildMapsEmbedUrl(location);

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {mapUrl ? (
        <iframe
          src={mapUrl}
          title={`Ubicación de ${business?.name || "negocio"}`}
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Ubicación no disponible
          </Typography>
        </Box>
      )}
    </CardPlaceBack>
  );
};

export const CardPlacePhotos = ({ flipped, onMovement, business }) => {
  const imgs = (business?.photos || [])
    .map((photo) => resolveMediaUrl(typeof photo === "string" ? photo : photo?.url || photo?.image || photo?.imageUrl))
    .filter(Boolean);

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      {imgs.length > 0 ? (
        <MemoriesPhotos imgs={imgs} />
      ) : (
        <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Este negocio aún no tiene fotos publicadas
          </Typography>
        </Box>
      )}
    </CardPlaceBack>
  );
};

export const CardPlaceMenu = ({ flipped, onMovement, businessId, businessName, menu = [] }) => {
  const { addToCart } = useCart();

  if (!menu || menu.length === 0) {
    return (
      <CardPlaceBack flipped={flipped} onMovement={onMovement}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, p: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>Menú no disponible</Typography>
          <Typography variant="body2" color="text.secondary" align="center">Este negocio aún no ha cargado su menú</Typography>
        </Box>
      </CardPlaceBack>
    );
  }

  const groups = separateByGroups({ lista: menu, limited: 3 });
  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      <Swiper>
        {groups.map((items) => (
          <Swiper.Item key={items[0]?.id}>
            {items.map((item) => (
              <CardMenuList
                key={item.id}
                item={item}
                businessId={businessId}
                businessName={businessName}
                onAddToCart={addToCart}
              />
            ))}
          </Swiper.Item>
        ))}
      </Swiper>
    </CardPlaceBack>
  );
};

export const CardPlaceReviews = ({ flipped, onMovement, businessId }) => {
  const { data: reviewsResponse, isLoading } = useGetReviewsByBusinessQuery(
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
      ) : reviews.length === 0 ? (
        <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Este negocio aún no tiene reseñas
          </Typography>
        </Box>
      ) : (
        <List
          itemLayout="vertical"
          size="default"
          pagination={reviews.length > 2 ? { position: "bottom", align: "center", responsive: true, pageSize: 2 } : false}
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item key={item.id || `${item.userName}-${item.createdAt || item.comment}`} style={{ fontSize: "11.5px" }}>
              <List.Item.Meta
                avatar={<Avatar src={resolveMediaUrl(item.avatar)}>{item.userName?.charAt(0)}</Avatar>}
                title={item.userName}
                description={item.rating > 0 ? <Rate disabled allowHalf value={item.rating} style={{ fontSize: 13 }} /> : null}
              />
              {item.comment || "Sin comentario"}
            </List.Item>
          )}
        />
      )}
    </CardPlaceBack>
  );
};
