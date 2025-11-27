import { Box, Chip, Stack } from "@mui/material";
import CardPlaceAccordion from "./CardPlaceAccordion";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MenuBook from "@mui/icons-material/MenuBook";
import LocationOn from "@mui/icons-material/LocationOn";
import Reviews from "@mui/icons-material/Reviews";
import { StyledFront } from "./CardPlaceStyled";

const CardPlaceFront = ({ flipped, onMovement, data }) => {
  const nameChips = data?.tags;
  return (
    <StyledFront flipped={flipped}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflow: "auto",
          width: "100%",
          scrollSnapType: "x mandatory",
          "& > *": {
            scrollSnapAlign: "center",
          },
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack direction="row" spacing={1}>
          {nameChips.map((chips) => (
            <Chip
              key={chips.label}
              label={chips.label}
              color={chips.color}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          mt: 2,
          justifyContent: "center",
          "& > button": { borderRadius: "2rem" },
        }}
      >
        <ButtonGroup
          aria-label="radius button group"
          sx={{ "--ButtonGroup-radius": "40px" }}
        >
          <Button onClick={() => onMovement({ movement: "menu" })}>
            <MenuBook sx={{ fontSize: "36px" }} />
          </Button>
          <Button onClick={() => onMovement({ movement: "location" })}>
            <LocationOn sx={{ fontSize: "36px" }} />
          </Button>
          <Button onClick={() => onMovement({ movement: "photo" })}>
            <PhotoLibraryIcon sx={{ fontSize: "36px" }} />
          </Button>
          <Button onClick={() => onMovement({ movement: "review" })}>
            <Reviews sx={{ fontSize: "36px" }} />
          </Button>
        </ButtonGroup>
      </Box>
      <CardPlaceAccordion data={data} />
    </StyledFront>
  );
};

export default CardPlaceFront;
