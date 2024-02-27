import FilterMenuProvider from "@Context/FilterMenuContext";
import Router from "./Router";

const App = () => {
  return (
    <>
      <FilterMenuProvider>
        <Router />
      </FilterMenuProvider>
    </>
  );
};

export default App;
