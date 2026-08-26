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
import GoogleMapField from "./GoogleMapField";
import ScheduleField from "./ScheduleField";
import { API_KEY_MAPS } from "@Shared/config/env";
import { validateImageFile } from "@Shared/media/images";

const validators = {
  alphabetic: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/,
  alphanumeric: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/,
  numeric: /^[0-9]*$/,
  phone: /^[0-9]{0,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const handleValidatedChange = (event, setFormValues, validate, field) => {
  const value = event.target.value;
  const regex = validators[validate] || /.*/;
  if (regex.test(value)) {
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
  }
};

const ImageField = ({ field, formValues, setFormValues }) => {
  const [fileList, setFileList] = useState(
    formValues[field.name]
      ? [{ uid: "-1", name: "image.png", status: "done", originFileObj: formValues[field.name], url: URL.createObjectURL(formValues[field.name]) }]
      : [],
  );
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = ({ fileList: nextFileList }) => {
    const limitedList = nextFileList.slice(-1);
    const latestFile = limitedList[0]?.originFileObj;

    try {
      if (latestFile) validateImageFile(latestFile);
      setFileList(limitedList);
      setFormValues((prev) => ({ ...prev, [field.name]: latestFile || null }));
    } catch (error) {
      setFileList([]);
      setFormValues((prev) => ({ ...prev, [field.name]: null }));
      console.warn(error.message);
    }
  };

  const handlePreview = async (file) => {
    if (file.url) setPreviewImage(file.url);
    else if (file.originFileObj) setPreviewImage(URL.createObjectURL(file.originFileObj));
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1">{field.label}</Typography>
      <Upload listType="picture-card" fileList={fileList} maxCount={1} onChange={handleChange} onPreview={handlePreview} accept="image/*" beforeUpload={() => false}>
        {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Subir</div></div>}
      </Upload>
      {previewImage && <Image style={{ display: "none" }} preview={{ open: previewOpen, src: previewImage, onOpenChange: setPreviewOpen, afterOpenChange: (visible) => !visible && setPreviewImage("") }} />}
    </Box>
  );
};

const getOptionLabel = (option) => option?.label || "";

const fieldComponents = {
  text: ({ field, formValues, setFormValues, error, helperText, validate }) => <TextField label={field.label} type="text" value={formValues[field.name] || ""} onChange={(event) => handleValidatedChange(event, setFormValues, validate || field.validate, field)} fullWidth margin="normal" error={!!error} helperText={helperText} required={field.required} />,
  email: ({ field, formValues, setFormValues, error, helperText }) => <TextField label={field.label} type="email" value={formValues[field.name] || ""} onChange={(event) => handleValidatedChange(event, setFormValues, "email", field)} fullWidth margin="normal" error={!!error} helperText={helperText || "Formato: usuario@ejemplo.com"} required={field.required} />,
  password: ({ field, formValues, setFormValues, error, helperText }) => <TextField label={field.label} type="password" value={formValues[field.name] || ""} onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))} fullWidth margin="normal" error={!!error} helperText={helperText} required={field.required} />,
  checkbox: ({ field, formValues, setFormValues }) => <FormControlLabel control={<Checkbox checked={!!formValues[field.name]} onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.checked }))} />} label={field.label} />,
  switch: ({ field, formValues, setFormValues }) => <FormControlLabel control={<Switch checked={!!formValues[field.name]} onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.checked }))} />} label={field.label} />,
  radio: ({ field, formValues, setFormValues, error, helperText }) => <FormControl component="fieldset" error={!!error} sx={{ mb: 2 }}><Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography><RadioGroup value={formValues[field.name] || ""} onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))}>{(field.options || []).map((option) => <FormControlLabel key={option} value={option} control={<Radio />} label={option} />)}</RadioGroup>{error && <FormHelperText>{helperText}</FormHelperText>}</FormControl>,
  autocomplete: ({ field, formValues, setFormValues, error, helperText }) => {
    const options = field.options || [];
    const selectedOption = options.find((option) => option.id === formValues[field.name]) || null;
    return <Autocomplete options={options} getOptionLabel={getOptionLabel} value={selectedOption} onChange={(_, newValue) => setFormValues((prev) => ({ ...prev, [field.name]: newValue?.id || null }))} renderInput={(params) => <TextField {...params} label={field.label} margin="normal" fullWidth error={!!error} helperText={helperText} required={field.required} />} />;
  },
  "autocomplete-multiple": ({ field, formValues, setFormValues, error, helperText }) => {
    const options = field.options || [];
    const selectedOptions = options.filter((option) => Array.isArray(formValues[field.name]) && formValues[field.name].includes(option.id));
    return <Autocomplete multiple options={options} getOptionLabel={getOptionLabel} value={selectedOptions} onChange={(_, newValue) => setFormValues((prev) => ({ ...prev, [field.name]: newValue.map((value) => value.id) }))} renderInput={(params) => <TextField {...params} label={field.label} margin="normal" fullWidth error={!!error} helperText={helperText} required={field.required} />} />;
  },
  image: ImageField,
  schedule: ScheduleField,
  map: ({ field, formValues, setFormValues }) => <GoogleMapField value={formValues[field.name]} onChange={(coords) => setFormValues((prev) => ({ ...prev, [field.name]: coords }))} label={field.label} apiKey={API_KEY_MAPS} />,
};

const FormField = (props) => {
  const Field = fieldComponents[props.field.type];
  if (!Field) {
    console.warn(`Tipo de campo no soportado: ${props.field.type}`);
    return null;
  }
  return <Field {...props} />;
};

export default FormField;
