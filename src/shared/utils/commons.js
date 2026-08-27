import { notification } from "antd";

const openNotification = () => {
  notification.info({
    message: "Alerta",
    description: "Solo disponible en dispositivos móviles",
  });
};

export const isMobile = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

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
    groups.push(lista.slice(i, i + limited));
  }
  return groups;
};

export const isEmpty = () => {};
