import { useFilterMenu } from "@Context/FilterMenuContext";
import { useEffect, useRef } from "react";

const useExplorar = () => {
  const { setVisible } = useFilterMenu();
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
        setVisible(isElementVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    seccionDestinoRef,
    scrollToSection,
  };
};

export default useExplorar;
