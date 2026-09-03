import PropTypes from "prop-types";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";

const RegistrationChoiceField = ({ field, formValues, setFormValues, error, helperText }) => {
  const updateValue = (value) => {
    setFormValues((current) => ({ ...current, [field.name]: value }));
  };

  if (field.type === "radio") {
    return (
      <FormControl component="fieldset" error={Boolean(error)} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
        <RadioGroup
          value={formValues[field.name] || ""}
          onChange={(event) => updateValue(event.target.value)}
        >
          {(field.options || []).map((option) => (
            <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  const Control = field.type === "switch" ? Switch : Checkbox;
  return (
    <FormControlLabel
      control={(
        <Control
          checked={Boolean(formValues[field.name])}
          onChange={(event) => updateValue(event.target.checked)}
        />
      )}
      label={field.label}
    />
  );
};

RegistrationChoiceField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["checkbox", "switch", "radio"]).isRequired,
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default RegistrationChoiceField;
