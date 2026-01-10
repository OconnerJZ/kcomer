import apiClient from "./config";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const uploadAPI = {
  uploadImage: async (file) => {
    // Validar tamaño
    if (file.size > MAX_SIZE) {
      throw new Error("La imagen debe pesar menos de 5MB");
    }

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Solo se permiten imágenes JPG, PNG, WebP o GIF");
    }

    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload múltiple
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    return apiClient.post("/api/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Eliminar imagen
  deleteImage: (filename) => apiClient.delete(`/api/upload/image/${filename}`),
};
