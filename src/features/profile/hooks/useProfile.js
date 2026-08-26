import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useUpdateUsersMutation } from "@Features/users/api/users.api";

export const useProfile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [updateUserMutation] = useUpdateUsersMutation();

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
      if (!user?.id) throw new Error("Usuario no disponible");

      setLoading(true);
      setError("");
      setSuccess("");

      await updateUserMutation({
        id: user.id,
        body: {
          name: formData.name,
          phone: formData.phone,
        },
      }).unwrap();

      const refreshResult = await refreshUser();
      if (refreshResult?.success === false) {
        throw new Error(refreshResult.error || "No se pudo refrescar el perfil");
      }

      setSuccess("Perfil actualizado exitosamente");
      setEditMode(false);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Error al actualizar el perfil");
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
