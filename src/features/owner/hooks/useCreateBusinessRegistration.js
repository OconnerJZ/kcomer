import { useCallback, useState } from "react";
import { useCreateBusinessMutation } from "@Features/business/api/business.api";
import useAuth from "@Features/auth/context/useAuth";
import { isOwner } from "@Features/auth/model/roles";
import { useUploadImageMutation, uploadHelpers } from "@Shared/api/uploads/upload.api";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";
import { toBusinessRegistrationPayload } from "../model/businessRegistration";

export const useCreateBusinessRegistration = ({ formValues, onSuccess }) => {
  const feedback = useFeedback();
  const { user, refreshUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [ownerReady, setOwnerReady] = useState(false);
  const [createBusiness, { isLoading: creating }] = useCreateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const submit = useCallback(async () => {
    try {
      let logoUrl = "";
      if (formValues.logo) {
        const uploadResult = await uploadHelpers.uploadImage(formValues.logo, uploadImage);
        const uploaded = uploadResult?.data?.data || uploadResult?.data;
        logoUrl = uploaded?.url || uploaded?.filename || "";
        if (!logoUrl) {
          feedback.error("No pudimos subir el logo. Intenta nuevamente.", {
            title: "Logo no disponible",
          });
          return false;
        }
      }

      const payload = toBusinessRegistrationPayload({
        form: formValues,
        userId: user?.id,
        logoUrl,
      });
      const result = await createBusiness(payload).unwrap();
      if (!result) return false;

      const refreshResult = await refreshUser();
      setOwnerReady(isOwner(refreshResult?.user));
      setSubmitted(true);
      feedback.success("Tu negocio quedó registrado correctamente.", {
        title: "Negocio creado",
      });
      await onSuccess?.();
      return true;
    } catch (error) {
      feedback.error(
        error?.data?.message || error?.message || "Error al registrar negocio",
        { title: "No pudimos crear el negocio" },
      );
      return false;
    }
  }, [createBusiness, feedback, formValues, onSuccess, refreshUser, uploadImage, user]);

  return {
    submitted,
    ownerReady,
    loading: creating || uploading,
    submit,
  };
};

export default useCreateBusinessRegistration;
