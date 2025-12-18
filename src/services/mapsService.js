// src/services/mapsService.js - SERVICIO CENTRALIZADO CON CACHE
import { API_KEY_MAPS } from '@Utils/enviroments';

class MapsService {
  constructor() {
    this.cache = new Map();
    this.geocodeCache = new Map();
    this.loadPromise = null;
    this.isLoaded = false;
  }

  /**
   * Carga Google Maps una sola vez (Singleton)
   * Evita múltiples cargas = AHORRO MASIVO
   */
  async loadGoogleMaps() {
    // Si ya está cargado, retornar inmediatamente
    if (this.isLoaded && window.google?.maps) {
      console.log('✅ Google Maps ya estaba cargado');
      return window.google.maps;
    }

    // Si ya hay una carga en proceso, esperar a que termine
    if (this.loadPromise) {
      console.log('⏳ Esperando carga de Google Maps en proceso...');
      return this.loadPromise;
    }

    console.log('🔄 Iniciando carga de Google Maps...');

    this.loadPromise = new Promise((resolve, reject) => {
      // Verificar si ya existe el script
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );

      if (existingScript) {
        console.log('📜 Script de Google Maps ya existe, esperando carga...');
        
        // Si el script ya existe pero window.google no está listo
        if (window.google?.maps) {
          this.isLoaded = true;
          resolve(window.google.maps);
          return;
        }

        existingScript.addEventListener('load', () => {
          this.isLoaded = true;
          console.log('✅ Google Maps cargado desde script existente');
          resolve(window.google.maps);
        });
        
        existingScript.addEventListener('error', () => {
          this.loadPromise = null;
          reject(new Error('Error al cargar Google Maps'));
        });
        
        return;
      }

      // Crear script solo si no existe
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPS}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Esperar a que window.google esté disponible
        const checkGoogleMaps = () => {
          if (window.google?.maps) {
            this.isLoaded = true;
            console.log('✅ Google Maps cargado correctamente (nueva instancia)');
            resolve(window.google.maps);
          } else {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
      };

      script.onerror = (error) => {
        this.loadPromise = null;
        console.error('❌ Error cargando Google Maps:', error);
        reject(new Error('Error al cargar Google Maps. Verifica tu API Key.'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  /**
   * Geocoding Inverso con CACHE PERSISTENTE
   * Evita llamadas repetidas a la API = AHORRO GRANDE
   */
  async reverseGeocode(coords) {
    const cacheKey = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
    
    // 1. Verificar cache en memoria
    if (this.geocodeCache.has(cacheKey)) {
      console.log('📦 Geocode desde cache (memoria)');
      return this.geocodeCache.get(cacheKey);
    }

    // 2. Verificar localStorage (persiste entre sesiones)
    const localStorageKey = `geocode_${cacheKey}`;
    const cached = localStorage.getItem(localStorageKey);
    
    if (cached) {
      try {
        const data = JSON.parse(cached);
        // Cache válido por 7 días
        if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
          console.log('💾 Geocode desde cache (localStorage)');
          this.geocodeCache.set(cacheKey, data.result);
          return data.result;
        }
      } catch (e) {
        console.error('Error parsing cached geocode:', e);
      }
    }

    // 3. Solo si no hay cache, hacer llamada a la API
    try {
      await this.loadGoogleMaps();
      const geocoder = new window.google.maps.Geocoder();
      
      const response = await geocoder.geocode({ location: coords });
      
      if (response.results[0]) {
        const result = this.parseAddressComponents(response.results[0]);
        
        // Guardar en memoria
        this.geocodeCache.set(cacheKey, result);
        
        // Guardar en localStorage
        localStorage.setItem(localStorageKey, JSON.stringify({
          result,
          timestamp: Date.now()
        }));
        
        console.log('🌐 Geocode desde API (guardado en cache)');
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Error en geocoding:', error);
      return null;
    }
  }

  /**
   * Parsear componentes de dirección
   */
  parseAddressComponents(result) {
    const components = result.address_components || [];
    
    const findComponent = (types) => {
      return components.find((component) =>
        types.some((type) => component.types.includes(type))
      );
    };

    const route = findComponent(['route']);
    const streetNumber = findComponent(['street_number']);
    const locality = findComponent(['locality']);
    const postalCode = findComponent(['postal_code']);
    const state = findComponent(['administrative_area_level_1']);
    const country = findComponent(['country']);
    const sublocality = findComponent(['sublocality', 'sublocality_level_1']);

    const addressParts = [];
    if (route?.long_name) addressParts.push(route.long_name);
    if (streetNumber?.long_name) addressParts.push(streetNumber.long_name);

    return {
      formatted_address: result.formatted_address,
      address: addressParts.join(' ') || '',
      city: locality?.long_name || sublocality?.long_name || '',
      postalCode: postalCode?.long_name || '',
      state: state?.long_name || '',
      stateShort: state?.short_name || '',
      country: country?.long_name || '',
      countryShort: country?.short_name || '',
    };
  }

  

  /**
   * Obtener ubicación actual con THROTTLING
   * Evita múltiples llamadas seguidas
   */
  async getCurrentLocation() {
    const cacheKey = 'current_location';
    const cached = this.cache.get(cacheKey);
    
    // Cache válido por 5 minutos
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      console.log('📍 Ubicación desde cache');
      return cached.coords;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no disponible'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Guardar en cache
          this.cache.set(cacheKey, {
            coords,
            timestamp: Date.now()
          });
          
          console.log('🌍 Ubicación desde GPS');
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Aceptar posiciones de hasta 5 minutos
        }
      );
    });
  }

  /**
   * Limpiar cache (útil para testing)
   */
  clearCache() {
    this.cache.clear();
    this.geocodeCache.clear();
    
    // Limpiar localStorage de geocoding
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('geocode_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Cache de Maps limpiado');
  }
}

// Exportar instancia única (Singleton)
export const mapsService = new MapsService();

// Hook para usar en componentes
export const useMaps = () => {
  return mapsService;
};

export default mapsService;