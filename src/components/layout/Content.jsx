import { LinearProgress } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Linear = () => <LinearProgress color="primary" />;

const Content = () => {
  return (
    <Suspense fallback={<Linear />}>
      <Outlet />
    </Suspense>
  );
};

export default Content;
