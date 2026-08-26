export const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const validateImageFile = (file) => {
  if (!file) throw new Error("Archivo de imagen requerido");
  if (file.size > IMAGE_MAX_SIZE) {
    throw new Error("La imagen debe pesar menos de 5MB");
  }
  if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG, WebP o GIF");
  }
  return true;
};

export const validateImageFiles = (files = []) => {
  files.forEach(validateImageFile);
  return true;
};

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
