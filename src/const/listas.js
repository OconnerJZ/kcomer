const urls = [
  "https://img.freepik.com/vector-gratis/comida-bebida-logo-comida-sana-plana-dibujada-mano_23-2149632256.jpg?w=2000",
  "https://dcassetcdn.com/design_img/6165/17990/17990_139608_6165_image.jpg",
  "https://img.freepik.com/fotos-premium/diseno-grafico-ilustraciones_924318-14309.jpg?w=2000",
  "https://img.freepik.com/vector-premium/diseno-logotipo-comida-mexicana-santiago_908365-131.jpg?w=1060",
];
export const datacards = [
  {
    id: 1,
    urlImage: urls[2],
    title: "Tacos el pariente",
    emails: ["bryantsamuel.jaramillo@bbva.com", "bryantjz95@gmail.com"],
    phones: ["7223983673"],
    social: {
      facebook: "",
      instagram: "",
      whats: "",
    },
    tags: [
      { label: "A 500m", color: "info" },
      { label: "Comida Italiana", color: "warning" },
      { label: "$70.00 - $500.00", color: "secondary" },
    ],
    isOpen: true,
  },
  {
    id: 2,
    urlImage: urls[0],
    title: "Tamales Martinez",
    emails: ["tamalitos@gmail.com"],
    phones: ["7223983673"],
    social: {
      facebook: "",
      instagram: "",
      whats: "",
    },
    tags: [
      { label: "A 200m", color: "info" },
      { label: "Comida Ambulante", color: "warning" },
      { label: "$10.00 - $50.00", color: "secondary" },
    ],
    isOpen: true,
  },
  {
    id: 3,
    urlImage: urls[1],
    title: "Casa Brava",
    emails: ["casabrava@gmail.com"],
    phones: ["7223983673"],
    social: {
      facebook: "",
      instagram: "",
      whats: "https://api.whatsapp.com/send?phone=5217223983673&text=Hola%2C%20tienen%20servicio.%3F%20",
    },
    tags: [
      { label: "A 430m", color: "info" },
      { label: "Comida urbana", color: "warning" },
      { label: "$50.00 - $300.00", color: "secondary" },
    ],
    isOpen: false,
  },
  {
    id: 4,
    urlImage: urls[3],
    title: "Casona de los abuelos",
    emails: ["casadelosabuelos@gmail.com"],
    phones: ["7223983673"],
    social: {
      facebook: "",
      instagram: "",
      whats: "",
    },
    tags: [
      { label: "A 100m", color: "info" },
      { label: "Comida Ambulante", color: "warning" },
      { label: "$30.00 - $300.00", color: "secondary" },
    ],
    isOpen: true,
  },
];
