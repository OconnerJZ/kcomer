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
import { useAuth } from "@Context/AuthContext";
import Register from "@Pages/Register";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
          <Route path="registro" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Rutas protegidas */}
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
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
