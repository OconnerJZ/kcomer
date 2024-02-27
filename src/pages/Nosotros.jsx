import GeneralContent from "@Components/layout/GeneralContent";
import { Box } from "@mui/material";

const Nosotros = () => {
  return (
    <GeneralContent>
      <Box component="article" sx={{ margin: "5%", textAlign:"justify" }}>
        <h1>Nosotros</h1>

        <hr />

        <p style={{ fontSize: "18px" }}>
          Bienvenido a kComer, tu destino para descubrir y disfrutar de una
          amplia variedad de experiencias culinarias excepcionales.
        </p>
        <br />
        <p style={{ fontSize: "18px" }}>
          Nuestra Misión en kComer, nos apasiona conectar a los amantes de la
          comida con los mejores establecimientos gastronómicos. Nuestra misión
          es proporcionar una plataforma intuitiva y versátil que permita a los
          usuarios explorar, descubrir y compartir sus experiencias culinarias
          en una comunidad vibrante.
        </p>
        <br />
        <p style={{ fontSize: "18px" }}> ¿Qué Ofrecemos? </p>
        <br />
        <p style={{ fontSize: "18px" }}>
          <ol style={{listStyle: "square"}}>
            <li>
              <b>Exploración Sin Límites: </b> Descubre una diversidad de
              restaurantes, cafés, y lugares de comida de todo tipo, ya sea que
              busques cocina local, platos internacionales o experiencias
              gastronómicas únicas.
            </li>
            <li>
              <b>Interacción y Comunidad: </b> Comparte tus opiniones, reseñas y
              recomendaciones, y conecta con otros entusiastas de la comida.
            </li>
            <li>
              <b>Facilidad y Comodidad: </b> Explora menús, conoce horarios,
              reserva mesas y ordena comida desde la comodidad de tu hogar.
            </li>
          </ol>
        </p>
        <br />
        <p style={{ fontSize: "18px" }}>¿Cómo Funciona? </p>
        <br />
        <p style={{ fontSize: "18px" }}>
          En kComer, hemos creado una plataforma multifacética que ofrece
          múltiples servicios para hacer tu experiencia culinaria más
          placentera:
          <ol style={{listStyle: "square"}}>
            <li>
              <b>Exploración de Negocios: </b> Descubre una amplia gama de
              negocios de comida, desde restaurantes familiares hasta lugares
              especializados en cocinas específicas.
            </li>
            <li>
              <b>Exploración de Menús: </b> Explora los menús detallados con
              fotos y precios, y ordena tus platos favoritos.
            </li>
            <li>
              <b>Reseñas y Recomendaciones: </b> Comparte tus experiencias, vota
              por tus lugares favoritos y encuentra las recomendaciones de otros
              usuarios.
            </li>
            <li>
              <b>Reservas y Pedidos: </b> Reserva una mesa o realiza pedidos
              para llevar, todo desde una plataforma conveniente.
            </li>
          </ol>
        </p>
        <br />
        <p style={{ fontSize: "18px" }}>
          Nuestro Compromiso En kComer, estamos comprometidos a ofrecer una
          experiencia excepcional, garantizando la calidad, la autenticidad y la
          conveniencia en cada interacción. Valoramos tus opiniones y trabajamos
          continuamente para mejorar y enriquecer tu experiencia culinaria.
          <br />
          ¡Únete a kComer y sumérgete en el emocionante mundo de la comida!
        </p>
      </Box>
    </GeneralContent>
  );
};

export default Nosotros;
