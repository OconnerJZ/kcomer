import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { isSingleSelection } from "../model/productCustomization";

const ProductModifierGroup = ({ group, selected, onToggle }) => {
  const single = isSingleSelection(group);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Box>
          <Typography fontWeight={600}>{group.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {group.required ? "Selección requerida" : "Opcional"}
            {group.maxSelect > 1 ? ` · Hasta ${group.maxSelect}` : ""}
          </Typography>
        </Box>
        {group.required && (
          <Chip label="Requerido" size="small" color="primary" variant="outlined" />
        )}
      </Stack>

      <Stack spacing={0.3}>
        {(group.choices || []).map((choice) => {
          const checked = Boolean(selected.get(Number(choice.id)));
          const selector = single
            ? <Radio checked={checked} onChange={() => onToggle(group, choice)} />
            : <Checkbox checked={checked} onChange={() => onToggle(group, choice)} />;

          return (
            <FormControlLabel
              key={choice.id}
              control={selector}
              label={(
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{choice.name}</Typography>
                  {Number(choice.priceExtra || 0) > 0 && (
                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                      +${Number(choice.priceExtra).toFixed(2)}
                    </Typography>
                  )}
                </Stack>
              )}
              sx={{ width: "100%", m: 0, py: 0.25 }}
            />
          );
        })}
      </Stack>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

ProductModifierGroup.propTypes = {
  group: PropTypes.object.isRequired,
  selected: PropTypes.instanceOf(Map).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ProductModifierGroup;
