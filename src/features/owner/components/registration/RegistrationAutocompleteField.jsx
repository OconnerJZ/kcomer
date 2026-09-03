import PropTypes from "prop-types";
import { Autocomplete, TextField } from "@mui/material";
import {
  getRegistrationOptionLabel,
  selectRegistrationOptions,
} from "../../model/registrationField";

const RegistrationAutocompleteField = ({
  field,
  formValues,
  setFormValues,
  error,
  helperText,
}) => {
  const options = field.options || [];
  const multiple = field.type === "autocomplete-multiple";
  const value = selectRegistrationOptions(options, formValues[field.name], multiple);

  const handleChange = (_, nextValue) => {
    const nextFieldValue = multiple
      ? nextValue.map((option) => option.id)
      : nextValue?.id || null;
    setFormValues((current) => ({ ...current, [field.name]: nextFieldValue }));
  };

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      getOptionLabel={getRegistrationOptionLabel}
      value={value}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.label}
          margin="normal"
          fullWidth
          error={Boolean(error)}
          helperText={helperText}
          required={field.required}
        />
      )}
    />
  );
};

RegistrationAutocompleteField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["autocomplete", "autocomplete-multiple"]).isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      label: PropTypes.string,
    })),
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default RegistrationAutocompleteField;
