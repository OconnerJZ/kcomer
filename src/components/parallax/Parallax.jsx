import { Box } from "@mui/material";
import PropTypes from "prop-types";

const Parallax = ({ bg, children, stx }) => {
  return (
    <Box
      component="div"
      className="parallax"
      sx={{
        backgroundImage: `url(${bg})`,
        ...stx
      }}
    >
      {children}
    </Box>
  );
};

Parallax.propTypes = {
  bg: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export default Parallax;
