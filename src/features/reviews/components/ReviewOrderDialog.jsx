import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateVerifiedReviewMutation,
  useGetReviewByOrderQuery,
} from "../api/reviews.api";

const CATEGORY_FIELDS = [
  ["foodRating", "Comida"],
  ["timeRating", "Tiempo"],
  ["presentationRating", "Presentación"],
  ["accuracyRating", "Exactitud del pedido"],
];

const errorMessage = (error) =>
  error?.data?.message || error?.message || "No fue posible publicar la reseña";

export default function ReviewOrderDialog({ open, order, onClose }) {
  const orderId = order?.id;
  const reviewQuery = useGetReviewByOrderQuery({ orderId }, { skip: !open || !orderId });
  const [createReview, createState] = useCreateVerifiedReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!open) return;
    setRating(0);
    setComment("");
    setCategories({});
    setFeedback(null);
  }, [open, orderId]);

  const eligibility = reviewQuery.data;
  const existing = eligibility?.review;

  const submit = async () => {
    if (!rating) {
      setFeedback({ severity: "warning", message: "Selecciona una calificación general." });
      return;
    }

    try {
      setFeedback(null);
      await createReview({
        orderId,
        rating,
        comment: comment.trim() || undefined,
        ...Object.fromEntries(
          Object.entries(categories).filter(([, value]) => Number(value) > 0),
        ),
      }).unwrap();
      setFeedback({ severity: "success", message: "Gracias. Tu reseña quedó publicada como compra verificada." });
      await reviewQuery.refetch();
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const categoryValue = (value) => (value == null ? 0 : Number(value));

  return (
    <Dialog open={open} onClose={createState.isLoading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Calificar experiencia · {order?.businessName || "Negocio"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          {reviewQuery.isError && <Alert severity="error">{errorMessage(reviewQuery.error)}</Alert>}
          {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}

          {existing ? (
            <>
              <Alert severity="success" variant="outlined">Compra verificada · Orden #{orderId}</Alert>
              <Box>
                <Typography variant="body2" fontWeight={700}>Tu calificación</Typography>
                <Rating value={Number(existing.rating || 0)} readOnly />
                {existing.comment && <Typography variant="body2" sx={{ mt: 1 }}>{existing.comment}</Typography>}
              </Box>
              {existing.categoryRatings && (
                <Stack spacing={1}>
                  {CATEGORY_FIELDS.map(([key, label]) => {
                    const apiKey = key.replace("Rating", "");
                    const value = existing.categoryRatings[apiKey];
                    if (!value) return null;
                    return (
                      <Stack key={key} direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                        <Rating value={Number(value)} size="small" readOnly />
                      </Stack>
                    );
                  })}
                </Stack>
              )}
              {existing.ownerResponse && (
                <Alert severity="info" icon={false}>
                  <Typography variant="caption" fontWeight={700}>Respuesta del negocio</Typography>
                  <Typography variant="body2">{existing.ownerResponse.text}</Typography>
                </Alert>
              )}
            </>
          ) : eligibility && !eligibility.eligible ? (
            <Alert severity="info">Podrás calificar cuando la orden esté completada.</Alert>
          ) : (
            <>
              <Box>
                <Typography variant="body2" fontWeight={700}>Calificación general *</Typography>
                <Rating value={rating} onChange={(_event, value) => setRating(value || 0)} size="large" />
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Detalles opcionales</Typography>
                <Typography variant="caption" color="text.secondary">Ayudan al negocio a entender dónde mejorar sin hacer más pesado el proceso.</Typography>
              </Box>
              <Stack spacing={1.25}>
                {CATEGORY_FIELDS.map(([key, label]) => (
                  <Stack key={key} direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                    <Typography variant="body2">{label}</Typography>
                    <Rating
                      value={categoryValue(categories[key])}
                      size="small"
                      onChange={(_event, value) => setCategories((current) => ({ ...current, [key]: value || 0 }))}
                    />
                  </Stack>
                ))}
              </Stack>
              <TextField
                label="Comentario (opcional)"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                multiline
                minRows={3}
                inputProps={{ maxLength: 1000 }}
                helperText={`${comment.length}/1000`}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={createState.isLoading}>Cerrar</Button>
        {!existing && eligibility?.eligible && (
          <Button variant="contained" onClick={submit} disabled={createState.isLoading || !rating}>
            {createState.isLoading ? "Publicando…" : "Publicar reseña"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ReviewOrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
