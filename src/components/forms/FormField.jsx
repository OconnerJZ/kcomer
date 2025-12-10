import {
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
  Radio,
  RadioGroup,
  FormHelperText,
  FormControl,
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";
import GoogleMapField from "./GoogleMapField";
import { API_KEY_MAPS } from "@Utils/enviroments";
import ScheduleField from "./ScheduleField";

// Validadores centralizados
const validators = {
  alphabetic: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/,
  alphanumeric: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/,
  numeric: /^[0-9]*$/,
  phone: /^[0-9]{0,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const handleChange = (e, setFormValues, validate, field) => {
  const value = e.target.value;
  const regex = validators[validate] || /.*/;
  if (regex.test(value)) {
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
  }
};

// Componente de imagen mejorado
const ImageField = ({ field, formValues, setFormValues }) => {
  const [fileList, setFileList] = useState(
    formValues[field.name]
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            originFileObj: formValues[field.name],
            url: URL.createObjectURL(formValues[field.name]),
          },
        ]
      : []
  );
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
    const latestFile = newFileList[0]?.originFileObj;
    setFormValues((prev) => ({
      ...prev,
      [field.name]: latestFile || null,
    }));
  };

  const handlePreview = async (file) => {
    if (file.url) {
      setPreviewImage(file.url);
    } else if (file.originFileObj) {
      setPreviewImage(URL.createObjectURL(file.originFileObj));
    }
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Subir</div>
    </div>
  );

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1">{field.label}</Typography>
      <Upload
        listType="picture-card"
        fileList={fileList}
        maxCount={1}
        onChange={handleChange}
        onPreview={handlePreview}
        accept="image/*"
        beforeUpload={() => false} // Prevenir upload automático
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          style={{ display: "none" }}
          preview={{
            open: previewOpen,
            src: previewImage,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
        />
      )}
    </Box>
  );
};

// Mapa de componentes
const fieldComponents = {
  text: ({ field, formValues, setFormValues, error, helperText, validate }) => (
    <TextField
      key={field.name}
      label={field.label}
      type="text"
      value={formValues[field.name] || ""}
      onChange={(e) => handleChange(e, setFormValues, validate, field)}
      fullWidth
      margin="normal"
      error={!!error}
      helperText={helperText}
      required={field.required}
    />
  ),

  email: ({ field, formValues, setFormValues, error, helperText }) => (
    <TextField
      key={field.name}
      label={field.label}
      type="email"
      value={formValues[field.name] || ""}
      onChange={(e) => handleChange(e, setFormValues, "email", field)}
      fullWidth
      margin="normal"
      error={!!error}
      helperText={helperText || "Formato: usuario@ejemplo.com"}
      required={field.required}
    />
  ),

  password: ({ field, formValues, setFormValues, error, helperText }) => (
    <TextField
      key={field.name}
      label={field.label}
      type="password"
      value={formValues[field.name] || ""}
      onChange={(e) =>
        setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
      }
      fullWidth
      margin="normal"
      error={!!error}
      helperText={helperText}
      required={field.required}
    />
  ),

  checkbox: ({ field, formValues, setFormValues }) => (
    <FormControlLabel
      key={field.name}
      control={
        <Checkbox
          checked={!!formValues[field.name]}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              [field.name]: e.target.checked,
            }))
          }
        />
      }
      label={field.label}
    />
  ),

  switch: ({ field, formValues, setFormValues }) => (
    <FormControlLabel
      key={field.name}
      control={
        <Switch
          checked={!!formValues[field.name]}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              [field.name]: e.target.checked,
            }))
          }
        />
      }
      label={field.label}
    />
  ),

  radio: ({ field, formValues, setFormValues, error, helperText }) => (
    <FormControl
      component="fieldset"
      error={!!error}
      sx={{ mb: 2 }}
      key={field.name}
    >
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {field.label}
      </Typography>
      <RadioGroup
        value={formValues[field.name] || ""}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
        }
      >
        {field.options.map((opt) => (
          <FormControlLabel
            key={opt}
            value={opt}
            control={<Radio />}
            label={opt}
          />
        ))}
      </RadioGroup>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  ),

  autocomplete: ({ field, formValues, setFormValues, error, helperText }) => {
    const options = field.options || [];
    // console.log(options)
    // Buscar opción seleccionada por ID
    const selectedOption =
      options.find((opt) => opt.id === formValues[field.name]) || null;

    return (
      <Autocomplete
        key={field.name}
        options={options}
        getOptionLabel={(option) => option.value || ""}
        value={selectedOption}
        onChange={(e, newValue) =>
          setFormValues((prev) => ({
            ...prev,
            [field.name]: newValue?.id || null, // Guardar SOLO el ID
          }))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={field.label}
            margin="normal"
            fullWidth
            error={!!error}
            helperText={helperText}
            required={field.required}
          />
        )}
      />
    );
  },

  "autocomplete-multiple": ({
    field,
    formValues,
    setFormValues,
    error,
    helperText,
  }) => {
    const options = field.options || [];

    const selectedOptions = options.filter(
      (opt) =>
        Array.isArray(formValues[field.name]) &&
        formValues[field.name].includes(opt.id)
    );

    return (
      <Autocomplete
        key={field.name}
        multiple
        options={options}
        getOptionLabel={(option) => option.value}
        value={selectedOptions}
        onChange={(e, newValue) =>
          setFormValues((prev) => ({
            ...prev,
            [field.name]: newValue.map((v) => v.id),
          }))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={field.label}
            margin="normal"
            fullWidth
            error={!!error}
            helperText={helperText}
            required={field.required}
          />
        )}
      />
    );
  },
  image: ImageField,
  schedule: ScheduleField,

  map: ({ field, formValues, setFormValues }) => (
    <GoogleMapField
      key={field.name}
      value={formValues[field.name]}
      onChange={(coords) =>
        setFormValues((prev) => ({ ...prev, [field.name]: coords }))
      }
      label={field.label}
      apiKey={API_KEY_MAPS}
    />
  ),
};

const FormField = (props) => {
  const Field = fieldComponents[props.field.type];
  if (!Field) {
    console.warn(`Tipo de campo no soportado: ${props.field.type}`);
    return null;
  }
  return <Field {...props} />;
};

FormField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    options: PropTypes.array,
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  validate: PropTypes.string,
};

export default FormField;
