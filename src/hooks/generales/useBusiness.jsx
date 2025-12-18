import { useState, useEffect } from 'react';
import { businessAPI, handleApiError } from '@Services/apiService';

export const useBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await businessAPI.getAll();
      
      if (response.data.success) {
        // Transformar datos al formato esperado por los componentes
        const formattedData = response.data.data.map(business => ({
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
          menu: [] // Se carga bajo demanda
        }));
        
        setBusinesses(formattedData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error loading businesses:', err);
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // Fallback a localStorage si falla la API
      const cachedData = localStorage.getItem('qscome_businesses');
      if (cachedData) {
        try {
          setBusinesses(JSON.parse(cachedData));
        } catch (parseError) {
          console.error('Error parsing cached data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessMenu = async (businessId) => {
    try {
      const response = await businessAPI.getMenu(businessId);
      
      if (response.data.success) {
        const menuData = response.data.data;
        
        // Actualizar el negocio con su menú
        setBusinesses(prev => prev.map(b => 
          b.id === businessId ? { ...b, menu: menuData } : b
        ));
        
        return menuData;
      }
    } catch (err) {
      console.error('Error loading menu:', err);
      return [];
    }
  };

  const refreshBusinesses = () => {
    loadBusinesses();
  };

  return {
    businesses,
    loading,
    error,
    loadBusinessMenu,
    refreshBusinesses
  };
};

export default useBusiness;