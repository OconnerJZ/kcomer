import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Check, Delete, PhotoLibrary } from "@mui/icons-material";

const getPhotoUrl = (photo) =>
  typeof photo === "string"
    ? photo
    : photo?.url || photo?.photoUrl || photo?.photo_url || photo?.image || photo?.imageUrl || "";

export default function GalleryTab({
  photos = [],
  coverImage = "",
  onSetCover,
  onUpload,
  onDelete,
  loading,
}) {
  const effectiveCover = coverImage || getPhotoUrl(photos[0]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,.88)",
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>
            IMAGEN
          </Typography>
          <Typography variant="h6" fontWeight={800}>Galería y portada</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Elige qué fotografía representa tu negocio en Explore y mantén una galería breve y atractiva.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={800} component="span">{photos.length}</Typography>
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: .75 }}>
              {photos.length === 1 ? "fotografía" : "fotografías"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: .4 }}>
              Recomendado: fotografías horizontales, luminosas y sin elementos de texto incrustado.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<Add />}
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: "10px", alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Agregar foto
            <input type="file" hidden accept="image/*" onChange={onUpload} />
          </Button>
        </Stack>

        {photos.length === 0 ? (
          <Box sx={{ py: 6, px: 2, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: "10px" }}>
            <PhotoLibrary sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={800}>Tu galería todavía está vacía</Typography>
            <Typography variant="caption" color="text.secondary">
              Agrega una fotografía para construir la presencia visual del negocio.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2 }}>
            {photos.map((photo, index) => {
              const url = getPhotoUrl(photo);
              const id = typeof photo === "object" ? photo.id ?? photo.photoId : index;
              const isCover = Boolean(url) && String(url) === String(effectiveCover);

              return (
                <Card
                  key={id ?? url}
                  elevation={0}
                  sx={{
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: isCover ? "rgba(49,94,251,.4)" : "divider",
                    bgcolor: "background.paper",
                    transition: "transform .16s ease, box-shadow .16s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(0,0,0,.07)" },
                  }}
                >
                  <Box sx={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", bgcolor: "grey.100" }}>
                    <CardMedia component="img" image={url} alt={`Foto ${index + 1} del negocio`} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {isCover && (
                      <Chip
                        icon={<Check sx={{ fontSize: "15px !important" }} />}
                        label="Portada"
                        size="small"
                        sx={{ position: "absolute", top: 10, left: 10, bgcolor: "rgba(255,255,255,.94)", fontWeight: 800, backdropFilter: "blur(8px)" }}
                      />
                    )}
                  </Box>

                  <CardActions sx={{ justifyContent: "space-between", gap: 1, px: 1.5, py: 1.1 }}>
                    <Box minWidth={0}>
                      <Typography variant="caption" fontWeight={700}>
                        {isCover ? "Imagen principal" : `Foto ${index + 1}`}
                      </Typography>
                      {isCover && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          Visible como portada en Explore
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {!isCover && (
                        <Button
                          size="small"
                          onClick={() => onSetCover?.(url)}
                          disabled={loading || !url}
                          sx={{ textTransform: "none", borderRadius: "10px", whiteSpace: "nowrap" }}
                        >
                          Usar como portada
                        </Button>
                      )}
                      <IconButton size="small" color="error" onClick={() => onDelete(id)} disabled={loading} aria-label="eliminar foto">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        )}

        {photos.length > 0 && !coverImage && (
          <Typography variant="caption" color="text.secondary">
            Mientras no elijas una portada manualmente, Kcomer utiliza la primera fotografía disponible.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

GalleryTab.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  coverImage: PropTypes.string,
  onSetCover: PropTypes.func,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
