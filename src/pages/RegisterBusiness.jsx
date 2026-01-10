import { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Fade,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { Result } from "antd";
import "antd/dist/reset.css"; // Importar estilos de AntD
import FormField from "@Components/forms/FormField";
import { useNavigate } from "react-router-dom";
import GeneralContent from "@Components/layout/GeneralContent";
import { isMobile } from "@Utils/commons";
import { businessAPI, catalogsAPI, uploadAPI } from '@Api';
import useAuth from "@Context/AuthContext";

const RegisterBusiness = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Nuevo estado para mostrar Result
  const navigate = useNavigate();
  const [foodTypes, setFoodTypes] = useState([]);
  const { user } = useAuth();

  const getFoodTypes = async () => {
    try {
      const response = await catalogsAPI.getFoodTypes();
      if (response.data.success) {
        const foodData = response.data.data;
        setFoodTypes(foodData);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
    }
  };

  useEffect(() => {
    getFoodTypes();
  }, []);

  const steps = [
    {
      label: "Datos del negocio",
      fields: [
        {
          name: "business_name",
          label: "Nombre del negocio",
          type: "text",
          required: true,
          validate: "alphanumeric",
        },
        {
          name: "phone",
          label: "Telefono",
          type: "text",
          required: true,
          validate: "phone",
        },
        {
          name: "food_type",
          label: "Tipo de comida",
          type: "autocomplete-multiple",
          options: foodTypes,
          required: true,
        },
        {
          name: "has_delivery",
          label: "¿Ofrece servicio a domicilio?",
          type: "switch",
          required: false,
        },
        {
          name: "logo_url",
          label: "Logo del negocio",
          type: "image",
          required: true,
        },
      ],
    },
    {
      label: "Horarios",
      fields: [
        {
          name: "schedule",
          type: "schedule",
          required: true,
        },
      ],
    },
    {
      label: "Ubicación",
      fields: [
        {
          name: "locale",
          label: "Ubicación en mapa",
          type: "map",
          required: true,
        },
      ],
    },
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    steps[currentTab].fields.forEach((field) => {
      const val = formValues[field.name];
      if (
        (field.type === "text" || field.type === "password") &&
        (!val || val.trim() === "")
      ) {
        newErrors[field.name] = true;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const getUploadImage = async (file) => {
    try {
      const response = await uploadAPI.uploadImage(file);
      if (response.data.success) {
        const upload = response.data.data;
        return { success: true, nameLogo: upload.filename };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: "Error al subir la imagen" };
    }
  };

  const getBusinessRegister = async (data) => {
    try {
      const response = await businessAPI.create(data);
      if (response.data.success) {
        setSubmitted(true);
        return;
      }
      <Snackbar
        open={true}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="danger" variant="filled" sx={{ width: "100%" }}>
          {response.data.message}
        </Alert>
      </Snackbar>;
      setTimeout(() => {
        navigate("/explorar");
      }, 2000);
    } catch (error) {
      console.error("Token validation failed:", error);
    }
  };

  const nextPrev = async (n) => {
    if (n === 1 && !validateForm()) return;

    const nextTab = currentTab + n;

    if (nextTab >= steps.length) {
      console.log("Guardando en BD:", formValues);
      const { logo_url, ...values } = formValues;

      let logoName = "";
      if (logo_url) {
        const resultUpload = await getUploadImage(logo_url);
        if (!resultUpload.success) {
          <Snackbar
            open={true}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="danger" variant="filled" sx={{ width: "100%" }}>
              {resultUpload.error}
            </Alert>
          </Snackbar>;
          return;
        }
        logoName = resultUpload.nameLogo;
      }
      const data = {
        id: user?.id,
        logo_url: logoName,
        ...values,
      };
      getBusinessRegister(data);

      return;
    }

    setCurrentTab(nextTab);
  };

  if (submitted) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Card sx={{ width: "100%", maxWidth: 500 }}>
          <CardContent>
            <Result
              status="success"
              title="¡Registro exitoso!"
              subTitle="Tu negocio se ha registrado correctamente."
              extra={[
                <Button
                  key="dashboard"
                  type="primary"
                  onClick={() => navigate("/owner")}
                >
                  Administrar mi negocio
                </Button>,
              ]}
            />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <GeneralContent title={"Negocio"}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: isMobile() ? 1 : 3,
          px: 2,
          py: 0,
        }}
      >
        <Paper
          sx={{
            mt: 2,
            mb: 2,
            maxWidth: 450,
            width: "100%",
            p: 2,
            borderRadius: 3,
          }}
          elevation={6}
        >
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
                <Box
                  key={step.label}
                  sx={{
                    width: `${100 / steps.length}%`,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    paddingRight: 2,
                  }}
                >
                  <Fade in={index === currentTab} timeout={500} unmountOnExit>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, textAlign: "center" }}
                      >
                        {step.label}
                      </Typography>

                      {step.fields.map((field) => (
                        <FormField
                          key={field.name}
                          field={field}
                          formValues={formValues}
                          setFormValues={setFormValues}
                        />
                      ))}
                    </Box>
                  </Fade>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 3,
            }}
          >
            {currentTab > 0 && (
              <Button onClick={() => nextPrev(-1)}>Anterior</Button>
            )}
            <Button onClick={() => nextPrev(1)}>
              {currentTab === steps.length - 1 ? "Enviar" : "Siguiente"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            {steps.map((_, index) => {
              const isFinished =
                index < currentTab &&
                steps[index].fields.every(
                  (f) =>
                    formValues[f.name] &&
                    formValues[f.name].toString().trim() !== ""
                );

              let stepColor;
              if (index === currentTab) stepColor = "#1976d2";
              else if (isFinished) stepColor = "#04AA6D";
              else stepColor = "#bbbbbb";

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
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      </Box>
    </GeneralContent>
  );
};

export default RegisterBusiness;
