import { api, createEndpointBuilder } from "@Shared/api/rtk/api";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const validateImage = (file) => {
  if (file.size > MAX_SIZE) {
    throw new Error("La imagen debe pesar menos de 5MB");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG, WebP o GIF");
  }
};

const validateImages = (files) => {
  files.forEach(validateImage);
};

const uploadEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    uploadImage: endpoint("api/upload/image", "create", { isJSON: false }),
    uploadMultiple: endpoint("api/upload/multiple", "create", { isJSON: false }),
    deleteImage: endpoint("upload-delete", "delete", {
      dynamicPath: ({ filename }) => `/api/upload/image/${filename}`,
    }),
  };
};

const apiUpload = api.injectEndpoints({
  endpoints: uploadEndpoints,
  overrideExisting: false,
});

export const {
  useUploadImageMutation,
  useUploadMultipleMutation,
  useDeleteImageMutation,
} = apiUpload;

export const uploadHelpers = {
  uploadImage: async (file, uploadMutation) => {
    validateImage(file);
    const formData = new FormData();
    formData.append("file", file);
    return uploadMutation(formData);
  },

  uploadMultiple: async (files, uploadMutation) => {
    validateImages(files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return uploadMutation(formData);
  },
};

export { MAX_SIZE, ALLOWED_TYPES, validateImage, validateImages };
