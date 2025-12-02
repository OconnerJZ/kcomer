import SEO from "@Components/SEO";
import { Box } from "@mui/material";

const GeneralContent = ({ children, title, url, description, image, type }) => {
  return (
    <Box component="div">
      <SEO
        title={title}
        url={url}
        description={description}
        image={image}
        type={type}
      />
      {children}
    </Box>
  );
};

export default GeneralContent;
