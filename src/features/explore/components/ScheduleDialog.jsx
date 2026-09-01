import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@mui/material";
import useScheduleDialogPresentation from "../hooks/useScheduleDialogPresentation";
import ScheduleDialogHeader from "./ScheduleDialogHeader";
import ScheduleList from "./ScheduleList";

const ScheduleDialog = ({ open, onClose, data }) => {
  const presentation = useScheduleDialogPresentation(data);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4.5,
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,.96)",
          boxShadow: "0 30px 85px rgba(0,0,0,.22)",
          border: "1px solid rgba(255,255,255,.72)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(7px)", bgcolor: "rgba(17,17,17,.42)" },
        },
      }}
    >
      <ScheduleDialogHeader presentation={presentation} onClose={onClose} />
      <DialogContent sx={{ px: 2.1, pt: 2.2, pb: 2.4 }}>
        <ScheduleList rows={presentation.rows} />
      </DialogContent>
    </Dialog>
  );
};

ScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string,
    open: PropTypes.bool,
    logo: PropTypes.string,
    coverImage: PropTypes.string,
    schedules: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default ScheduleDialog;
