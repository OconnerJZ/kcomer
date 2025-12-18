// src/hooks/components/useGeolocation.jsx
import { mapsService } from '@Services/mapsService';
import { useEffect, useState } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const coords = await mapsService.getCurrentLocation();
        setLocation(coords);
        
        const geocodeData = await mapsService.reverseGeocode(coords);
        if (geocodeData) {
          setAddress(geocodeData.formatted_address);
        }
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return { location, error, address };
};

export default useGeolocation;