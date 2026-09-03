import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentPosition,
  loadGoogleMaps,
  reverseGeocode,
} from "@Shared/services/maps/googleMaps";
import {
  getLocationAddress,
  getLocationErrorMessage,
  hasLocationCoordinates,
  toMapCoordinates,
  toPublishedLocation,
} from "@Shared/model/mapLocation";

export const useGoogleMapField = ({ value, onChange, apiKey, compact = false }) => {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(() => getLocationAddress(value));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const publishLocation = useCallback(async (coords) => {
    try {
      const geocodeData = await reverseGeocode(coords);
      if (!mountedRef.current) return;
      const nextLocation = toPublishedLocation(coords, geocodeData);
      setAddress(getLocationAddress(nextLocation));
      onChangeRef.current?.(nextLocation);
    } catch {
      if (!mountedRef.current) return;
      onChangeRef.current?.(toPublishedLocation(coords));
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    const initialize = async () => {
      try {
        setLoading(true);
        setError("");
        await loadGoogleMaps(apiKey);
        if (disposed || !mapNodeRef.current) return;

        const center = toMapCoordinates(valueRef.current);
        const map = new window.google.maps.Map(mapNodeRef.current, {
          center,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: !compact,
        });
        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });
        mapRef.current = map;
        markerRef.current = marker;

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          publishLocation({ lat: position.lat(), lng: position.lng() });
        });
        map.addListener("click", (event) => {
          const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          marker.setPosition(coords);
          publishLocation(coords);
        });
      } catch (initializationError) {
        if (!disposed) {
          setError(initializationError.message || "No se pudo cargar el mapa");
        }
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    initialize();
    return () => {
      disposed = true;
      if (window.google?.maps?.event) {
        if (markerRef.current) window.google.maps.event.clearInstanceListeners(markerRef.current);
        if (mapRef.current) window.google.maps.event.clearInstanceListeners(mapRef.current);
      }
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [apiKey, compact, publishLocation]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !hasLocationCoordinates(value)) return;
    const coords = toMapCoordinates(value);
    mapRef.current.setCenter(coords);
    markerRef.current.setPosition(coords);
    const nextAddress = getLocationAddress(value);
    if (nextAddress) setAddress(nextAddress);
  }, [value]);

  const locate = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const coords = await getCurrentPosition();
      mapRef.current?.setCenter(coords);
      markerRef.current?.setPosition(coords);
      await publishLocation(coords);
    } catch (locationError) {
      if (mountedRef.current) setError(getLocationErrorMessage(locationError));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [publishLocation]);

  return {
    mapNodeRef,
    loading,
    error,
    address,
    locate,
  };
};

export default useGoogleMapField;
