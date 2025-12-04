import Stpper from "@Components/Stpper";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import { Stack } from "@mui/material";

const CardMenuList = () => {
  const handleCountChange = (value) => {
    console.log("Nuevo valor:", value);
  };
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: "100%",
        padding: "5px 2px",
        alignItems:"center",
        mb: 0.5,
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
      }}
    >
      <AspectRatio
        ratio="1"
        sx={{
          width: 90,
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
          srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent>
        <Typography level="title-md" id="card-description">
          Torta especial
        </Typography>
        <Typography
          sx={{ fontSize: "11px", mb: "3px" }}
          aria-describedby="card-description"
        >
          Salchicha con jamon queso amarillo, cotagge y peperonni
        </Typography>
        <Stack direction="row" spacing={2} alignItems={"center"} >
          <Chip
            variant="outlined"
            color="success"
            size="sm"
            sx={{
              pointerEvents: "none",
              minHeight: "0px",
              height: "23px",
              fontSize: "13px",
            }}
            startDecorator={"$"}
          >
            250.00
          </Chip>
          
          <Stpper initial={0} onChange={handleCountChange} />
      
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CardMenuList;
