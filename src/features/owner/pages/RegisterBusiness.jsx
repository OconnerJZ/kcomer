// src/pages/dashboard/RegisterBusiness.jsx - REFACTORIZADO
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Fade,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Result } from "antd";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";

import { useCreateBusinessMutation } from "@Features/business/api/business.api";
import { useGetFoodTypesQuery } from "@Features/catalogs/api/catalogs.api";
import {
  useUploadImageMutation,
  uploadHelpers,
} from "@Shared/api/uploads/upload.api";

import FormField from "@Features/owner/components/registration/FormField";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { isMobile } from "@Shared/utils/commons";
import { useAuth } from "@Features/auth/context/AuthContext";

const RegisterBusiness = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { data: foodTypesResponse, isLoading: loadingFoodTypes } = useGetFoodTypesQuery();
  const [createBusiness, { isLoading: creating }] = useCreateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const foodTypes = foodTypesResponse?.data || foodTypesResponse || [];
  const loading = creating || uploading;

  const steps = [
    {
      label: "Datos del negocio",
      fields: [
        { name: "business_name", label: "Nombre del negocio", type: "text", required: true, validate: "alphanumeric" },
        { name: "phone", label: "Teléfono", type: "text", required: true, validate: "phone" },
        { name: "food_type", label: "Tipo de comida", type: "autocomplete-multiple", options: foodTypes, required: true },
        { name: "has_delivery", label: "¿Ofrece servicio a domicilio?", type: "switch", required: false },
        { name: "logo_url", label: "Logo del negocio", type: "image", required: true },
      ],
    },
    { label: "Horarios", fields: [{ name: "schedule", type: "schedule", required: true }] },
    { label: "Ubicación", fields: [{ name: "locale", label: "Ubicación en mapa", type: "map", required: true }] },
  ];

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    steps[currentTab].fields.forEach((field) => {
      const val = formValues[field.name];
      if (!field.required) return;

      if (field.type === "autocomplete-multiple") {
        if (!val || val.length === 0) {
          newErrors[field.name] = true;
          valid = false;
        }
      } else if (field.type === "image") {
        if (!val) {
          newErrors[field.name] = true;
          valid = false;
        }
      } else if (field.type === "schedule") {
        if (!val || val.length === 0) {
          newErrors[field.name] = true;
          valid = false;
        }
      } else if (field.type === "map") {
        if (!val || !val.latitude || !val.longitude) {
          newErrors[field.name] = true;
          valid = false;
        }
      } else if (!val || val.trim() === "") {
        newErrors[field.name] = true;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    try {
      const { logo_url, ...values } = formValues;
      let logoUrl = "";

      if (logo_url) {
        const uploadResult = await uploadHelpers.uploadImage(logo_url, uploadImage);
        if (!uploadResult.data) {
          showSnackbar("Error al subir el logo", "error");
          return;
        }
        logoUrl = uploadResult.data.filename;
      }

      const businessData = {
        id: user?.id,
        business_name: values.business_name,
        phone: values.phone,
        food_type: values.food_type,
        has_delivery: values.has_delivery || false,
        logo_url: logoUrl,
        schedule: values.schedule,
        locale: {
          latitude: values.locale?.latitude,
          longitude: values.locale?.longitude,
          address: values.locale?.address || "",
        },
      };

      const result = await createBusiness(businessData).unwrap();

      if (result) {
        setSubmitted(true);
        showSnackbar("Negocio registrado exitosamente");
        await refreshUser();
        if (onSuccess) setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      console.error("Error creating business:", error);
      const errorMessage = error?.data?.message || error?.message || "Error al registrar negocio";
      showSnackbar(errorMessage, "error");
    }
  };

  const nextPrev = async (n) => {
    if (n === 1 && !validateForm()) {
      showSnackbar("Por favor completa todos los campos requeridos", "error");
      return;
    }

    const nextTab = currentTab + n;
    if (nextTab >= steps.length) {
      await handleSubmit();
      return;
    }
    setCurrentTab(nextTab);
  };

  if (submitted) {
    return (
      <GeneralContent title="Negocio">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Card sx={{ width: "100%", maxWidth: 500 }}>
            <CardContent>
              <Result
                status="success"
                title="¡Registro exitoso!"
                subTitle="Tu negocio se ha registrado correctamente."
                extra={[
                  <Button key="dashboard" variant="contained" onClick={() => navigate("/owner")}>
                    Administrar mi negocio
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
            <Box
              sx={{
                display: "flex",
                width: `${steps.length * 100}%`,
                transform: `translateX(-${(currentTab * 100) / steps.length}%)`,
                transition: "transform 0.5s ease",
              }}
            >
              {steps.map((step, index) => (
                <Box key={step.label} sx={{ width: `${100 / steps.length}%`, flexShrink: 0, boxSizing: "border-box", paddingRight: 2 }}>
                  <Fade in={index === currentTab} timeout={500} unmountOnExit>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                        {step.label}
                      </Typography>
                      {step.fields.some((field) => field.name === "food_type") && loadingFoodTypes ? (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Cargando tipos de comida...
                          </Typography>
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
            {currentTab > 0 && (
              <Button onClick={() => nextPrev(-1)} disabled={loading}>
                Anterior
              </Button>
            )}
            <Button variant="contained" onClick={() => nextPrev(1)} disabled={loading || loadingFoodTypes}>
              {loading ? "Enviando..." : currentTab === steps.length - 1 ? "Registrar Negocio" : "Siguiente"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            {steps.map((_, index) => {
              const isFinished =
                index < currentTab &&
                steps[index].fields.every((field) =>
                  formValues[field.name] &&
                  (Array.isArray(formValues[field.name])
                    ? formValues[field.name].length > 0
                    : formValues[field.name].toString().trim() !== "")
                );

              const stepColor = index === currentTab ? "#1976d2" : isFinished ? "#04AA6D" : "#bbbbbb";
              return (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    height: 15,
                    width: 15,
                    margin: "0 2px",
                    borderRadius: "50%",
                    display: "inline-block",
                    opacity: index === currentTab ? 1 : 0.5,
                    backgroundColor: stepColor,
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GeneralContent>
  );
};

export default RegisterBusiness;
