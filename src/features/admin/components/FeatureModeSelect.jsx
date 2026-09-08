import PropTypes from "prop-types";
import { FormControl, MenuItem, Select } from "@mui/material";

export default function FeatureModeSelect({ value = "inherit", disabled = false, onChange, ariaLabel }) {
  return (
    <FormControl size="small" fullWidth disabled={disabled}>
      <Select
        value={value || "inherit"}
        onChange={(event) => onChange(event.target.value)}
        inputProps={{ "aria-label": ariaLabel }}
        sx={{ minWidth: 138 }}
      >
        <MenuItem value="inherit">Heredar</MenuItem>
        <MenuItem value="enabled">Habilitado</MenuItem>
        <MenuItem value="read_only">Solo lectura</MenuItem>
        <MenuItem value="disabled">Deshabilitado</MenuItem>
      </Select>
    </FormControl>
  );
}

FeatureModeSelect.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};
