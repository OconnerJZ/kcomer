import { createContext, useContext, useMemo, useState } from "react";

const FilterMenuContext = createContext(undefined);

const FilterMenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const value = useMemo(() => ({ visible, setVisible }), [visible]);

  return (
    <FilterMenuContext.Provider value={value}>
      {children}
    </FilterMenuContext.Provider>
  );
};

export const useFilterMenu = () => {
  const context = useContext(FilterMenuContext);

  if (!context) {
    throw new Error("useFilterMenu debe usarse dentro de un FilterMenuProvider");
  }

  return context;
};

export default FilterMenuProvider;
