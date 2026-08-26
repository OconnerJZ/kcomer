import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";

export const useProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await updateUser({
        name: formData.name,
        phone: formData.phone,
      });

      if (result?.success === false) {
        throw new Error(result.error || "Error al actualizar el perfil");
      }

      setSuccess("Perfil actualizado exitosamente");
      setEditMode(false);
    } catch (err) {
      setError(err?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  return {
    user,
    editMode,
    setEditMode,
    logoutDialogOpen,
    setLogoutDialogOpen,
    formData,
    loading,
    error,
    setError,
    success,
    setSuccess,
    handleChange,
    handleSave,
    handleLogout,
    navigate,
  };
};

export default useProfile;
