import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "@Components/layout/Layout";
import ScrollToTop from "@Components/ScrollToTop";
import { useAuth } from "@Context/AuthContext";
import { lazy } from "react";

const Explorar = lazy(() => import("@Pages/Explorar"));
const Nosotros = lazy(() => import("@Pages/Nosotros"));
const Pedidos = lazy(() => import("@Pages/Pedidos"));
const Login = lazy(() => import("@Pages/Login"));
const MisOrdenes = lazy(() => import("@Pages/MisOrdenes"));
const Perfil = lazy(() => import("@Pages/Perfil"));
const LandingRegister = lazy(() => import("@Pages/LandingRegister"));
const OwnerDashboard = lazy(() => import("@Pages/OwnerDashboard"));

// `roles` es opcional: si se pasa, restringe la ruta a esos roles.
// Ej. para una ruta exclusiva de admin: { path: "admin", roles: OWNER_ROLES }.
// Nota: /owner se deja SIN roles a propósito, porque también es la puerta de
// entrada para que un cliente registre su negocio (ver OwnerDashboard).
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login/orden" replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/explorar" replace />;
  }
  return children;
};

const Router = () => {
  const routes = [
    { path: "explorar", element: <Explorar />, isProtected: false },
    { path: "nosotros", element: <Nosotros />, isProtected: false },
    { path: "registro", element: <LandingRegister />, isProtected: false },
    { path: "login/:from?", element: <Login />, isProtected: false },
    { path: "perfil", element: <Perfil />, isProtected: true },
    { path: "orden", element: <Pedidos />, isProtected: true },
    { path: "mis-ordenes", element: <MisOrdenes />, isProtected: true },
    { path: "owner", element: <OwnerDashboard />, isProtected: true },
  ];

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/explorar" replace />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute roles={route.roles}>
                    {route.element}
                  </ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;