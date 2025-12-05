import { Segmented } from "antd";
import { useState } from "react";
import RegisterBusiness from "./RegisterBusiness";
import GeneralContent from "@Components/layout/GeneralContent";
import { Box } from "@mui/material";
import Login from "./Login";


const Register = () => {
  const [option, setOption] = useState("user");
  const handleSegmented = (value) => {
    setOption(value);
  };
  return (
    <GeneralContent title={"Registro"}>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Segmented
          onChange={(value) => {
            handleSegmented(value);
          }}
          options={[
            { label: "Usuario", value: "user" },
            { label: "Negocio", value: "business" },
          ]}
        />
        {option == "user" && <Login />}
        {option == "business" && <RegisterBusiness />}
      </Box>
    </GeneralContent>
  );
};

export default Register;
