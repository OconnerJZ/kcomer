import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Swiper } from "antd-mobile";
import { Avatar, List, Rate, Spin } from "antd";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import CardPlaceBack from "./CardPlaceBack";
import MemoriesPhotos from "./MemoriesPhotos";
import CardMenuList from "@Features/menu/components/CardMenuList";
import { separateByGroups } from "@Shared/utils/commons";
import useCart from "@Features/cart/context/CartContext";
import { useGetReviewsByBusinessQuery } from "@Features/reviews/api/reviews.api";
import { normalizeReviews } from "@Features/reviews/model/review";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import { useAddSharedOrderItemMutation, useDeleteSharedOrderItemMutation, useGetActiveSharedOrderQuery, useUpdateSharedOrderItemMutation } from "@Features/shared-orders/api/sharedOrders.api";
import useOrderTarget from "@Features/shared-orders/hooks/useOrderTarget";
import { sharedOrderError } from "@Features/shared-orders/model/sharedOrder";

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

export const CardPlaceMenu = ({
  flipped,
  onMovement,
  businessId,
  businessName,
  paymentMethods = [],
  menu = [],
}) => {
  const { addToCart } = useCart();
  const [orderTarget] = useOrderTarget();
  const { data: activeSharedOrder } = useGetActiveSharedOrderQuery();
  const [sessionSnapshot, setSessionSnapshot] = useState(null);
  const [busyMenuId, setBusyMenuId] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "success" });
  const [addSharedItem] = useAddSharedOrderItemMutation();
  const [updateSharedItem] = useUpdateSharedOrderItemMutation();
  const [deleteSharedItem] = useDeleteSharedOrderItemMutation();
  const sharedTarget = orderTarget === "shared" && activeSharedOrder?.status === "open";
  const sharedTargetName = sessionSnapshot?.self?.name || activeSharedOrder?.self?.name || "tu pedido del grupo";

  useEffect(() => setSessionSnapshot(activeSharedOrder || null), [activeSharedOrder]);

  const findOwnSharedItem = (menuId, snapshot = sessionSnapshot) => (snapshot?.items || []).find((entry) =>
    entry.mine && Number(entry.menuId) === Number(menuId) && Number(entry.businessId) === Number(businessId));

  const handleProductChange = async (payload) => {
    if (!sharedTarget) return addToCart(payload);

    const menuId = Number(payload.itemId);
    const quantity = Number(payload.item.quantity || 0);
    const currentItem = findOwnSharedItem(menuId);
    setBusyMenuId(menuId);
    try {
      let updated;
      if (currentItem && quantity <= 0) {
        updated = await deleteSharedItem({ id: sessionSnapshot.id, itemId: currentItem.id, expectedVersion: sessionSnapshot.version }).unwrap();
      } else if (currentItem) {
        updated = await updateSharedItem({ id: sessionSnapshot.id, itemId: currentItem.id, quantity, note: payload.item.note || "", modifiers: payload.item.modifiers || [], expectedVersion: sessionSnapshot.version }).unwrap();
      } else {
        updated = await addSharedItem({ id: sessionSnapshot.id, businessId: Number(businessId), menuId, quantity, note: payload.item.note || "", modifiers: payload.item.modifiers || [], expectedVersion: sessionSnapshot.version }).unwrap();
      }
      setSessionSnapshot(updated);
      setFeedback({ open: true, message: quantity > 0 ? `Actualizamos el pedido de ${updated.self.name || sharedTargetName}.` : "Producto retirado de tu pedido compartido.", severity: "success" });
      return updated;
    } catch (requestError) {
      setFeedback({ open: true, message: sharedOrderError(requestError, "No se pudo actualizar tu selección"), severity: "error" });
      throw requestError;
    } finally {
      setBusyMenuId(null);
    }
  };

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
      {sharedTarget && <Box sx={{ mx: 1, mb: 1.25, px: 1.4, py: 1, borderRadius: 2, bgcolor: "rgba(255,75,69,.07)", border: "1px solid rgba(255,75,69,.15)" }}><Typography variant="caption" color="primary.dark" fontWeight={800}>Los productos se agregarán directamente al pedido de {sharedTargetName}.</Typography></Box>}
      <Swiper>
        {groups.map((items) => (
          <Swiper.Item key={items[0]?.id}>
            {items.map((item) => {
              const sharedItem = sharedTarget ? findOwnSharedItem(item.id) : null;
              return <CardMenuList
                key={`${item.id}-${sharedTarget ? sharedItem?.version || "new" : "individual"}`}
                item={item}
                businessId={businessId}
                businessName={businessName}
                paymentMethods={paymentMethods}
                onAddToCart={handleProductChange}
                initialQuantity={Number(sharedItem?.quantity || 0)}
                initialConfiguration={sharedItem ? { modifiers: sharedItem.modifiers, note: sharedItem.note, price: sharedItem.unitPrice, basePrice: item.price, version: sharedItem.version } : null}
                busy={Number(busyMenuId) === Number(item.id)}
                targetLabel={sharedTarget ? sharedTargetName : ""}
              />;
            })}
          </Swiper.Item>
        ))}
      </Swiper>
      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity={feedback.severity} variant="filled" onClose={() => setFeedback((current) => ({ ...current, open: false }))}>{feedback.message}</Alert></Snackbar>
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

const movementProps = {
  flipped: PropTypes.bool,
  onMovement: PropTypes.func.isRequired,
};

CardPlaceLocation.propTypes = {
  ...movementProps,
  business: PropTypes.object.isRequired,
};

CardPlacePhotos.propTypes = {
  ...movementProps,
  business: PropTypes.object.isRequired,
};

CardPlaceMenu.propTypes = {
  ...movementProps,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  businessName: PropTypes.string,
  paymentMethods: PropTypes.array,
  menu: PropTypes.array,
};

CardPlaceReviews.propTypes = {
  ...movementProps,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
