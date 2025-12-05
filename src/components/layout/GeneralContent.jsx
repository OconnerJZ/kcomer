
import { Box } from "@mui/material";

const GeneralContent = ({ children, title, url, description, image, type }) => {
  return (
    <Box component="div">
      {children}
    </Box>
  );
};

export default GeneralContent;
