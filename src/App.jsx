import FilterMenuProvider from "@Context/FilterMenuContext";
import Router from "./Router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FilterMenuProvider>
        <Router />
      </FilterMenuProvider>
    </LocalizationProvider>
  );
};

export default App;
