import { notification } from "antd";

const openNotification = () => {
  notification.info({
    message: "Alerta",
    description: "Solo disponible en dispositivos móviles",
  });
};

export const calls = (numeroTelefono) => {
  const esDispositivoMovil =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (esDispositivoMovil) {
    window.location.href = `tel:${numeroTelefono}`;
  } else {
    openNotification();
  }
};

export const sendEmail = (direccionCorreo) => {
  window.location.href = `mailto:${direccionCorreo}`;
};

export const separateByGroups = ({ lista = [], limited = 3 }) => {
  const groups = [];
  for (let i = 0; i < lista.length; i += limited) {
    const subList = lista.slice(i, i + limited);
    groups.push(subList);
  }
  return groups;
};
