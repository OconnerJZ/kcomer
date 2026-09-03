import { useMemo, useState } from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { LocationOn, MapRounded, StickyNote2 } from "@mui/icons-material";

const buildMapUrl = (location, address) => {
  const query = location?.latitude && location?.longitude
    ? `${location.latitude},${location.longitude}`
    : address;
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : "";
};

const DeliveryInfo = ({ order }) => {
  const [view, setView] = useState("address");
  const deliveryAddress = order.address || order.deliveryAddress || "Recoger en tienda";
  const isDelivery = order.orderType === "delivery";
  const mapUrl = useMemo(() => buildMapUrl(order.deliveryLocation, deliveryAddress), [order.deliveryLocation, deliveryAddress]);

  return (
      <Box sx={{ height: "100%", border: "1px solid", borderColor: "divider", borderRadius: "10px", overflow: "hidden", bgcolor: "rgba(255,255,255,.72)" }}>
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".64rem" }}>ENTREGA</Typography>
          <Typography variant="subtitle1" fontWeight={850}>{isDelivery ? "Dirección del cliente" : "Recoger en tienda"}</Typography>
        </Box>

        {isDelivery && (
          <Box sx={{ display: "flex", gap: .5, mx: 2, mt: 1.5, p: .4, bgcolor: "action.hover", borderRadius: "10px" }}>
            {[{ key: "address", label: "Dirección", icon: LocationOn }, { key: "map", label: "Mapa", icon: MapRounded }].map(({ key, label, icon: Icon }) => (
              <ButtonBase key={key} onClick={() => setView(key)} sx={{ flex: 1, py: .8, borderRadius: "10px", bgcolor: view === key ? "background.paper" : "transparent", boxShadow: view === key ? "0 4px 12px rgba(0,0,0,.06)" : 0 }}>
                <Icon sx={{ fontSize: 16, mr: .6 }} />
                <Typography variant="caption" fontWeight={800}>{label}</Typography>
              </ButtonBase>
            ))}
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          {!isDelivery || view === "address" ? (
            <Stack direction="row" spacing={1.2} alignItems="flex-start">
              <LocationOn sx={{ fontSize: 19, color: "primary.main", mt: .2 }} />
              <Box>
                <Typography variant="body2" fontWeight={750} sx={{ lineHeight: 1.6 }}>{deliveryAddress}</Typography>
                {order.deliveryLocation?.city && <Typography variant="caption" color="text.secondary">{order.deliveryLocation.city}{order.deliveryLocation.postalCode ? ` · CP ${order.deliveryLocation.postalCode}` : ""}</Typography>}
              </Box>
            </Stack>
          ) : mapUrl ? (
            <Box sx={{ height: 230, borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
              <iframe src={mapUrl} title={`Ubicación de entrega de orden ${order.id}`} width="100%" height="100%" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </Box>
          ) : <Typography variant="body2" color="text.secondary">No hay coordenadas disponibles para esta orden.</Typography>}
        </Box>
        {order.notes && <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 2, bgcolor: "rgba(255,159,28,.06)" }}><Stack direction="row" spacing={1}><StickyNote2 sx={{ fontSize: 18, color: "secondary.dark" }} /><Box><Typography variant="caption" color="text.secondary" fontWeight={800}>NOTAS DEL CLIENTE</Typography><Typography variant="body2" sx={{ mt: .35 }}>{order.notes}</Typography></Box></Stack></Box>}
      </Box>
  );
};

export default DeliveryInfo;
