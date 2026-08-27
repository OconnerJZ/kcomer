import { LinearProgress } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Linear = () => <LinearProgress color="primary" />;

export default function Content() {
  return (
    <Suspense fallback={<Linear />}>
      <Outlet />
    </Suspense>
  );
}
