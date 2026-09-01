import { useMemo, useState } from "react";
import { Box, Button, Fade, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { StorefrontRounded } from "@mui/icons-material";
import { Result } from "antd";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessMutation } from "@Features/business/api/business.api";
import { useGetFoodTypesQuery } from "@Features/catalogs/api/catalogs.api";
import { normalizeCatalogOptions } from "@Features/catalogs/model/catalogOption";
import { createBusinessRegistrationForm, toBusinessRegistrationPayload } from "@Features/owner/model/businessRegistration";
import { useUploadImageMutation, uploadHelpers } from "@Shared/api/uploads/upload.api";
import FormField from "@Features/owner/components/registration/FormField";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { useAuth } from "@Features/auth/context/AuthContext";
import { isOwner } from "@Features/auth/model/roles";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";
import Bg from "@Assets/images/qscome-bg-6.png";

const RegisterBusiness = ({ onSuccess }) => {
  const navigate = useNavigate();
  const feedback = useFeedback();
  const { user, refreshUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState(createBusinessRegistrationForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ownerReady, setOwnerReady] = useState(false);
  const { data: foodTypesResponse, isLoading: loadingFoodTypes } = useGetFoodTypesQuery();
  const [createBusiness, { isLoading: creating }] = useCreateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const foodTypes = useMemo(() => normalizeCatalogOptions(foodTypesResponse?.data || foodTypesResponse || []), [foodTypesResponse]);
  const loading = creating || uploading;

  const steps = useMemo(() => [
    { label: "Tu negocio", subtitle: "Lo esencial para que las personas lo reconozcan.", fields: [
      { name: "businessName", label: "Nombre del negocio", type: "text", required: true, validate: "alphanumeric" },
      { name: "phone", label: "Teléfono", type: "text", required: true, validate: "phone" },
      { name: "foodTypeIds", label: "Tipo de comida", type: "autocomplete-multiple", options: foodTypes, required: true },
      { name: "hasDelivery", label: "¿Ofrece servicio a domicilio?", type: "switch" },
      { name: "logo", label: "Logo del negocio", type: "image", required: true },
    ]},
    { label: "Cuándo te encuentran", subtitle: "Configura los horarios que verán tus clientes.", fields: [{ name: "schedule", type: "schedule", required: true }] },
    { label: "Dónde estás", subtitle: "Marca tu ubicación para que llegar sea sencillo.", fields: [{ name: "location", label: "Ubicación en mapa", type: "map", required: true }] },
  ], [foodTypes]);

  const validateForm = () => {
    let valid = true;
    const nextErrors = {};
    steps[currentTab].fields.forEach((field) => {
      if (!field.required) return;
      const value = formValues[field.name];
      const empty = field.type === "autocomplete-multiple" || field.type === "schedule"
        ? !Array.isArray(value) || !value.length
        : field.type === "map"
          ? !value?.latitude || !value?.longitude
          : !value || (typeof value === "string" && !value.trim());
      if (empty) { nextErrors[field.name] = true; valid = false; }
    });
    setErrors(nextErrors);
    return valid;
  };

  const handleSubmit = async () => {
    try {
      let logoUrl = "";
      if (formValues.logo) {
        const uploadResult = await uploadHelpers.uploadImage(formValues.logo, uploadImage);
        const uploaded = uploadResult?.data?.data || uploadResult?.data;
        logoUrl = uploaded?.url || uploaded?.filename || "";
        if (!logoUrl) {
          feedback.error("No pudimos subir el logo. Intenta nuevamente.", { title: "Logo no disponible" });
          return;
        }
      }

      const businessData = toBusinessRegistrationPayload({ form: formValues, userId: user?.id, logoUrl });
      const result = await createBusiness(businessData).unwrap();
      if (!result) return;

      const refreshResult = await refreshUser();
      const ready = isOwner(refreshResult?.user);
      setOwnerReady(ready);
      setSubmitted(true);
      feedback.success("Tu negocio quedó registrado correctamente.", { title: "Negocio creado" });
      if (onSuccess) await onSuccess();
    } catch (error) {
      feedback.error(error?.data?.message || error?.message || "Error al registrar negocio", { title: "No pudimos crear el negocio" });
    }
  };

  const nextPrev = async (direction) => {
    if (direction === 1 && !validateForm()) {
      feedback.warning("Revisa los campos marcados antes de continuar.", { title: "Falta información" });
      return;
    }
    const next = currentTab + direction;
    if (next >= steps.length) return handleSubmit();
    setCurrentTab(next);
  };

  if (submitted) return (
    <GeneralContent>
      <Box sx={{ minHeight: 420, display: "grid", placeItems: "center", px: 2 }}>
        <Paper elevation={0} sx={{ maxWidth: 520, p: 2, borderRadius: 5, border: "1px solid", borderColor: "divider" }}>
          <Result status="success" title="¡Tu negocio ya está en Kcomer!" subTitle="Ahora puedes completar su menú, portada y configuración desde el panel." extra={<Button variant="contained" onClick={() => navigate(ownerReady ? "/owner" : "/explorar")}>{ownerReady ? "Administrar negocio" : "Continuar"}</Button>} />
        </Paper>
      </Box>
    </GeneralContent>
  );

  const step = steps[currentTab];
  return (
    <GeneralContent>
      <Box sx={{ minHeight: "calc(100vh - 64px)", py: { xs: 3, md: 5 }, px: 2, backgroundImage: `linear-gradient(rgba(255,255,255,.78),rgba(255,255,255,.92)), url(${Bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <Paper elevation={0} sx={{ mx: "auto", width: "100%", maxWidth: 720, overflow: "hidden", borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "0 18px 50px rgba(32,28,26,.10)", bgcolor: "rgba(255,255,255,.92)", backdropFilter: "blur(18px)" }}>
          <Box sx={{ p: { xs: 2.5, sm: 4 }, pb: 2, background: "linear-gradient(135deg,#201c1b 0%,#302724 100%)", color: "white" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}><Box sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "rgba(255,159,28,.18)", color: "secondary.light" }}><StorefrontRounded /></Box><Box><Typography variant="overline" sx={{ opacity: .65, letterSpacing: ".14em" }}>CREAR NEGOCIO</Typography><Typography variant="h4" fontWeight={900}>Hazlo fácil de descubrir.</Typography></Box></Stack>
          </Box>
          <LinearProgress variant="determinate" value={((currentTab + 1) / steps.length) * 100} sx={{ height: 4 }} />
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="caption" color="primary" fontWeight={800}>PASO {currentTab + 1} / {steps.length}</Typography>
            <Typography variant="h5" fontWeight={850}>{step.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{step.subtitle}</Typography>
            <Fade in key={currentTab} timeout={240}><Box>{loadingFoodTypes && currentTab === 0 ? <Typography color="text.secondary">Cargando tipos de comida...</Typography> : step.fields.map((field) => <FormField key={field.name} field={field} formValues={formValues} setFormValues={setFormValues} error={errors[field.name]} />)}</Box></Fade>
            <Stack direction={{ xs: "column-reverse", sm: "row" }} gap={1} justifyContent="space-between" sx={{ mt: 4 }}><Button onClick={() => nextPrev(-1)} disabled={currentTab === 0 || loading}>Anterior</Button><Button variant="contained" disableElevation onClick={() => nextPrev(1)} disabled={loading || loadingFoodTypes} sx={{ px: 3 }}>{loading ? "Guardando..." : currentTab === steps.length - 1 ? "Crear negocio" : "Continuar"}</Button></Stack>
          </Box>
        </Paper>
      </Box>
    </GeneralContent>
  );
};

export default RegisterBusiness;
