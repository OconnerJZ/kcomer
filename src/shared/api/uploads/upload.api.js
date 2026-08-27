import { api, createEndpointBuilder } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";
import {
  IMAGE_ALLOWED_TYPES,
  IMAGE_MAX_SIZE,
  validateImageFile,
  validateImageFiles,
} from "@Shared/media/images";

const uploadEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    uploadImage: endpoint(ENDPOINTS.upload.image, "create", { isJSON: false }),
    uploadMultiple: endpoint(ENDPOINTS.upload.multiple, "create", { isJSON: false }),
    deleteImage: endpoint("upload-delete", "delete", {
      dynamicPath: ({ filename }) => `${ENDPOINTS.upload.image}/${filename}`,
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
    validateImageFile(file);
    const formData = new FormData();
    formData.append("file", file);
    return uploadMutation(formData);
  },

  uploadMultiple: async (files, uploadMutation) => {
    validateImageFiles(files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return uploadMutation(formData);
  },
};

export {
  IMAGE_MAX_SIZE as MAX_SIZE,
  IMAGE_ALLOWED_TYPES as ALLOWED_TYPES,
  validateImageFile as validateImage,
  validateImageFiles as validateImages,
};
