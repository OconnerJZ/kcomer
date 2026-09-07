export const ADMIN_MODULE_STATUS = Object.freeze({
  READY: "ready",
  PLANNED: "planned",
});

export const ADMIN_MODULES = Object.freeze([
  {
    id: "overview",
    label: "Resumen",
    shortLabel: "Inicio",
    path: "/admin",
    icon: "dashboard",
    section: "Plataforma",
    status: ADMIN_MODULE_STATUS.READY,
    description: "Vista inicial del Admin Control Center.",
  },
  {
    id: "businesses",
    label: "Negocios",
    shortLabel: "Negocios",
    path: "/admin/businesses",
    icon: "businesses",
    section: "Plataforma",
    status: ADMIN_MODULE_STATUS.READY,
    description: "Administración global de negocios, propietarios y estado de plataforma.",
  },
  {
    id: "users",
    label: "Usuarios",
    shortLabel: "Usuarios",
    path: "/admin/users",
    icon: "users",
    section: "Plataforma",
    status: ADMIN_MODULE_STATUS.READY,
    description: "Gestión global de usuarios, roles, membresías y bloqueos de cuenta.",
  },
  {
    id: "plans",
    label: "Planes & Trials",
    shortLabel: "Planes",
    path: "/admin/plans",
    icon: "plans",
    section: "Comercial",
    status: ADMIN_MODULE_STATUS.READY,
    description: "Consulta y asignación de planes base y periodos de prueba.",
  },
  {
    id: "features",
    label: "Feature Control",
    shortLabel: "Features",
    path: "/admin/features",
    icon: "features",
    section: "Comercial",
    status: ADMIN_MODULE_STATUS.PLANNED,
    description: "Controles globales, por plan y por negocio para funciones operativas.",
  },
  {
    id: "marketing",
    label: "Marketing & Ads",
    shortLabel: "Marketing",
    path: "/admin/marketing",
    icon: "marketing",
    section: "Operación",
    status: ADMIN_MODULE_STATUS.PLANNED,
    description: "Moderación y operación administrativa de Marketing y qsCome Ads.",
  },
  {
    id: "payments",
    label: "Pagos",
    shortLabel: "Pagos",
    path: "/admin/payments",
    icon: "payments",
    section: "Operación",
    status: ADMIN_MODULE_STATUS.PLANNED,
    description: "Auditoría de evidencias y aclaraciones de pago.",
  },
  {
    id: "health",
    label: "Platform Health",
    shortLabel: "Health",
    path: "/admin/health",
    icon: "health",
    section: "Sistema",
    status: ADMIN_MODULE_STATUS.PLANNED,
    description: "Estado de API, base de datos, storage y realtime.",
  },
  {
    id: "audit",
    label: "Auditoría",
    shortLabel: "Auditoría",
    path: "/admin/audit",
    icon: "audit",
    section: "Sistema",
    status: ADMIN_MODULE_STATUS.PLANNED,
    description: "Trazabilidad de acciones administrativas sensibles.",
  },
]);

export const ADMIN_SECTIONS = Object.freeze([
  "Plataforma",
  "Comercial",
  "Operación",
  "Sistema",
]);

export const getAdminModuleForPath = (pathname = "/admin") => {
  const normalized = pathname !== "/admin" && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  return ADMIN_MODULES.find((module) => (
    module.path === normalized ||
    (module.path !== "/admin" && normalized.startsWith(`${module.path}/`))
  )) || ADMIN_MODULES[0];
};

export const getAdminModulesBySection = () => ADMIN_SECTIONS.map((section) => ({
  section,
  modules: ADMIN_MODULES.filter((module) => module.section === section),
}));
