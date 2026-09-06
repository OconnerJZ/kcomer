import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  InsightsRounded,
  RateReviewRounded,
  ReplyRounded,
  StarRounded,
  TrendingDownRounded,
  TrendingUpRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { useGetReputationInsightsQuery } from "../api/reviews.api";

const PERIOD_LABELS = {
  30: "30 días",
  90: "90 días",
  365: "1 año",
  730: "2 años",
};

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible cargar Reputation Insights";

const alertIcon = (type) => {
  if (type === "positive") return <TrendingUpRounded fontSize="small" />;
  if (type === "warning") return <WarningAmberRounded fontSize="small" />;
  return <InsightsRounded fontSize="small" />;
};

const alertSeverity = (type) => {
  if (type === "positive") return "success";
  if (type === "warning") return "warning";
  return "info";
};

const metric = (label, value, helper, icon) => (
  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: "8px" }}>
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
        {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
      </Box>
      <Box sx={{ color: "text.secondary" }}>{icon}</Box>
    </Stack>
  </Paper>
);

export default function ReputationInsightsPanel({ businessId }) {
  const [period, setPeriod] = useState(90);
  const query = useGetReputationInsightsQuery({ businessId, period }, { skip: !businessId });
  const data = query.data?.data || query.data;
  const availablePeriods = useMemo(() => data?.period?.availablePeriods || [], [data]);

  useEffect(() => {
    if (availablePeriods.length && !availablePeriods.includes(period)) {
      setPeriod(availablePeriods[availablePeriods.length - 1]);
    }
  }, [availablePeriods, period]);

  if (query.isLoading) {
    return <Paper variant="outlined" sx={{ p: 3, borderRadius: "8px", display: "grid", placeItems: "center", minHeight: 180 }}><CircularProgress size={28} /></Paper>;
  }

  if (query.error?.status === 403) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "8px" }}>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} alignItems={{ sm: "center" }} justifyContent="space-between">
          <Box>
            <Stack direction="row" gap={1} alignItems="center">
              <InsightsRounded color="action" />
              <Typography variant="h6" fontWeight={700}>Reputation Intelligence</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .6 }}>
              Las reseñas, respuestas y promedio público siguen disponibles en todos los planes. Nivel 1+ agrega tendencias, distribución y señales accionables.
            </Typography>
          </Box>
          <Chip label="Disponible desde Nivel 1" variant="outlined" />
        </Stack>
      </Paper>
    );
  }

  if (query.error) return <Alert severity="error">{errorMessage(query.error)}</Alert>;
  if (!data) return null;

  const overview = data.overview || {};
  const delta = Number(overview.ratingDelta || 0);
  const trend = data.trend || [];
  const latestTrend = trend.slice(-14);

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: { xs: 2.2, sm: 2.6 }, borderRadius: "8px", bgcolor: "#34312D", color: "white" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }}>
          <Box>
            <Stack direction="row" gap={1} alignItems="center">
              <InsightsRounded sx={{ color: "#D9877F" }} />
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,.62)" }}>REPUTATION INTELLIGENCE</Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700}>Qué está cambiando en tu reputación</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,.68)", mt: .5 }}>
              Señales calculadas con reseñas verificadas y categorías; sin análisis de sentimiento automático por ahora.
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 145 }}>
            <Select
              value={period}
              onChange={(event) => setPeriod(Number(event.target.value))}
              sx={{ color: "white", bgcolor: "rgba(255,255,255,.08)", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,.18)" }, ".MuiSvgIcon-root": { color: "white" } }}
            >
              {availablePeriods.map((days) => <MenuItem key={days} value={days}>{PERIOD_LABELS[days] || `${days} días`}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {data.message && <Alert severity="info" variant="outlined">{data.message}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" }, gap: 1.25 }}>
        {metric("Promedio del periodo", overview.averageRating ?? "—", delta ? `${delta > 0 ? "+" : ""}${delta.toFixed(2)} vs. periodo anterior` : "Sin cambio comparable", delta < 0 ? <TrendingDownRounded /> : <StarRounded />)}
        {metric("Tasa de respuesta", `${overview.responseRate ?? 0}%`, `${overview.unansweredCount || 0} sin responder`, <ReplyRounded />)}
        {metric("Reseñas bajas", overview.lowRatingCount || 0, `${overview.lowRatingShare || 0}% son 1–2 estrellas`, <WarningAmberRounded />)}
        {metric("Muestra", data.sample?.reviewCount || 0, data.sample?.sufficientForTrends ? "Suficiente para tendencias básicas" : `Recomendamos al menos ${data.sample?.minimumRecommended || 5}`, <RateReviewRounded />)}
      </Box>

      {!!data.alerts?.length && (
        <Stack spacing={1}>
          {data.alerts.map((item) => (
            <Alert key={item.key} severity={alertSeverity(item.type)} icon={alertIcon(item.type)} variant="outlined">
              <Typography variant="body2" fontWeight={700}>{item.title}</Typography>
              <Typography variant="caption">{item.detail}</Typography>
            </Alert>
          ))}
        </Stack>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
        <Paper variant="outlined" sx={{ p: 2.2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={700}>Distribución de estrellas</Typography>
          <Stack spacing={1.2} sx={{ mt: 1.5 }}>
            {(data.distribution || []).map((row) => (
              <Stack key={row.rating} direction="row" alignItems="center" gap={1}>
                <Typography variant="caption" sx={{ width: 28 }}>{row.rating}★</Typography>
                <LinearProgress variant="determinate" value={row.percentage || 0} sx={{ flex: 1, height: 7, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary" sx={{ width: 64, textAlign: "right" }}>{row.total} · {row.percentage}%</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={700}>Categorías</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 1, mt: 1.5 }}>
            {(data.categoryRatings || []).map((category) => (
              <Box key={category.key} sx={{ p: 1.4, bgcolor: "grey.50", borderRadius: "8px" }}>
                <Typography variant="caption" color="text.secondary">{category.label}</Typography>
                <Typography variant="h6" fontWeight={700}>{category.average ?? "—"}</Typography>
                <Typography variant="caption" color="text.secondary">{category.count} evaluaciones</Typography>
              </Box>
            ))}
          </Box>
          {data.weakestCategory && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>Categoría más débil con muestra suficiente: {data.weakestCategory.label} ({data.weakestCategory.average}).</Typography>}
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ p: 2.2, borderRadius: "8px" }}>
        <Typography variant="subtitle1" fontWeight={700}>Tendencia reciente</Typography>
        <Typography variant="caption" color="text.secondary">Últimos días con reseñas dentro del periodo seleccionado.</Typography>
        {!latestTrend.length ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Todavía no hay puntos de tendencia.</Typography>
        ) : (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {latestTrend.map((point) => (
              <Stack key={point.date} direction="row" gap={1} alignItems="center">
                <Typography variant="caption" sx={{ width: 82 }}>{new Date(`${point.date}T12:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</Typography>
                <Box sx={{ flex: 1, height: 7, bgcolor: "grey.100", borderRadius: 4, overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${Math.max(0, Math.min(100, Number(point.averageRating || 0) * 20))}%`, bgcolor: "primary.main" }} />
                </Box>
                <Typography variant="caption" sx={{ width: 90, textAlign: "right" }}>{point.averageRating ?? "—"} · {point.reviewCount}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

ReputationInsightsPanel.propTypes = {
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
