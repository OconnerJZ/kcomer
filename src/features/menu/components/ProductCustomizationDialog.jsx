import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const buildInitialSelection = (groups = []) => {
  const selected = new Map();
  groups.forEach((group) => {
    (group.choices || []).forEach((choice) => {
      if (choice.defaultSelected) selected.set(Number(choice.id), true);
    });
  });
  return selected;
};

const resolveStatePayload = (groups, selected) => {
  const modifiers = [];
  const summary = [];
  let extra = 0;

  groups.forEach((group) => {
    (group.choices || []).forEach((choice) => {
      const choiceId = Number(choice.id);
      const isSelected = Boolean(selected.get(choiceId));
      const wasDefault = Boolean(choice.defaultSelected);

      if (isSelected) {
        modifiers.push({ choiceId, state: "selected" });
        extra += Number(choice.priceExtra || 0);
        summary.push({
          group: group.title,
          name: choice.name,
          state: "selected",
          priceExtra: Number(choice.priceExtra || 0),
        });
      } else if (wasDefault) {
        modifiers.push({ choiceId, state: "removed" });
        summary.push({
          group: group.title,
          name: choice.name,
          state: "removed",
          priceExtra: 0,
        });
      }
    });
  });

  return { modifiers, summary, extra: Number(extra.toFixed(2)) };
};

export default function ProductCustomizationDialog({ open, item, onClose, onConfirm }) {
  const groups = item?.modifierGroups || [];
  const [selected, setSelected] = useState(() => buildInitialSelection(groups));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelected(buildInitialSelection(groups));
    setNote(item?.note || "");
    setError("");
  }, [open, item?.id]);

  const preview = useMemo(() => resolveStatePayload(groups, selected), [groups, selected]);
  const finalPrice = Number(item?.price || 0) + preview.extra;

  const toggleChoice = (group, choice) => {
    setError("");
    setSelected((current) => {
      const next = new Map(current);
      const choiceId = Number(choice.id);
      const isSingle = group.selectionType === "single" || Number(group.maxSelect || 0) === 1;

      if (isSingle) {
        (group.choices || []).forEach((candidate) => next.delete(Number(candidate.id)));
        next.set(choiceId, true);
        return next;
      }

      if (next.get(choiceId)) next.delete(choiceId);
      else next.set(choiceId, true);
      return next;
    });
  };

  const validate = () => {
    for (const group of groups) {
      const count = (group.choices || []).filter((choice) => selected.get(Number(choice.id))).length;
      const min = Number(group.minSelect || 0);
      const configuredMax = Number(group.maxSelect || 0);
      const max = configuredMax > 0 ? configuredMax : Number.POSITIVE_INFINITY;
      if (count < min) return `${group.title}: selecciona al menos ${min}`;
      if (count > max) return `${group.title}: selecciona máximo ${max}`;
    }
    return "";
  };

  const handleConfirm = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    onConfirm({
      modifiers: preview.modifiers,
      modifierSummary: preview.summary,
      note: note.trim(),
      price: finalPrice,
      basePrice: Number(item?.price || 0),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="overline" color="primary" fontWeight={800}>PERSONALIZA TU PEDIDO</Typography>
        <Typography variant="h5" fontWeight={900}>{item?.name}</Typography>
        <Typography variant="body2" color="text.secondary">Elige exactamente cómo lo quieres.</Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Stack spacing={2.5}>
          {groups.map((group) => {
            const single = group.selectionType === "single" || Number(group.maxSelect || 0) === 1;
            return (
              <Box key={group.id || group.title}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Box>
                    <Typography fontWeight={850}>{group.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {group.required ? "Selección requerida" : "Opcional"}
                      {group.maxSelect > 1 ? ` · Hasta ${group.maxSelect}` : ""}
                    </Typography>
                  </Box>
                  {group.required && <Chip label="Requerido" size="small" color="primary" variant="outlined" />}
                </Stack>

                <Stack spacing={0.3}>
                  {(group.choices || []).map((choice) => {
                    const checked = Boolean(selected.get(Number(choice.id)));
                    return (
                      <FormControlLabel
                        key={choice.id}
                        control={single
                          ? <Radio checked={checked} onChange={() => toggleChoice(group, choice)} />
                          : <Checkbox checked={checked} onChange={() => toggleChoice(group, choice)} />}
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{choice.name}</Typography>
                            {Number(choice.priceExtra || 0) > 0 && (
                              <Typography variant="caption" color="primary.main" fontWeight={800}>+${Number(choice.priceExtra).toFixed(2)}</Typography>
                            )}
                          </Stack>
                        }
                        sx={{ width: "100%", m: 0, py: .25 }}
                      />
                    );
                  })}
                </Stack>
                <Divider sx={{ mt: 1.5 }} />
              </Box>
            );
          })}

          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>Indicaciones especiales</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ej. Salsa aparte…"
              inputProps={{ maxLength: 120 }}
              helperText={`${note.length}/120`}
            />
          </Box>

          {error && <Typography variant="body2" color="error.main" fontWeight={700}>{error}</Typography>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancelar</Button>
        <Button variant="contained" disableElevation onClick={handleConfirm} sx={{ textTransform: "none", borderRadius: 999, px: 2.5 }}>
          Agregar · ${finalPrice.toFixed(2)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
