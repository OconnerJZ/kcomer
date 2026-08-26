import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Fade,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { Result } from "antd";
import "antd/dist/reset.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useCreateBusinessMutation } from "@Features/business/api/business.api";
import { useGetFoodTypesQuery } from "@Features/catalogs/api/catalogs.api";
import { normalizeCatalogOptions } from "@Features/catalogs/model/catalogOption";
import {
  createBusinessRegistrationForm,
  toBusinessRegistrationPayload,
} from "@Features/owner/model/businessRegistration";
import {
  useUploadImageMutation,
  uploadHelpers,
} from "@Shared/api/uploads/upload.api";
import FormField from "@Features/owner/components/registration/FormField";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { isMobile } from "@Shared/utils/commons";
import { useAuth } from "@Features/auth/context/AuthContext";
import { isOwner } from "@Features/auth/model/roles";

const RegisterBusiness = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState(createBusinessRegistrationForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ownerReady, setOwnerReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { data: foodTypesResponse, isLoading: loadingFoodTypes } = useGetFoodTypesQuery();
  const [createBusiness, { isLoading: creating }] = useCreateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const foodTypes = useMemo(
    () => normalizeCatalogOptions(foodTypesResponse?.data || foodTypesResponse || []),
    [foodTypesResponse],
  );
  const loading = creating || uploading;

  const steps = useMemo(() => [
    {
      label: "Datos del negocio",
      fields: [
        { name: "businessName", label: "Nombre del negocio", type: "text", required: true, validate: "alphanumeric" },
        { name: "phone", label: "Teléfono", type: "text", required: true, validate: "phone" },
        { name: "foodTypeIds", label: "Tipo de comida", type: "autocomplete-multiple", options: foodTypes, required: true },
        { name: "hasDelivery", label: "¿Ofrece servicio a domicilio?", type: "switch", required: false },
        { name: "logo", label: "Logo del negocio", type: "image", required: true },
      ],
    },
    { label: "Horarios", fields: [{ name: "schedule", type: "schedule", required: true }] },
    { label: "Ubicación", fields: [{ name: "location", label: "Ubicación en mapa", type: "map", required: true }] },
  ], [foodTypes]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    steps[currentTab].fields.forEach((field) => {
      const value = formValues[field.name];
      if (!field.required) return;

      if (field.type === "autocomplete-multiple" || field.type === "schedule") {
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[field.name] = true;
          valid = false;
        }
        return;
      }

      if (field.type === "image") {
        if (!value) {
          newErrors[field.name] = true;
          valid = false;
        }
        return;
      }

      if (field.type === "map") {
        if (!value?.latitude || !value?.longitude) {
          newErrors[field.name] = true;
          valid = false;
        }
        return;
      }

      if (typeof value !== "string" || value.trim() === "") {
        newErrors[field.name] = true;
        valid = false;
      }
    });

    setErrors(newErrors);
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
          showSnackbar("Error al subir el logo", "error");
          return;
        }
      }

      const businessData = toBusinessRegistrationPayload({
        form: formValues,
        userId: user?.id,
        logoUrl,
      });

      const result = await createBusiness(businessData).unwrap();
      if (!result) return;

      const refreshResult = await refreshUser();
      const refreshedUser = refreshResult?.user;
      const canManageBusiness = isOwner(refreshedUser);

      setOwnerReady(canManageBusiness);
      setSubmitted(true);
      showSnackbar(
        canManageBusiness
          ? "Negocio registrado exitosamente"
          : "Negocio registrado. Estamos actualizando tus permisos.",
        canManageBusiness ? "success" : "info",
      );

      if (onSuccess && canManageBusiness) onSuccess();
    } catch (error) {
      console.error("Error creating business:", error);
      showSnackbar(error?.data?.message || error?.message || "Error al registrar negocio", "error");
    }
  };

  const nextPrev = async (direction) => {
    if (direction === 1 && !validateForm()) {
      showSnackbar("Por favor completa todos los campos requeridos", "error");
      return;
    }

    const nextTab = currentTab + direction;
    if (nextTab >= steps.length) {
      await handleSubmit();
      return;
    }
    setCurrentTab(nextTab);
  };

  if (isOwner(user) && !submitted) {
    return <Navigate to="/owner" replace />;
  }

  if (submitted) {
    return (
      <GeneralContent title="Negocio">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Card sx={{ width: "100%", maxWidth: 500 }}>
            <CardContent>
              <Result
                status={ownerReady ? "success" : "info"}
                title={ownerReady ? "¡Registro exitoso!" : "¡Negocio registrado!"}
                subTitle={ownerReady
                  ? "Tu negocio se ha registrado correctamente."
                  : "El negocio se creó correctamente, pero tu sesión aún no refleja los permisos de propietario."}
                extra={ownerReady ? [
                  <Button key="dashboard" variant="contained" onClick={() => navigate("/owner")}>
                    Administrar mi negocio
                  </Button>,
                ] : [
                  <Button key="explore" variant="contained" onClick={() => navigate("/explorar")}>
                    Volver a explorar
                  </Button>,
                ]}
              />
            </CardContent>
          </Card>
        </Box>
      </GeneralContent>
    );
  }

  return (
    <GeneralContent title="Negocio">
      <Box sx={{ display: "flex", justifyContent: "center", mt: isMobile() ? 1 : 3, px: 2, py: 0 }}>
        <Paper sx={{ mt: 2, mb: 2, maxWidth: 450, width: "100%", p: 2, borderRadius: 3 }} elevation={6}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Paso {currentTab + 1} de {steps.length}
            </Typography>
          </Box>

          <Box sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
            <Box sx={{ display: "flex", width: `${steps.length * 100}%`, transform: `translateX(-${(currentTab * 100) / steps.length}%)`, transition: "transform 0.5s ease" }}>
              {steps.map((step, index) => (
                <Box key={step.label} sx={{ width: `${100 / steps.length}%`, flexShrink: 0, boxSizing: "border-box", paddingRight: 2 }}>
                  <Fade in={index === currentTab} timeout={500} unmountOnExit>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>{step.label}</Typography>
                      {step.fields.some((field) => field.name === "foodTypeIds") && loadingFoodTypes ? (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                          <Typography variant="body2" color="text.secondary">Cargando tipos de comida...</Typography>
                        </Box>
                      ) : (
                        step.fields.map((field) => (
                          <FormField
                            key={field.name}
                            field={field}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            error={errors[field.name]}
                          />
                        ))
                      )}
                    </Box>
                  </Fade>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
            {currentTab > 0 && <Button onClick={() => nextPrev(-1)} disabled={loading}>Anterior</Button>}
            <Button variant="contained" onClick={() => nextPrev(1)} disabled={loading || loadingFoodTypes}>
              {loading ? "Enviando..." : currentTab === steps.length - 1 ? "Registrar Negocio" : "Siguiente"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            {steps.map((step, index) => {
              const isFinished = index < currentTab && step.fields.every((field) => {
                const value = formValues[field.name];
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === "object") return Boolean(value);
                return String(value ?? "").trim() !== "";
              });
              const stepColor = index === currentTab ? "#1976d2" : isFinished ? "#04AA6D" : "#bbbbbb";
              return <Box key={step.label} component="span" sx={{ height: 15, width: 15, margin: "0 2px", borderRadius: "50%", display: "inline-block", opacity: index === currentTab ? 1 : 0.5, backgroundColor: stepColor, transition: "all 0.3s ease" }} />;
            })}
          </Box>
        </Paper>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={closeSnackbar} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GeneralContent>
  );
};

export default RegisterBusiness;
