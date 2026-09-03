import PropTypes from "prop-types";
import { Box, FormHelperText, Typography } from "@mui/material";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useRegistrationImageField from "../../hooks/useRegistrationImageField";

const RegistrationImageField = ({ field, formValues, setFormValues, error, helperText }) => {
  const image = useRegistrationImageField({
    initialFile: formValues[field.name],
    onChange: (file) => setFormValues((current) => ({
      ...current,
      [field.name]: file,
    })),
  });
  const message = image.validationError || (error ? helperText || "Selecciona una imagen." : "");

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1">{field.label}</Typography>
      <Upload
        listType="picture-card"
        fileList={image.fileList}
        maxCount={1}
        onChange={image.handleChange}
        onPreview={image.handlePreview}
        accept="image/*"
        beforeUpload={() => false}
      >
        {image.fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Subir</div>
          </div>
        )}
      </Upload>
      {message && <FormHelperText error>{message}</FormHelperText>}
      {image.previewImage && (
        <Image
          style={{ display: "none" }}
          preview={{
            open: image.previewOpen,
            src: image.previewImage,
            onOpenChange: image.setPreviewOpen,
            afterOpenChange: image.closePreview,
          }}
        />
      )}
    </Box>
  );
};

RegistrationImageField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default RegistrationImageField;
