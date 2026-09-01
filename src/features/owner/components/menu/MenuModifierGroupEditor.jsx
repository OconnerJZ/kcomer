import PropTypes from "prop-types";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";

const choiceShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  priceExtra: PropTypes.number.isRequired,
  defaultSelected: PropTypes.bool.isRequired,
});

const MenuModifierGroupEditor = ({
  group,
  groupIndex,
  onUpdateGroup,
  onUpdateChoice,
  onAddChoice,
  onRemoveChoice,
  onRemoveGroup,
  onSetDefaultChoice,
}) => {
  const single = Number(group.maxSelect || 0) === 1;

  return (
    <Box
      sx={{
        py: 2,
        borderTop: groupIndex ? "1px solid" : "none",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          label="Nombre del grupo"
          value={group.title}
          onChange={(event) => onUpdateGroup(groupIndex, "title", event.target.value)}
          fullWidth
          placeholder="Ej. Ingredientes"
        />
        <IconButton
          color="error"
          size="small"
          aria-label={`Eliminar grupo ${group.title || groupIndex + 1}`}
          onClick={() => onRemoveGroup(groupIndex)}
        >
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
          onChange={(event) => onUpdateGroup(
            groupIndex,
            "maxSelect",
            event.target.value === "single" ? 1 : 0,
          )}
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
          onChange={(event) => onUpdateGroup(
            groupIndex,
            "minSelect",
            Math.max(0, Number(event.target.value || 0)),
          )}
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
            onChange={(event) => onUpdateGroup(
              groupIndex,
              "maxSelect",
              Math.max(0, Number(event.target.value || 0)),
            )}
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
              onChange={(event) => onUpdateChoice(
                groupIndex,
                choiceIndex,
                "name",
                event.target.value,
              )}
              placeholder="Ej. Cebolla"
            />
            <TextField
              size="small"
              type="number"
              label="Extra"
              value={choice.priceExtra}
              inputProps={{ min: 0, step: 0.5 }}
              onChange={(event) => onUpdateChoice(
                groupIndex,
                choiceIndex,
                "priceExtra",
                Math.max(0, Number(event.target.value || 0)),
              )}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ display: { xs: "none", sm: "block" } }}
            />
            <Chip
              size="small"
              clickable
              onClick={() => onSetDefaultChoice(
                groupIndex,
                choiceIndex,
                !choice.defaultSelected,
              )}
              icon={<Checkbox size="small" checked={choice.defaultSelected} />}
              label={choice.defaultSelected ? "Incluido" : "Opcional"}
              variant={choice.defaultSelected ? "filled" : "outlined"}
              color={choice.defaultSelected ? "primary" : "default"}
            />
            <IconButton
              size="small"
              color="error"
              disabled={group.choices.length === 1}
              aria-label={`Eliminar opción ${choice.name || choiceIndex + 1}`}
              onClick={() => onRemoveChoice(groupIndex, choiceIndex)}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button
          size="small"
          startIcon={<Add />}
          onClick={() => onAddChoice(groupIndex)}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
        >
          Agregar opción
        </Button>
      </Stack>
    </Box>
  );
};

MenuModifierGroupEditor.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    minSelect: PropTypes.number.isRequired,
    maxSelect: PropTypes.number.isRequired,
    choices: PropTypes.arrayOf(choiceShape).isRequired,
  }).isRequired,
  groupIndex: PropTypes.number.isRequired,
  onUpdateGroup: PropTypes.func.isRequired,
  onUpdateChoice: PropTypes.func.isRequired,
  onAddChoice: PropTypes.func.isRequired,
  onRemoveChoice: PropTypes.func.isRequired,
  onRemoveGroup: PropTypes.func.isRequired,
  onSetDefaultChoice: PropTypes.func.isRequired,
};

export default MenuModifierGroupEditor;
