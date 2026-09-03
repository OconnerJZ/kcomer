import { useCallback, useState } from "react";
import { readFileAsDataUrl, validateImageFile } from "@Shared/media/images";

const createUploadFile = (file, url) => ({
  uid: "-1",
  name: file?.name || "image.png",
  status: "done",
  originFileObj: file,
  ...(url ? { url } : {}),
});

export const useRegistrationImageField = ({ initialFile, onChange }) => {
  const [fileList, setFileList] = useState(() => (
    initialFile ? [createUploadFile(initialFile)] : []
  ));
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = useCallback(async ({ fileList: nextFileList }) => {
    const latestUpload = nextFileList.slice(-1)[0];
    const latestFile = latestUpload?.originFileObj;

    if (!latestFile) {
      setFileList([]);
      setValidationError("");
      onChange(null);
      return;
    }

    try {
      validateImageFile(latestFile);
      const preview = await readFileAsDataUrl(latestFile);
      setFileList([createUploadFile(latestFile, preview)]);
      setValidationError("");
      onChange(latestFile);
    } catch (error) {
      setFileList([]);
      setValidationError(error.message);
      onChange(null);
    }
  }, [onChange]);

  const handlePreview = useCallback(async (file) => {
    const preview = file.url || (file.originFileObj
      ? await readFileAsDataUrl(file.originFileObj)
      : "");
    setPreviewImage(preview);
    setPreviewOpen(Boolean(preview));
  }, []);

  const closePreview = useCallback((visible) => {
    if (!visible) setPreviewImage("");
  }, []);

  return {
    fileList,
    previewImage,
    previewOpen,
    validationError,
    setPreviewOpen,
    handleChange,
    handlePreview,
    closePreview,
  };
};

export default useRegistrationImageField;
