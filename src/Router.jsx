// src/Router.jsx
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "@Components/layout/Layout";
import Explorar from "@Pages/Explorar";
import Nosotros from "@Pages/Nosotros";
import RegisterBusiness from "@Pages/RegisterBusiness";
import ScrollToTop from "@Components/ScrollToTop";
import Pedidos from "@Pages/Pedidos";
import Login from "@Pages/Login";
import MisOrdenes from "@Pages/MisOrdenes";
import BusinessDashboard from "@Pages/BusinessDashboard";
import Perfil from "@Pages/Perfil";
import { useAuth } from "@Context/AuthContext";
import LandingRegister from "@Pages/LandingRegister";
import OwnerDashboard from "@Pages/OwnerDashboard";
import OwnerMenu from "@Pages/OwnerMenu";
import OwnerReports from "@Pages/OwnerReports";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/orden" replace />;
  }

  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/explorar" replace />} />
          <Route path="explorar" element={<Explorar />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="registro" element={<LandingRegister />} />
          <Route path="/login/:from?" element={<Login />} />
          {/* Rutas protegidas */}
          <Route
            path="perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="orden"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />

          <Route
            path="mis-ordenes"
            element={
              <ProtectedRoute>
                <MisOrdenes />
              </ProtectedRoute>
            }
          />

          <Route
            path="business-dashboard"
            element={
              
                <BusinessDashboard />
              
            }
          />
          <Route
            path="owner"
            element={
          
                <OwnerDashboard />
              
            }
          />
          <Route
            path="owner-menu"
            element={
          
                <OwnerMenu />
              
            }
          />
          <Route
            path="owner-r"
            element={
          
                <OwnerReports />
              
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;