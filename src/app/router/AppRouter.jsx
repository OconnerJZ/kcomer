import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import AppLayout from "@App/layout/AppLayout";
import ScrollToTop from "@Shared/components/navigation/ScrollToTop";

const Explorar = lazy(() => import("@Features/explore/pages/ExplorePage"));
const Nosotros = lazy(() => import("@Features/about/pages/AboutPage"));
const Login = lazy(() => import("@Features/auth/pages/Login"));
const Pedidos = lazy(() => import("@Features/checkout/pages/CheckoutPage"));
const MisOrdenes = lazy(() => import("@Features/orders/pages/MyOrders"));
const Perfil = lazy(() => import("@Features/profile/pages/ProfilePage"));
const LandingRegister = lazy(() => import("@Features/owner/pages/OwnerRegistrationLanding"));
const RegisterBusiness = lazy(() => import("@Features/owner/pages/RegisterBusiness"));
const OwnerDashboard = lazy(() => import("@Features/owner/pages/OwnerDashboard"));
const BusinessInvitation = lazy(() => import("@Features/owner/pages/BusinessInvitation"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return children;
};

const routes = [
  { path: "explorar", element: <Explorar /> },
  { path: "nosotros", element: <Nosotros /> },
  { path: "registro", element: <LandingRegister /> },
  { path: "crear-negocio", element: <RegisterBusiness />, isProtected: true },
  { path: "perfil", element: <Perfil />, isProtected: true },
  { path: "orden", element: <Pedidos />, isProtected: true },
  { path: "mis-ordenes", element: <MisOrdenes />, isProtected: true },
  { path: "owner", element: <OwnerDashboard />, isProtected: true },
  { path: "business-invitations", element: <BusinessInvitation />, isProtected: true },
  { path: "business-invitations/:token", element: <BusinessInvitation />, isProtected: true },
];

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="explorar" replace />} />
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.isProtected ? <ProtectedRoute>{route.element}</ProtectedRoute> : route.element} />
            ))}
          </Route>
          <Route path="/login/:from?" element={<Login />} />
          <Route path="*" element={<Navigate to="/explorar" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
