import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import { Result } from "antd";
import "antd/dist/reset.css"; // Importar estilos de AntD
import FormField from "@Components/FormField";
import { useNavigate } from "react-router-dom";
import GoogleMapCanvas from "./GoogleMapCanvas";
import GeneralContent from "@Components/layout/GeneralContent";

const RegisterBusiness = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Nuevo estado para mostrar Result
  const navigate = useNavigate();

  const steps = [
    {
      label: "Datos del propietario",
      fields: [
        {
          name: "owner_name",
          label: "Nombre completo",
          type: "text",
          required: true,
          validate: "alphabetic",
        },
        {
          name: "owner_email",
          label: "Correo electrónico",
          type: "text",
          required: true,
        },
        {
          name: "owner_phone",
          label: "Teléfono",
          type: "text",
          required: true,
          validate: "phone",
        },
      ],
    },

    {
      label: "Datos del negocio",
      fields: [
        {
          name: "business_name",
          label: "Nombre del negocio",
          type: "text",
          required: true,
        },
        {
          name: "business_description",
          label: "Descripción breve",
          type: "text",
          required: true,
        },
        {
          name: "food_type",
          label: "Tipo de comida",
          type: "autocomplete",
          options: ["Tacos", "Hamburguesas", "Pizza", "Postres", "Café"],
          required: true,
        },
        {
          name: "business_photo",
          label: "Foto del negocio",
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
          label: "Horarios del negocio",
          type: "schedule",
          required: true,
        },
      ],
    },
    {
      label: "Ubicación",
      fields: [
        { name: "address", label: "Dirección", type: "text", required: true },
        { name: "city", label: "Ciudad", type: "text", required: true },
        {
          name: "postal_code",
          label: "Código postal",
          type: "text",
          required: true,
        },
        {
          name: "map_location",
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

  const nextPrev = (n) => {
    if (n === 1 && !validateForm()) return;

    const nextTab = currentTab + n;

    if (nextTab >= steps.length) {
      // Simular guardado en BD
      console.log("Guardando en BD:", formValues);
      setSubmitted(true); // Mostrar Result
      return;
    }

    setCurrentTab(nextTab);
  };

  if (submitted) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Card sx={{ width: "100%", maxWidth: 500 }}>
          <CardContent>
            <Result
              status="success"
              title="Registration Successful!"
              subTitle="Your business has been registered successfully."
              extra={[
                <Button
                  key="dashboard"
                  type="primary"
                  onClick={() => navigate("/explorar")}
                >
                  Go to Dashboard
                </Button>,
              ]}
            />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <GeneralContent title={"Registro"}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Card sx={{ width: "100%", maxWidth: 500, overflow: "hidden" }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
              Register
            </Typography>

            <Box
              sx={{ width: "100%", overflow: "hidden", position: "relative" }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: `${steps.length * 100}%`,
                  transform: `translateX(-${
                    (currentTab * 100) / steps.length
                  }%)`,
                  transition: "transform 0.5s ease",
                }}
              >
                {steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: `${100 / steps.length}%`,
                      flexShrink: 0,
                      boxSizing: "border-box",
                      paddingRight: 2,
                    }}
                  >
                    <Fade in={index === currentTab} timeout={500} unmountOnExit>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {step.label}:
                        </Typography>

                        {step.fields.map((field) => (
                          <FormField
                            key={field.name}
                            field={field}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            error={errors[field.name]}
                            helperText={
                              errors[field.name]
                                ? "Este campo es requerido"
                                : ""
                            }
                            validate={field.validate}
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
                <Button onClick={() => nextPrev(-1)}>Previous</Button>
              )}
              <Button onClick={() => nextPrev(1)}>
                {currentTab === steps.length - 1 ? "Submit" : "Next"}
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
            <GoogleMapCanvas
              apiKey={"AIzaSyBiGoKFBRAGYJlOGYP0cUdxZXxE3qCIeV0"}
            />
          </CardContent>
        </Card>
      </Box>
    </GeneralContent>
  );
};

export default RegisterBusiness;
