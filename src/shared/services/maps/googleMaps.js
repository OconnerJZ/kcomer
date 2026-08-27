const GOOGLE_MAPS_SCRIPT_SELECTOR = 'script[src*="maps.googleapis.com/maps/api/js"]';

export const loadGoogleMaps = (apiKey) => {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  if (!apiKey || apiKey === "undefined") {
    return Promise.reject(new Error("API Key de Google Maps no configurada"));
  }

  const existingScript = document.querySelector(GOOGLE_MAPS_SCRIPT_SELECTOR);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.google.maps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Error al cargar Google Maps")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Error al cargar Google Maps"));
    document.head.appendChild(script);
  });
};

export const parseAddressComponents = (components = []) => {
  const find = (...types) => components.find((component) =>
    types.some((type) => component.types?.includes(type)),
  );

  const route = find("route");
  const number = find("street_number");
  const locality = find("locality");
  const sublocality = find("sublocality", "sublocality_level_1");
  const postalCode = find("postal_code");
  const state = find("administrative_area_level_1");
  const country = find("country");

  return {
    address: [route?.long_name, number?.long_name].filter(Boolean).join(" "),
    city: locality?.long_name || sublocality?.long_name || "",
    postalCode: postalCode?.long_name || "",
    state: state?.long_name || "",
    stateShort: state?.short_name || "",
    country: country?.long_name || "",
    countryShort: country?.short_name || "",
  };
};

export const reverseGeocode = async (coords) => {
  if (!window.google?.maps) throw new Error("Google Maps no está disponible");
  const geocoder = new window.google.maps.Geocoder();
  const response = await geocoder.geocode({ location: coords });
  const result = response.results?.[0];
  if (!result) return null;

  return {
    formatted_address: result.formatted_address,
    ...parseAddressComponents(result.address_components),
  };
};

export const getCurrentPosition = (options = {}) => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error("Geolocalización no disponible en tu navegador"));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
    reject,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    },
  );
});
