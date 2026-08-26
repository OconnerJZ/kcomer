import { Box } from "@mui/material";

const Parallax = ({ bg, children, stx }) => (
  <Box
    component="section"
    sx={{
      position: "relative",
      overflow: "hidden",
      backgroundImage: `linear-gradient(180deg, rgba(15,15,15,.18) 0%, rgba(15,15,15,.58) 100%), url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: { md: "fixed" },
      ...stx,
    }}
  >
    {children}
  </Box>
);

export default Parallax;
