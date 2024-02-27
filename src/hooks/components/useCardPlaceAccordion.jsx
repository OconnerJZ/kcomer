import CardPlaceRedes from "@Components/card/CardPlaceRedes";
import { Diversity3, Email, Smartphone } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Tag } from "antd";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { calls, sendEmail } from "@Utils/commons";
const emails = (emails) => {
  const mail = emails.map((email) => (
    <List key={email} dense sx={{ paddingTop: 0, paddingBottom: 0 }}>
      <ListItem
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => sendEmail(email)}
          >
            <ForwardToInboxIcon sx={{ fontSize: "19px" }} />
          </IconButton>
        }
      >
        <ListItemText
          sx={{ marginTop: 0, marginBottom: 0.25 }}
          primary={
            <Tag style={{ fontSize: "13.5px" }} key={email}>
              {email}
            </Tag>
          }
        />
      </ListItem>
    </List>
  ));
  return mail;
};

const phones = (phones) => {
  const phone = phones.map((phone) => (
    <List key={phone} dense sx={{ paddingTop: 0, paddingBottom: 0 }}>
      <ListItem
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => calls(phone)}
          >
            <CallIcon sx={{ fontSize: "19px" }} />
          </IconButton>
        }
      >
        <ListItemText
          sx={{ marginTop: 0, marginBottom: 0 }}
          primary={
            <Tag style={{ fontSize: "13.5px" }} key={phone}>
              {phone}
            </Tag>
          }
        />
      </ListItem>
    </List>
  ));
  return phone;
};

const useCardPlaceAccordion = ({ datacard }) => {
  const data = [
    {
      label: "Correo electrónico",
      icon: <Email style={{ fontSize: "23px" }} />,
      color: "primary",
      details: emails(datacard?.emails),
      defaultExpanded: false,
    },
    {
      label: "Teléfono",
      icon: <Smartphone style={{ fontSize: "23px" }} />,
      color: "success",
      details: phones(datacard?.phones),
      defaultExpanded: false,
    },
    {
      label: "Redes Sociales",
      icon: <Diversity3 style={{ fontSize: "23px" }} />,
      color: "danger",
      details: <CardPlaceRedes />,
      defaultExpanded: false,
    },
  ];
  return { data };
};

export default useCardPlaceAccordion;
