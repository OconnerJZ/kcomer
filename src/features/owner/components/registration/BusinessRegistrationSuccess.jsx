import PropTypes from "prop-types";
import { Box, Button, Paper } from "@mui/material";
import { Result } from "antd";

const BusinessRegistrationSuccess = ({ ownerReady, onContinue }) => (
  <Box sx={{ minHeight: 420, display: "grid", placeItems: "center", px: 2 }}>
    <Paper
      elevation={0}
      sx={{
        maxWidth: 520,
        p: 2,
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Result
        status="success"
        title="¡Tu negocio ya está en Kcomer!"
        subTitle="Ahora puedes completar su menú, portada y configuración desde el panel."
        extra={(
          <Button variant="contained" onClick={onContinue}>
            {ownerReady ? "Administrar negocio" : "Continuar"}
          </Button>
        )}
      />
    </Paper>
  </Box>
);

BusinessRegistrationSuccess.propTypes = {
  ownerReady: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default BusinessRegistrationSuccess;
