import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  DeleteOutline,
  RestaurantMenuRounded,
  LocalDiningRounded,
  TuneRounded,
} from "@mui/icons-material";
import {
  useGetMenuModifiersQuery,
  useUpdateMenuModifiersMutation,
} from "@Features/menu/api/menu.api";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";

const newChoice = (overrides = {}) => ({
  name: "",
  priceExtra: 0,
  defaultSelected: false,
  ...overrides,
});

const newGroup = (overrides = {}) => ({
  title: "",
  minSelect: 0,
  maxSelect: 0,
  choices: [newChoice()],
  ...overrides,
});

const TEMPLATES = [
  {
    key: "ingredients",
    label: "Ingredientes",
    helper: "Incluidos y removibles",
    icon: LocalDiningRounded,
    group: () => newGroup({
      title: "Ingredientes",
      minSelect: 0,
      maxSelect: 0,
      choices: [
        newChoice({ name: "Cebolla", defaultSelected: true }),
        newChoice({ name: "Jitomate", defaultSelected: true }),
        newChoice({ name: "Lechuga", defaultSelected: true }),
      ],
    }),
  },
  {
    key: "extras",
    label: "Extras",
    helper: "Opciones con costo",
    icon: Add,
    group: () => newGroup({
      title: "Extras",
      minSelect: 0,
      maxSelect: 3,
      choices: [
        newChoice({ name: "Extra queso", priceExtra: 20 }),
        newChoice({ name: "Extra tocino", priceExtra: 25 }),
      ],
    }),
  },
  {
    key: "single",
    label: "Elegir uno",
    helper: "Una opción requerida",
    icon: RestaurantMenuRounded,
    group: () => newGroup({
      title: "Elige una opción",
      minSelect: 1,
      maxSelect: 1,
      choices: [
        newChoice({ name: "Opción 1", defaultSelected: true }),
        newChoice({ name: "Opción 2" }),
      ],
    }),
  },
];

const normalizeGroups = (data) => {
  const groups = data?.data || data || [];
  return Array.isArray(groups)
    ? groups.map((group) => ({
        id: group.id,
        title: group.title || "",
        minSelect: Number(group.minSelect || 0),
        maxSelect: Number(group.maxSelect || 0),
        choices: (group.choices || []).map((choice) => ({
          id: choice.id,
          name: choice.name || "",
          priceExtra: Number(choice.priceExtra || 0),
          defaultSelected: Boolean(choice.defaultSelected),
        })),
      }))
    : [];
};

