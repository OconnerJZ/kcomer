import { createContext, useContext, useMemo, useState } from "react";

// Inicializamos el contexto como undefined para poder validar
const FilterMenuContext = createContext(undefined);

// Proveedor que envuelve los componentes que necesitan acceder al contexto
const FilterMenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const value = useMemo(() => ({ visible, setVisible }), [visible]);
  return (
    <FilterMenuContext.Provider value={value}>
      {children}
    </FilterMenuContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFilterMenu = () => {
  const context = useContext(FilterMenuContext);
  if (!context) {
    throw new Error(
      "useFilterMenu debe usarse dentro de un FilterMenuProvider"
    );
  }
  return context;
};

export default FilterMenuProvider;
