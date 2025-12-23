// src/services/mapsService.js - VERSIÓN COMPLETA CON TODAS LAS FUNCIONES

class MapsService {
  constructor() {
    this.cache = new Map();
    this.geocoder = null;
    this.defaultLocation = { 
      lat: 19.4326, 
      lng: -99.1332  // CDMX
    };
  }

  /**
   * Obtener ubicación del usuario - MEJORADO
   */
  async getUserLocation(options = {}) {
    const {
      timeout = 10000,
      maximumAge = 300000,
      enableHighAccuracy = false,
      fallbackToIP = true,
      showProgress = null
    } = options;

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('❌ Geolocalización no soportada');
        if (fallbackToIP) {
          return this.getUserLocationByIP()
            .then(resolve)
            .catch(() => resolve(this.defaultLocation));
        }
        return resolve(this.defaultLocation);
      }

      const geoOptions = { enableHighAccuracy, timeout, maximumAge };
      let resolved = false;

      const safetyTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn('⏱️ Timeout de seguridad alcanzado');
          if (fallbackToIP) {
            this.getUserLocationByIP()
              .then(resolve)
              .catch(() => resolve(this.defaultLocation));
          } else {
            resolve(this.defaultLocation);
          }
        }
      }, timeout + 2000);

      const onSuccess = (position) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimeout);

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          source: 'gps'
        };

        console.log('✅ Ubicación GPS obtenida:', location);
        resolve(location);
      };

      const onError = (error) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimeout);

        console.error('❌ Error geolocalización:', {
          code: error.code,
          message: error.message,
          type: { 1: 'PERMISSION_DENIED', 2: 'POSITION_UNAVAILABLE', 3: 'TIMEOUT' }[error.code]
        });

        switch (error.code) {
          case 1: // PERMISSION_DENIED
          case 2: // POSITION_UNAVAILABLE
            if (fallbackToIP) {
              this.getUserLocationByIP()
                .then(resolve)
                .catch(() => resolve(this.defaultLocation));
            } else {
              resolve(this.defaultLocation);
            }
            break;

          case 3: // TIMEOUT
            if (enableHighAccuracy && !resolved) {
              console.log('🔄 Reintentando sin high accuracy...');
              navigator.geolocation.getCurrentPosition(
                onSuccess,
                () => {
                  if (fallbackToIP) {
                    this.getUserLocationByIP()
                      .then(resolve)
                      .catch(() => resolve(this.defaultLocation));
                  } else {
                    resolve(this.defaultLocation);
                  }
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge }
              );
            } else {
              if (fallbackToIP) {
                this.getUserLocationByIP()
                  .then(resolve)
                  .catch(() => resolve(this.defaultLocation));
              } else {
                resolve(this.defaultLocation);
              }
            }
            break;

          default:
            if (fallbackToIP) {
              this.getUserLocationByIP()
                .then(resolve)
                .catch(() => resolve(this.defaultLocation));
            } else {
              resolve(this.defaultLocation);
            }
        }
      };

      try {
        if (showProgress) showProgress('Obteniendo ubicación GPS...');
        navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
      } catch (error) {
        console.error('❌ Error solicitando ubicación:', error);
        clearTimeout(safetyTimeout);
        if (fallbackToIP) {
          this.getUserLocationByIP()
            .then(resolve)
            .catch(() => resolve(this.defaultLocation));
        } else {
          resolve(this.defaultLocation);
        }
      }
    });
  }

  /**
   * NUEVO: Obtener ubicación por IP
   */
  async getUserLocationByIP() {
    try {
      console.log('🌐 Obteniendo ubicación por IP...');
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) throw new Error(`IP geolocation falló: ${response.status}`);
      const data = await response.json();
      
      const location = {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name,
        postal: data.postal,
        accuracy: 5000,
        source: 'ip'
      };
      
      console.log('✅ Ubicación por IP obtenida:', location);
      return location;
    } catch (error) {
      console.error('❌ Error ubicación por IP:', error);
      throw error;
    }
  }

  /**
   * NUEVO: Verificar permisos
   */
  async checkGeolocationPermission() {
    if (!navigator.permissions) return 'unavailable';
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', 'prompt'
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return 'unavailable';
    }
  }

  /**
   * Geocoding inverso: Coordenadas → Dirección
   */
  async reverseGeocode(lat, lng) {
    const cacheKey = `reverse_${lat.toFixed(4)}_${lng.toFixed(4)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      const age = Date.now() - cached.timestamp;
      if (age < 30 * 24 * 60 * 60 * 1000) {
        console.log('📦 Usando dirección en cache');
        return cached.data;
      }
    }

    try {
      if (!this.geocoder) {
        if (!window.google) throw new Error('Google Maps no está cargado');
        this.geocoder = new google.maps.Geocoder();
      }

      const result = await new Promise((resolve, reject) => {
        this.geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const addressData = {
                formatted: results[0].formatted_address,
                components: this.parseAddressComponents(results[0].address_components)
              };
              resolve(addressData);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      this.cleanOldCache();
      return result;
    } catch (error) {
      console.error('❌ Error reverse geocode:', error);
      return {
        formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        components: {
          street: '', number: '', neighborhood: '',
          city: '', state: '', country: '', postal: '', lat, lng
        }
      };
    }
  }

  /**
   * CRÍTICO: parseAddressComponents (la que faltaba)
   */
  parseAddressComponents(addressComponents) {
    if (!addressComponents || !Array.isArray(addressComponents)) {
      return {
        street: '', number: '', neighborhood: '',
        city: '', state: '', country: '', postal: ''
      };
    }

    const components = {
      street: '', number: '', neighborhood: '',
      city: '', municipality: '', state: '', country: '', postal: ''
    };

    addressComponents.forEach(component => {
      const types = component.types;
      const value = component.long_name;
      const shortValue = component.short_name;

      if (types.includes('street_number')) components.number = value;
      if (types.includes('route')) components.street = value;
      if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
        components.neighborhood = value;
      }
      if (types.includes('locality')) components.city = value;
      if (types.includes('administrative_area_level_2')) {
        components.municipality = value;
        if (!components.city) components.city = value;
      }
      if (types.includes('administrative_area_level_1')) components.state = shortValue;
      if (types.includes('country')) components.country = value;
      if (types.includes('postal_code')) components.postal = value;
    });

    return components;
  }

  /**
   * Geocoding normal: Dirección → Coordenadas
   */
  async geocode(address) {
    const cacheKey = `geocode_${address}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      const age = Date.now() - cached.timestamp;
      if (age < 30 * 24 * 60 * 60 * 1000) {
        console.log('📦 Usando coordenadas en cache');
        return cached.data;
      }
    }

    try {
      if (!this.geocoder) {
        if (!window.google) throw new Error('Google Maps no está cargado');
        this.geocoder = new google.maps.Geocoder();
      }

      const result = await new Promise((resolve, reject) => {
        this.geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formatted: results[0].formatted_address,
              components: this.parseAddressComponents(results[0].address_components)
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      this.cleanOldCache();
      return result;
    } catch (error) {
      console.error('❌ Error geocode:', error);
      throw error;
    }
  }

  /**
   * Calcular distancia (Haversine)
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  isWithinRadius(centerLat, centerLng, pointLat, pointLng, radiusKm) {
    const distance = this.calculateDistance(centerLat, centerLng, pointLat, pointLng);
    return distance <= radiusKm;
  }

  cleanOldCache() {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let cleaned = 0;
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > ONE_MONTH) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) console.log(`🧹 Cache limpiado: ${cleaned} entradas`);
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache completamente limpiado');
  }
}

export const mapsService = new MapsService();
export default mapsService;