export default function MenuModifierManager({ menuId }) {
  const feedback = useFeedback();
  const { data, isLoading, isFetching } = useGetMenuModifiersQuery(menuId, { skip: !menuId });
  const [saveModifiers, { isLoading: saving }] = useUpdateMenuModifiersMutation();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!menuId) return;
    setGroups(normalizeGroups(data));
  }, [data, menuId]);

  const hasChanges = useMemo(
    () => JSON.stringify(groups) !== JSON.stringify(normalizeGroups(data)),
    [groups, data],
  );

  const updateGroup = (groupIndex, field, value) => {
    setGroups((current) => current.map((group, index) => {
      if (index !== groupIndex) return group;
      const next = { ...group, [field]: value };
      if (field === "maxSelect" && Number(value) === 1) {
        const firstDefault = next.choices.findIndex((choice) => choice.defaultSelected);
        next.choices = next.choices.map((choice, choiceIndex) => ({
          ...choice,
          defaultSelected: firstDefault === -1 ? choiceIndex === 0 : choiceIndex === firstDefault,
        }));
        if (Number(next.minSelect || 0) > 1) next.minSelect = 1;
      }
      return next;
    }));
  };

  const updateChoice = (groupIndex, choiceIndex, field, value) => {
    setGroups((current) => current.map((group, index) => {
      if (index !== groupIndex) return group;
      const choices = group.choices.map((choice, ci) =>
        ci === choiceIndex ? { ...choice, [field]: value } : choice,
      );
      return { ...group, choices };
    }));
  };

  const addChoice = (groupIndex) => {
    setGroups((current) => current.map((group, index) =>
      index === groupIndex ? { ...group, choices: [...group.choices, newChoice()] } : group,
    ));
  };

  const removeChoice = (groupIndex, choiceIndex) => {
    setGroups((current) => current.map((group, index) =>
      index === groupIndex
        ? { ...group, choices: group.choices.filter((_, ci) => ci !== choiceIndex) }
        : group,
    ));
  };

  const removeGroup = (groupIndex) =>
    setGroups((current) => current.filter((_, index) => index !== groupIndex));

  const handleDefault = (groupIndex, choiceIndex, checked) => {
    setGroups((current) => current.map((group, index) => {
      if (index !== groupIndex) return group;
      const single = Number(group.maxSelect || 0) === 1;
      return {
        ...group,
        choices: group.choices.map((choice, ci) => ({
          ...choice,
          defaultSelected:
            ci === choiceIndex ? checked : single && checked ? false : choice.defaultSelected,
        })),
      };
    }));
  };

  const addTemplate = (template) => {
    setGroups((current) => [...current, template.group()]);
  };

  const validate = () => {
    for (const group of groups) {
      if (!group.title.trim()) return "Cada grupo necesita un nombre";
      if (!group.choices.length) return `${group.title}: agrega al menos una opción`;
      if (group.choices.some((choice) => !choice.name.trim())) {
        return `${group.title}: hay opciones sin nombre`;
      }

      const min = Number(group.minSelect || 0);
      const max = Number(group.maxSelect || 0);
      const defaults = group.choices.filter((choice) => choice.defaultSelected).length;

      if (max > 0 && min > max) return `${group.title}: el mínimo no puede superar al máximo`;
      if (max > 0 && max > group.choices.length) {
        return `${group.title}: el máximo supera el número de opciones`;
      }
      if (max > 0 && defaults > max) {
        return `${group.title}: hay más opciones incluidas que el máximo permitido`;
      }
      if (max === 1 && defaults > 1) {
        return `${group.title}: solo una opción puede venir seleccionada`;
      }
    }
    return "";
  };

  const handleSave = async () => {
    const error = validate();
    if (error) return feedback.warning(error);
    try {
      await saveModifiers({ menuId, groups }).unwrap();
      feedback.success("Personalización actualizada");
    } catch (err) {
      feedback.error(
        err?.data?.message || err?.message || "No se pudo guardar la personalización",
      );
    }
  };

  if (!menuId) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 2.5 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TuneRounded color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={850}>Personalización</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Ingredientes removibles, extras y selecciones obligatorias.
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={() => setGroups((current) => [...current, newGroup()])}
          sx={{ textTransform: "none" }}
        >
          Grupo vacío
        </Button>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 1, mb: 2.5 }}>
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Button
              key={template.key}
              variant="outlined"
              onClick={() => addTemplate(template)}
              sx={{
                minHeight: 62,
                justifyContent: "flex-start",
                textAlign: "left",
                borderRadius: 3,
                textTransform: "none",
                px: 1.5,
              }}
            >
              <Icon sx={{ mr: 1.2, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" fontWeight={800}>{template.label}</Typography>
                <Typography variant="caption" color="text.secondary">{template.helper}</Typography>
              </Box>
            </Button>
          );
        })}
      </Box>

      {(isLoading || isFetching) && groups.length === 0 ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : groups.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 2.5, borderStyle: "dashed", borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="body2" fontWeight={700}>Este platillo todavía no tiene opciones.</Typography>
          <Typography variant="caption" color="text.secondary">
            Usa una plantilla o crea un grupo desde cero.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {groups.map((group, groupIndex) => {
            const single = Number(group.maxSelect || 0) === 1;
            return (
              <Paper
                key={group.id || `new-${groupIndex}`}
                variant="outlined"
                sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,.78)" }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <TextField
                    size="small"
                    label="Nombre del grupo"
                    value={group.title}
                    onChange={(e) => updateGroup(groupIndex, "title", e.target.value)}
                    fullWidth
                    placeholder="Ej. Ingredientes"
                  />
                  <IconButton color="error" size="small" onClick={() => removeGroup(groupIndex)}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: single ? "1fr 1fr" : "1fr 1fr 1fr" },
                    gap: 1.25,
                    mt: 1.5,
                  }}
                >
                  <TextField
                    select
                    size="small"
                    label="Tipo"
                    value={single ? "single" : "multiple"}
                    onChange={(e) =>
                      updateGroup(groupIndex, "maxSelect", e.target.value === "single" ? 1 : 0)
                    }
                  >
                    <MenuItem value="multiple">Selección múltiple</MenuItem>
                    <MenuItem value="single">Elegir una</MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    type="number"
                    label="Mínimo requerido"
                    value={group.minSelect}
                    inputProps={{ min: 0, max: single ? 1 : group.choices.length }}
                    onChange={(e) =>
                      updateGroup(groupIndex, "minSelect", Math.max(0, Number(e.target.value || 0)))
                    }
                  />

                  {!single && (
                    <TextField
                      size="small"
                      type="number"
                      label="Máximo permitido"
                      value={group.maxSelect || ""}
                      placeholder="Sin límite"
                      inputProps={{ min: 0, max: group.choices.length }}
                      helperText="Vacío o 0 = sin límite"
                      onChange={(e) =>
                        updateGroup(groupIndex, "maxSelect", Math.max(0, Number(e.target.value || 0)))
                      }
                    />
                  )}
                </Box>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {group.choices.map((choice, choiceIndex) => (
                    <Box
                      key={choice.id || `${groupIndex}-${choiceIndex}`}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "minmax(0,1fr) auto",
                          sm: "minmax(0,1fr) 130px auto auto",
                        },
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        label="Opción"
                        value={choice.name}
                        onChange={(e) => updateChoice(groupIndex, choiceIndex, "name", e.target.value)}
                        placeholder="Ej. Cebolla"
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Extra"
                        value={choice.priceExtra}
                        inputProps={{ min: 0, step: .5 }}
                        onChange={(e) =>
                          updateChoice(
                            groupIndex,
                            choiceIndex,
                            "priceExtra",
                            Math.max(0, Number(e.target.value || 0)),
                          )
                        }
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ display: { xs: "none", sm: "block" } }}
                      />
                      <Chip
                        size="small"
                        clickable
                        onClick={() =>
                          handleDefault(groupIndex, choiceIndex, !choice.defaultSelected)
                        }
                        icon={<Checkbox size="small" checked={choice.defaultSelected} />}
                        label={choice.defaultSelected ? "Incluido" : "Opcional"}
                        variant={choice.defaultSelected ? "filled" : "outlined"}
                        color={choice.defaultSelected ? "primary" : "default"}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        disabled={group.choices.length === 1}
                        onClick={() => removeChoice(groupIndex, choiceIndex)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => addChoice(groupIndex)}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    Agregar opción
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          disabled={!hasChanges || saving}
          onClick={handleSave}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {saving ? "Guardando…" : "Guardar personalización"}
        </Button>
      </Stack>
    </Box>
  );
}
