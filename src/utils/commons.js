import { axiosGet } from "@Config/axios/methodRequest";
import { notification } from "antd";
import { API_KEY_MAPS } from "./enviroments";

const openNotification = () => {
  notification.info({
    message: "Alerta",
    description: "Solo disponible en dispositivos móviles",
  });
};

export const isMobile = () => {
  const esDispositivoMovil =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return esDispositivoMovil
}

export const calls = (numeroTelefono) => {
  if (isMobile()) {
    globalThis.location.href = `tel:${numeroTelefono}`;
    return;
  }
  openNotification();
};

export const sendEmail = (direccionCorreo) => {
  globalThis.location.href = `mailto:${direccionCorreo}`;
};

export const separateByGroups = ({ lista = [], limited = 3 }) => {
  const groups = [];
  for (let i = 0; i < lista.length; i += limited) {
    const subList = lista.slice(i, i + limited);
    groups.push(subList);
  }
  return groups;
};

