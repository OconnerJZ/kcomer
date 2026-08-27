import { useCallback, useState } from "react";
import { readFileAsDataUrl, validateImageFile } from "@Shared/media/images";

export const useImagePreview = (initialPreview = "") => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);

  const selectImage = useCallback(async (nextFile) => {
    validateImageFile(nextFile);
    const nextPreview = await readFileAsDataUrl(nextFile);
    setFile(nextFile);
    setPreview(nextPreview);
    return { file: nextFile, preview: nextPreview };
  }, []);

  const resetImage = useCallback((nextPreview = "") => {
    setFile(null);
    setPreview(nextPreview);
  }, []);

  return {
    file,
    preview,
    setFile,
    setPreview,
    selectImage,
    resetImage,
  };
};

export default useImagePreview;
