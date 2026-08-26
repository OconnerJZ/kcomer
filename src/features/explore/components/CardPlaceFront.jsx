import { Box, Chip, Stack, IconButton, Tooltip, Typography } from "@mui/material";
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
              sx={{ borderRadius: 999, fontSize: ".7rem", bgcolor: "rgba(255,255,255,.52)", backdropFilter: "blur(8px)" }}
            />
          ))}
        </Stack>
      </Box>
    )}

    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        my: 2.1,
        px: 0.5,
      }}
    >
      {ACTIONS.map((action) => (
        <Tooltip key={action.key} title={action.label} arrow>
          <Stack spacing={0.65} alignItems="center" sx={{ minWidth: 56 }}>
            <IconButton
              onClick={() => onMovement({ movement: action.key })}
              aria-label={action.label}
              sx={{
                width: 42,
                height: 42,
                color: "text.primary",
                bgcolor: "rgba(255,255,255,.68)",
                border: "1px solid rgba(0,0,0,.07)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 5px 14px rgba(0,0,0,.045)",
                "&:hover": {
                  bgcolor: "common.white",
                  color: "primary.main",
                  transform: "translateY(-2px) scale(1.03)",
                  boxShadow: "0 9px 22px rgba(0,0,0,.08)",
                },
                transition: "all .18s ease",
              }}
            >
              {action.icon}
            </IconButton>
            <Typography variant="caption" sx={{ fontSize: ".68rem", fontWeight: 700, color: "text.secondary" }}>
              {action.label}
            </Typography>
          </Stack>
        </Tooltip>
      ))}
    </Stack>

    <CardPlaceAccordion data={data} />
  </StyledFront>
);

export default CardPlaceFront;
