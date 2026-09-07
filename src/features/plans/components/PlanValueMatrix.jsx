import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CheckRounded, RemoveRounded } from "@mui/icons-material";
import { buildPlanValueMatrix } from "../model/businessPlan";

const CATEGORY_LABELS = {
  reputation: "Reputación",
  growth: "Crecimiento",
  intelligence: "Inteligencia",
  advanced: "Avanzado",
};

const CATEGORY_ORDER = ["reputation", "growth", "intelligence", "advanced"];

export default function PlanValueMatrix({ catalog = [] }) {
  const rows = buildPlanValueMatrix(catalog);
  if (!rows.length) return null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: "8px", overflow: "hidden" }}>
      <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={600}>Matriz de valor comercial</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Esta matriz define la dirección de producto por nivel. Las capacidades marcadas como próximas no se consideran disponibles hasta que su módulo exista realmente.
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 280 }}>Capacidad</TableCell>
              {catalog.map((plan) => (
                <TableCell key={plan.code} align="center" sx={{ minWidth: 110 }}>
                  <Typography variant="caption" fontWeight={700}>{plan.name}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{plan.positioning}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {CATEGORY_ORDER.flatMap((category) => {
              const categoryRows = rows.filter((row) => row.category === category);
              if (!categoryRows.length) return [];

              return [
                <TableRow key={`category-${category}`}>
                  <TableCell colSpan={catalog.length + 1} sx={{ bgcolor: "grey.50", py: 1 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                      {CATEGORY_LABELS[category] || category}
                    </Typography>
                  </TableCell>
                </TableRow>,
                ...categoryRows.map((row) => (
                  <TableRow key={row.key} hover>
                    <TableCell>
                      <Stack spacing={0.35}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography variant="body2" fontWeight={600}>{row.label}</Typography>
                          {row.status === "coming_soon" && <Chip label="Próximamente" size="small" variant="outlined" />}
                          {row.commercialModel === "separate_product" && <Chip label="Producto separado" size="small" variant="outlined" />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{row.description}</Typography>
                      </Stack>
                    </TableCell>
                    {catalog.map((plan) => (
                      <TableCell key={`${row.key}-${plan.code}`} align="center">
                        {row.plans[plan.code]
                          ? <CheckRounded fontSize="small" aria-label={`Incluido en ${plan.name}`} />
                          : <RemoveRounded fontSize="small" color="disabled" aria-label={`No incluido en ${plan.name}`} />}
                      </TableCell>
                    ))}
                  </TableRow>
                )),
              ];
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

PlanValueMatrix.propTypes = {
  catalog: PropTypes.arrayOf(PropTypes.object),
};
