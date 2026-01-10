import { useState, useEffect, useCallback, useMemo } from "react";
import { businessAPI, handleApiError } from "@Api";

const STORAGE_KEY = "qscome_businesses";

const formatBusiness = (business) => ({
  id: business.id,
  title: business.title,
  urlImage: business.urlImage,
  isOpen: business.isOpen,
  likes: business.likes || 0,
  hasDelivery: business.hasDelivery,
  tags: business.tags || [],
  emails: business.emails || [],
  phones: business.phones || [],
  social: business.social || {},
  prepTimeMin: business.prepTimeMin,
  estimatedDeliveryMin: business.estimatedDeliveryMin,
  schedule: business.schedule || {},
  menu: [],
});

const saveToCache = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadFromCache = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const useBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await businessAPI.getAll();

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const formatted = response.data.data.map(formatBusiness);
      setBusinesses(formatted);
      saveToCache(formatted);
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      setBusinesses(loadFromCache());
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBusinessMenu = async (businessId) => {
    try {
      const response = await businessAPI.getMenu(businessId);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const menu = response.data.data;

      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessId ? { ...b, menu } : b))
      );

      return menu;
    } catch (err) {
      console.error("Error loading menu:", err);
      return [];
    }
  };

  const getBusinessById = useCallback(
    (businessId) => {
      return businesses.find((b) => b.id === businessId) || null;
    },
    [businesses]
  );

  const menuHelpers = useMemo(
    () => ({
      isMenuLoaded: (businessId) => {
        const business = getBusinessById(businessId);
        return business && business.menu && business.menu.length > 0;
      }
    }),
    [getBusinessById]
  );

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  return {
    businesses,
    loading,
    error,
    menuHelpers,
    loadBusinessMenu,
    refreshBusinesses: loadBusinesses,
    getBusinessById
  };
};

export default useBusiness;
