import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Bg from "@Assets/images/qscome-bg-6.png";
import HeaderImg from "@Assets/images/qscome-header-1.png";
import { useNavigate } from "react-router-dom";
import { isMobile } from "@Utils/commons";
import RegisterBusiness from "./RegisterBusiness";
import useAuth from "@Context/AuthContext";

const CallToAction = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isAuthenticated ? (
        <RegisterBusiness />
      ) : (
        <>
          <img
            src={HeaderImg}
            style={{ position: "absolute", top: "0", width: "auto" }}
            alt=""
          />
          <Box
            sx={{
              mt: isMobile() ? 31 : 30,
              position: "relative",
              maxWidth: 700,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 0,
              textAlign: "center",
            }}
          >
            <Paper
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.70)",

                color: "primary",
                m: 2,
                p: 4,
                borderRadius: 4,
              }}
              elevation={5}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                ¡Haz que todos encuentren tu negocio!
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Registrate</strong> y destaca en nuestra página
              </Typography>
              <Typography variant="body1" gutterBottom>
                ¡No dejes que te busquen y no te encuentren!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  transform: "scale(1)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
                onClick={() => {
                  navigate("/login/registro");
                }}
              >
                Registrar mi local
              </Button>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CallToAction;
