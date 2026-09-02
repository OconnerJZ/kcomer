import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@Features/auth/context/useAuth";
import { useUpdateUsersMutation } from "@Features/users/api/users.api";
import { toUserUpdatePayload } from "@Features/users/model/user";

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

  useEffect(() => {
    if (editMode) return;
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [editMode, user?.name, user?.phone]);

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
        body: toUserUpdatePayload(formData),
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
