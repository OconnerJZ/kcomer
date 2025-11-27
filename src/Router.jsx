
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "@Components/layout/Layout";
import Explorar from "@Pages/Explorar";
import Nosotros from "@Pages/Nosotros";
import RegisterBusiness from "@Pages/RegisterBusiness";
import ScrollToTop from "@Components/ScrollToTop";

const Router = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="explorar" element={<Explorar />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="registro" element={<RegisterBusiness />} />
          {/* <Route path="todos" element={<TodoApp />} /> */}
          {/* <Route
            path="*"
            element={
              <ResultAntd
                status={404}
                title="404"
                subTitle="No se ha encontrado el recurso"
              />
            }
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
