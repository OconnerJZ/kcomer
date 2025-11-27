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
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import NestedSelectField from "./NestedSelectField";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const validators = {
  alphabetic: /^[A-Za-z ]*$/,
  alphanumeric: /^[A-Za-z0-9 ]*$/,
  numeric: /^[0-9]*$/,
  phone: /^[0-9]{0,10}$/, // acepta números, +, -, paréntesis y espacios
};

const handleChange = (e, setFormValues, validate, field) => {
  const value = e.target.value;
  const regex = validators[validate] || /.*/; // default: cualquier cosa
  if (regex.test(value)) {
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
  }
};

const fieldComponents = {
  text: ({ field, formValues, setFormValues, error, helperText, validate }) => (
    <TextField
      key={field.name}
      label={field.label}
      type="text"
      value={formValues[field.name] || ""}
      onChange={(e) => {
        handleChange(e, setFormValues, validate, field);
      }}
      fullWidth
      margin="normal"
      error={!!error}
      helperText={helperText || "Solo letras y espacios permitidos"}
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
      helperText={helperText || ""}
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
    <FormControl component="fieldset" error={!!error} sx={{ mb: 2 }}>
      <RadioGroup
        key={field.name}
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
  "nested-select": ({
    field,
    formValues,
    setFormValues,
    error,
    helperText,
  }) => (
    <NestedSelectField
      key={field.name}
      levels={field.levels}
      values={formValues}
      setValues={setFormValues}
      error={error}
      helperText={helperText}
    />
  ),
  autocomplete: ({ field, formValues, setFormValues, error, helperText }) => (
    <Autocomplete
      key={field.name}
      options={field.options || []}
      value={formValues[field.name] || null}
      onChange={(e, newValue) =>
        setFormValues((prev) => ({ ...prev, [field.name]: newValue }))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.label}
          margin="normal"
          fullWidth
          error={!!error}
          helperText={helperText || ""}
        />
      )}
    />
  ),
  "autocomplete-multiple": ({
    field,
    formValues,
    setFormValues,
    error,
    helperText,
  }) => (
    <Autocomplete
      key={field.name}
      multiple
      options={field.options || []}
      value={formValues[field.name] || []}
      onChange={(e, newValue) =>
        setFormValues((prev) => ({ ...prev, [field.name]: newValue }))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.label}
          margin="normal"
          fullWidth
          error={!!error}
          helperText={helperText || ""}
        />
      )}
    />
  ),
  image: ({ field, formValues, setFormValues }) => {
    const [fileList, setFileList] = useState(
      formValues[field.name]
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              originFileObj: formValues[field.name],
              url: formValues[field.name]
                ? URL.createObjectURL(formValues[field.name])
                : null,
            },
          ]
        : []
    );
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleChange = ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // solo mantener 1 archivo
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
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <Box sx={{ my: 2 }} key={field.name}>
        <Typography variant="subtitle1">{field.label}</Typography>

        <Upload
          listType="picture-circle"
          fileList={fileList}
          maxCount={1} // solo 1 imagen
          onChange={handleChange}
          onPreview={handlePreview}
          accept="image/*"
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
  },
  map: ({ field, formValues, setFormValues }) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
    const center = formValues[field.name] || { lat: 19.4326, lng: -99.1332 };
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });

    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
      <Box sx={{ my: 2 }} key={field.name}>
        <Typography variant="subtitle1">{field.label}</Typography>
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={{ width: "100%", height: 300, borderRadius: 8 }}
          onClick={(e) =>
            setFormValues((prev) => ({
              ...prev,
              [field.name]: { lat: e.latLng.lat(), lng: e.latLng.lng() },
            }))
          }
        >
          {formValues[field.name] && (
            <Marker position={formValues[field.name]} />
          )}
        </GoogleMap>
      </Box>
    );
  },
  schedule: ({ field, formValues, setFormValues }) => {
    const days = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    return (
      <Box sx={{ my: 2 }} key={field.name}>
        <Typography variant="subtitle1">{field.label}</Typography>
        {days.map((day) => (
          <Box
            key={day}
            sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ width: 90 }}>{day}</Typography>

            {/* Mobile Time Picker para hora de apertura */}
            <MobileTimePicker
              label="Apertura"
              value={
                formValues[`${day}_open`]
                  ? dayjs(formValues[`${day}_open`], "HH:mm")
                  : null
              }
              onChange={(newValue) =>
                setFormValues((prev) => ({
                  ...prev,
                  [`${day}_open`]: newValue ? newValue.format("HH:mm") : "",
                }))
              }
              renderInput={(params) => <TextField {...params} size="small" />}
            />

            {/* Mobile Time Picker para hora de cierre */}
            <MobileTimePicker
              label="Cierre"
              value={
                formValues[`${day}_close`]
                  ? dayjs(formValues[`${day}_close`], "HH:mm")
                  : null
              }
              onChange={(newValue) =>
                setFormValues((prev) => ({
                  ...prev,
                  [`${day}_close`]: newValue ? newValue.format("HH:mm") : "",
                }))
              }
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Box>
        ))}
      </Box>
    );
  },
};

const FormField = (props) => {
  const Field = fieldComponents[props.field.type];
  if (!Field) return null;
  return <Field {...props} />;
};

export default FormField;
