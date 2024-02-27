
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "@Components/layout/Layout";
import Explorar from "@Pages/Explorar";
import Nosotros from "@Pages/Nosotros";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="explorar" element={<Explorar />} />
          <Route path="nosotros" element={<Nosotros />} />

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
