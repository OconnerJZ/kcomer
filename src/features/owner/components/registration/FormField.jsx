import PropTypes from "prop-types";
import GoogleMapField from "@Shared/components/maps/GoogleMapField";
import { API_KEY_MAPS } from "@Shared/config/env";
import RegistrationAutocompleteField from "./RegistrationAutocompleteField";
import RegistrationChoiceField from "./RegistrationChoiceField";
import RegistrationImageField from "./RegistrationImageField";
import RegistrationTextField from "./RegistrationTextField";
import ScheduleField from "./ScheduleField";

const TEXT_FIELD_TYPES = new Set(["text", "email", "password"]);
const CHOICE_FIELD_TYPES = new Set(["checkbox", "switch", "radio"]);
const AUTOCOMPLETE_FIELD_TYPES = new Set(["autocomplete", "autocomplete-multiple"]);

const FormField = ({ field, formValues, setFormValues, error, helperText, validate }) => {
  const sharedProps = { field, formValues, setFormValues, error, helperText };

  if (TEXT_FIELD_TYPES.has(field.type)) {
    return <RegistrationTextField {...sharedProps} validate={validate} />;
  }
  if (CHOICE_FIELD_TYPES.has(field.type)) {
    return <RegistrationChoiceField {...sharedProps} />;
  }
  if (AUTOCOMPLETE_FIELD_TYPES.has(field.type)) {
    return <RegistrationAutocompleteField {...sharedProps} />;
  }
  if (field.type === "image") {
    return <RegistrationImageField {...sharedProps} />;
  }
  if (field.type === "schedule") {
    return <ScheduleField formValues={formValues} setFormValues={setFormValues} />;
  }
  if (field.type === "map") {
    return (
      <GoogleMapField
        value={formValues[field.name]}
        onChange={(coords) => setFormValues((current) => ({
          ...current,
          [field.name]: coords,
        }))}
        label={field.label}
        apiKey={API_KEY_MAPS}
        height={360}
      />
    );
  }

  return null;
};

FormField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    validate: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.string,
};

export default FormField;
