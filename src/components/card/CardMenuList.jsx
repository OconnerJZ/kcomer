import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";

const CardMenuList = () => {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: "100%",
        padding: "5px 2px",
        mb:0.5,
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 70, borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
        <img
          src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
          srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent>
        <Typography level="title-sm" id="card-description">
          Torta especial
        </Typography>
        <Typography
          sx={{ fontSize: "10px", mb: "3px" }}
          aria-describedby="card-description"
        >
          Salchicha con jamon queso amarillo, cotagge y peperonni
        </Typography>
        <Chip
          variant="outlined"
          color="success"
          size="sm"
          sx={{ pointerEvents: "none", minHeight:"0px" , height: "18px", fontSize:"11px"  }}
          startDecorator={"MXN $"}
        >
          250.00
        </Chip>
      </CardContent>
    </Card>
  );
};

export default CardMenuList;
