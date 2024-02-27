import Navbar from "./Navbar";
import { Layout as AntdLayout } from "antd";
import { Box, Toolbar } from "@mui/material";
import Content from "./Content";
import Bg from "@Assets/images/qscome-bg-6.png";
import FiltersPanel from "@Components/filters/FiltersPanel";

const {
  Header: AntdHeader,
  Content: AntdContent,
  Footer: AntdFooter,
} = AntdLayout;

const Layout = () => {
  return (
    <AntdLayout
      style={{
        minHeight: "100vh",
      }}
    >
      <Box className="header-navbar">
        <AntdHeader>
          <Navbar />
          <FiltersPanel />
        </AntdHeader>
      </Box>
      <Toolbar sx={{ backgroundImage: `url(${Bg})` }} />
      <AntdContent
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "0 0px",
        }}
      >
        <Content />
      </AntdContent>
      <AntdFooter
        style={{
          backgroundColor: "#3a3b3d",
          color: "#f5f5f5",
          textAlign: "center",
          letterSpacing: "3.2px",
        }}
      >
        COPYRIGHT © 2023 kComer - TODOS LOS DERECHOS RESERVADOS
      </AntdFooter>
    </AntdLayout>
  );
};

export default Layout;
