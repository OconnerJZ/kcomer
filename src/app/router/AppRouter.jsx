import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
const OwnerDashboard = lazy(() => import("@Features/owner/pages/OwnerDashboard"));

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login/orden" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/explorar" replace />;
  return children;
};

const routes = [
  { path: "explorar", element: <Explorar /> },
  { path: "nosotros", element: <Nosotros /> },
  { path: "registro", element: <LandingRegister /> },
  { path: "perfil", element: <Perfil />, isProtected: true },
  { path: "orden", element: <Pedidos />, isProtected: true },
  { path: "mis-ordenes", element: <MisOrdenes />, isProtected: true },
  { path: "owner", element: <OwnerDashboard />, isProtected: true },
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
              <Route
                key={route.path}
                path={route.path}
                element={route.isProtected ? (
                  <ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>
                ) : route.element}
              />
            ))}
          </Route>
          <Route path="/login/:from?" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
