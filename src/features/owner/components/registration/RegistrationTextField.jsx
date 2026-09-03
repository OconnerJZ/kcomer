import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { acceptsRegistrationFieldValue } from "../../model/registrationField";

const RegistrationTextField = ({
  field,
  formValues,
  setFormValues,
  error,
  helperText,
  validate,
}) => {
  const validation = validate || field.validate || (field.type === "email" ? "email" : null);
  const resolvedHelperText = field.type === "email"
    ? helperText || "Formato: usuario@ejemplo.com"
    : helperText;

  const handleChange = (event) => {
    const value = event.target.value;
    if (!acceptsRegistrationFieldValue(value, validation)) return;
    setFormValues((current) => ({ ...current, [field.name]: value }));
  };

  return (
    <TextField
      label={field.label}
      type={field.type}
      value={formValues[field.name] || ""}
      onChange={handleChange}
      fullWidth
      margin="normal"
      error={Boolean(error)}
      helperText={resolvedHelperText}
      required={field.required}
    />
  );
};

RegistrationTextField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["text", "email", "password"]).isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    validate: PropTypes.string,
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.string,
};

export default RegistrationTextField;
