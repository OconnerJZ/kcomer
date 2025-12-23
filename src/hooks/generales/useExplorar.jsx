import { datacards } from "@Const/listas";
import { useFilterMenu } from "@Context/FilterMenuContext";
import useGeolocation from "@Hooks/components/useGeolocation";
import { useEffect, useRef } from "react";
import useBusiness from "./useBusiness";

const useExplorar = () => {
  const geolocation = useGeolocation();
  const business = useBusiness();
  const { setVisible } = useFilterMenu()
  const seccionDestinoRef = useRef(null);

  const scrollToSection = () => {
    if (seccionDestinoRef.current) {
      seccionDestinoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (seccionDestinoRef.current) {
        const elementRect = seccionDestinoRef.current.getBoundingClientRect();
        const isElementVisible = elementRect.top <= 64;
        setVisible(isElementVisible)
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return {
    datacards,
    business,
    geolocation,
    seccionDestinoRef,
    scrollToSection,
  };
};

export default useExplorar;
