import { Box, Chip, Stack, Button, Tooltip } from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MenuBook from "@mui/icons-material/MenuBook";
import LocationOn from "@mui/icons-material/LocationOn";
import Reviews from "@mui/icons-material/Reviews";
import CardPlaceAccordion from "./CardPlaceAccordion";
import { StyledFront } from "./CardPlaceStyled";

const ACTIONS = [
  { key: "menu", label: "Menú", icon: <MenuBook fontSize="small" /> },
  { key: "location", label: "Ubicación", icon: <LocationOn fontSize="small" /> },
  { key: "photo", label: "Fotos", icon: <PhotoLibraryIcon fontSize="small" /> },
  { key: "review", label: "Reseñas", icon: <Reviews fontSize="small" /> },
];

const CardPlaceFront = ({ flipped, onMovement, data }) => (
  <StyledFront flipped={flipped}>
    {(data?.tags || []).length > 0 && (
      <Box sx={{ width: "100%", overflowX: "auto", pb: 0.5, "::-webkit-scrollbar": { display: "none" } }}>
        <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content" }}>
          {(data.tags || []).map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 999, fontSize: ".72rem", bgcolor: "rgba(255,255,255,.7)" }}
            />
          ))}
        </Stack>
      </Box>
    )}

    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0.75,
        my: 2,
      }}
    >
      {ACTIONS.map((action) => (
        <Tooltip key={action.key} title={action.label} arrow>
          <Button
            onClick={() => onMovement({ movement: action.key })}
            startIcon={action.icon}
            sx={{
              minWidth: 0,
              px: 1,
              py: 1,
              borderRadius: 2,
              color: "text.primary",
              bgcolor: "rgba(255,255,255,.72)",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
              textTransform: "none",
              fontSize: ".75rem",
              fontWeight: 700,
              "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.5 } },
              "&:hover": {
                bgcolor: "background.paper",
                borderColor: "rgba(255, 75, 69, .35)",
                transform: "translateY(-1px)",
              },
              transition: "all .16s ease",
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{action.label}</Box>
          </Button>
        </Tooltip>
      ))}
    </Box>

    <CardPlaceAccordion data={data} />
  </StyledFront>
);

export default CardPlaceFront;
