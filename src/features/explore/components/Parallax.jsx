import { Box } from "@mui/material";

const Parallax = ({ bg, children, stx }) => (
  <Box
    component="section"
    sx={{
      position: "relative",
      overflow: "hidden",
      backgroundImage: `linear-gradient(rgba(28,26,23,.56), rgba(28,26,23,.56)), url(${bg})`,
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
