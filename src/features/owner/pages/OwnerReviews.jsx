import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  useGetReviewSummaryQuery,
  useGetReviewsByBusinessQuery,
  useRespondToReviewMutation,
} from "@Features/reviews/api/reviews.api";
import { normalizeReviews } from "@Features/reviews/model/review";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";
const categoryLabel = { food: "Comida", time: "Tiempo", presentation: "Presentación", accuracy: "Exactitud" };

export default function OwnerReviews({ businessId }) {
  const reviewsQuery = useGetReviewsByBusinessQuery({ businessId }, { skip: !businessId });
  const summaryQuery = useGetReviewSummaryQuery({ businessId }, { skip: !businessId });
  const [respond, respondState] = useRespondToReviewMutation();
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState(null);

  const reviews = useMemo(
    () => normalizeReviews(reviewsQuery.data?.data || reviewsQuery.data || []),
    [reviewsQuery.data],
  );
  const summary = summaryQuery.data?.data || summaryQuery.data || {};

  const submitResponse = async (review) => {
    const response = String(drafts[review.id] || "").trim();
    if (!response) return;
    try {
      setFeedback(null);
      await respond({ businessId, reviewId: review.id, response }).unwrap();
      setDrafts((current) => ({ ...current, [review.id]: "" }));
      setFeedback({ severity: "success", message: "Respuesta publicada correctamente." });
      await reviewsQuery.refetch();
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  if (reviewsQuery.isLoading || summaryQuery.isLoading) {
    return <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (reviewsQuery.error || summaryQuery.error) {
    return <Alert severity="error">{errorMessage(reviewsQuery.error || summaryQuery.error)}</Alert>;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Reseñas</Typography>
        <Typography variant="body2" color="text.secondary">Escucha a tus clientes y responde públicamente. Recibir y responder reseñas es parte de la operación core.</Typography>
      </Box>

      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0,1fr))" }, gap: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">CALIFICACIÓN</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4" fontWeight={700}>{summary.averageRating ?? "—"}</Typography>
              {summary.averageRating && <Rating value={Number(summary.averageRating)} precision={0.1} readOnly />}
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">RESEÑAS</Typography>
            <Typography variant="h4" fontWeight={700}>{summary.reviewCount || 0}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">COMPRAS VERIFICADAS</Typography>
            <Typography variant="h4" fontWeight={700}>{summary.verifiedCount || 0}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,minmax(0,1fr))" }, gap: 1.5, mt: 2.5 }}>
          {Object.entries(summary.categoryRatings || {}).map(([key, value]) => (
            <Box key={key} sx={{ p: 1.5, bgcolor: "grey.50", borderRadius: 1.5 }}>
              <Typography variant="caption" color="text.secondary">{categoryLabel[key] || key}</Typography>
              <Typography variant="subtitle1" fontWeight={700}>{value ?? "—"}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {!reviews.length ? (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6">Aún no hay reseñas</Typography>
          <Typography variant="body2" color="text.secondary">Cuando una orden completada sea calificada, aparecerá aquí.</Typography>
        </Paper>
      ) : reviews.map((review) => (
        <Paper key={review.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" gap={2} alignItems="flex-start">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={review.avatar || undefined}>{review.userName?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>{review.userName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dateLabel(review.createdAt)}{review.verifiedOrder ? " · Compra verificada" : ""}
                  </Typography>
                </Box>
              </Stack>
              <Rating value={review.rating} readOnly size="small" />
            </Stack>

            {review.comment && <Typography variant="body2">{review.comment}</Typography>}

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {Object.entries(review.categoryRatings || {}).map(([key, value]) => value ? (
                <Stack key={key} direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="text.secondary">{categoryLabel[key] || key}</Typography>
                  <Rating value={value} readOnly size="small" />
                </Stack>
              ) : null)}
            </Stack>

            {review.ownerResponse?.text ? (
              <Box sx={{ p: 1.75, bgcolor: "grey.50", borderLeft: "3px solid", borderColor: "primary.main" }}>
                <Typography variant="caption" fontWeight={700}>Tu respuesta pública</Typography>
                <Typography variant="body2">{review.ownerResponse.text}</Typography>
                <Typography variant="caption" color="text.secondary">{dateLabel(review.ownerResponse.respondedAt)}</Typography>
              </Box>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "flex-end" }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Responder a esta reseña"
                  value={drafts[review.id] || ""}
                  onChange={(event) => setDrafts((current) => ({ ...current, [review.id]: event.target.value }))}
                  inputProps={{ maxLength: 1000 }}
                />
                <Button
                  variant="outlined"
                  disabled={respondState.isLoading || !String(drafts[review.id] || "").trim()}
                  onClick={() => submitResponse(review)}
                >
                  Responder
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

OwnerReviews.propTypes = {
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
