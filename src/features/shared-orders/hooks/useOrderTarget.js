import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "qscome_order_target";
const CHANGE_EVENT = "qscome:order-target-changed";

const normalizeTarget = (value) => value === "individual" ? "individual" : "shared";

export const readOrderTarget = () => {
  if (typeof window === "undefined") return "shared";
  return normalizeTarget(window.sessionStorage.getItem(STORAGE_KEY));
};

export const writeOrderTarget = (target) => {
  const normalized = normalizeTarget(target);
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, normalized);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: normalized }));
  }
  return normalized;
};

export default function useOrderTarget() {
  const [target, setTarget] = useState(readOrderTarget);

  useEffect(() => {
    const handleChange = (event) => setTarget(normalizeTarget(event.detail));
    window.addEventListener(CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CHANGE_EVENT, handleChange);
  }, []);

  const updateTarget = useCallback((nextTarget) => {
    const normalized = writeOrderTarget(nextTarget);
    setTarget(normalized);
  }, []);

  return [target, updateTarget];
}
