import { forwardRef } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RegisterBusiness from "../../pages/RegisterBusiness";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BusinessRegistrationDialog = ({ open, onClose, onCreated }) => (
  <Dialog fullScreen open={open} onClose={onClose} slots={{ transition: Transition }}>
    <AppBar sx={{ position: "relative" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="Cerrar registro">
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Registrar negocio
        </Typography>
      </Toolbar>
    </AppBar>
    <RegisterBusiness onSuccess={onCreated} />
  </Dialog>
);

BusinessRegistrationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default BusinessRegistrationDialog;
