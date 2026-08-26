import CardPlaceRedes from "@Features/explore/components/CardPlaceRedes";
import { Diversity3, Email, Smartphone } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Tag } from "antd";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { calls, sendEmail } from "@Shared/utils/commons";

const emails = (values = []) => values.map((email) => (
  <List key={email} dense sx={{ py: 0 }}>
    <ListItem sx={{ py: 0, px: 0 }} secondaryAction={<IconButton edge="end" onClick={() => sendEmail(email)}><ForwardToInboxIcon sx={{ fontSize: "19px" }} /></IconButton>}>
      <ListItemText sx={{ my: 0.25 }} primary={<Tag style={{ fontSize: "13.5px" }}>{email}</Tag>} />
    </ListItem>
  </List>
));

const phones = (values = []) => values.map((phone) => (
  <List key={phone} dense sx={{ py: 0 }}>
    <ListItem sx={{ py: 0, px: 0 }} secondaryAction={<IconButton edge="end" onClick={() => calls(phone)}><CallIcon sx={{ fontSize: "19px" }} /></IconButton>}>
      <ListItemText sx={{ my: 0 }} primary={<Tag style={{ fontSize: "13.5px" }}>{phone}</Tag>} />
    </ListItem>
  </List>
));

const useCardPlaceAccordion = ({ datacard }) => ({
  data: [
    { label: "Redes Sociales", icon: <Diversity3 style={{ fontSize: "23px" }} />, color: "primary", details: <CardPlaceRedes datacard={datacard} />, defaultExpanded: false },
    { label: "Teléfono", icon: <Smartphone style={{ fontSize: "23px" }} />, color: "success", details: phones(datacard?.phones), defaultExpanded: false },
    { label: "Correo electrónico", icon: <Email style={{ fontSize: "23px" }} />, color: "danger", details: emails(datacard?.emails), defaultExpanded: false },
  ],
});

export default useCardPlaceAccordion;
