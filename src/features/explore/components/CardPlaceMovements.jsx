import { Swiper } from "antd-mobile";
import { Avatar, List } from "antd";
import { Box, Typography } from "@mui/material";
import CardPlaceBack from "./CardPlaceBack";
import MemoriesPhotos from "./MemoriesPhotos";
import CardMenuList from "@Features/menu/components/CardMenuList";
import { separateByGroups } from "@Shared/utils/commons";
import useCart from "@Features/cart/context/CartContext";

export const CardPlaceLocation = ({ flipped, onMovement }) => (
  <CardPlaceBack flipped={flipped} onMovement={onMovement}>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.9365039125723!2d-99.61316002468963!3d19.285127281962982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cd8a40b51a21a7%3A0x530047adce4171e3!2sTacos%20El%20Pariente!5e0!3m2!1ses!2smx!4v1693958860077!5m2!1ses!2smx"
      width="100%"
      height="200"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </CardPlaceBack>
);

export const CardPlacePhotos = ({ flipped, onMovement }) => {
  const imgs = [
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/448976/berlin.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/448976/london.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/448976/los-angeles.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/448976/italy.jpg",
  ];
  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      <MemoriesPhotos imgs={imgs} />
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

export const CardPlaceReviews = ({ flipped, onMovement }) => {
  const data = Array.from({ length: 23 }).map((_, i) => ({
    title: `Usuario ${i + 1}`,
    avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    content: "Excelente lugar, la comida está deliciosa y el servicio es muy bueno. Totalmente recomendado para pasar un buen rato con familia o amigos.",
  }));

  return (
    <CardPlaceBack flipped={flipped} onMovement={onMovement}>
      <List
        itemLayout="vertical"
        size="default"
        pagination={{ position: "bottom", align: "center", responsive: true, pageSize: 2 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item.title} style={{ fontSize: "11.5px" }}>
            <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item.title} />
            {item.content}
          </List.Item>
        )}
      />
    </CardPlaceBack>
  );
};
