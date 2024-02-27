import { createContext, useContext, useState } from "react";

const FilterMenuContext = createContext(null);

const FilterMenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <FilterMenuContext.Provider value={{ visible, setVisible }}>
      {children}
    </FilterMenuContext.Provider>
  );
};

export default FilterMenuProvider;

export const useFilterMenu = () => {
  const context = useContext(FilterMenuContext);
  if (context === undefined) {
    throw new Error("Error de aplicacion en creacion de context.");
  }
  return context;
};
