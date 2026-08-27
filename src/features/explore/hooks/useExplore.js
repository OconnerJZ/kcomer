import { useEffect, useRef } from "react";
import { useFilterMenu } from "@Features/explore/context/FilterMenuContext";

export default function useExplore() {
  const { setVisible } = useFilterMenu();
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const elementRect = sectionRef.current.getBoundingClientRect();
      setVisible(elementRect.top <= 64);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setVisible]);

  return {
    seccionDestinoRef: sectionRef,
    scrollToSection,
  };
}
