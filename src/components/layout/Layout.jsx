import Navbar from "./Navbar";
import { Layout as AntdLayout } from "antd";
import { Box, Toolbar } from "@mui/material";
import Content from "./Content";
import Bg from "@Assets/images/qscome-bg-6.png";
import FiltersPanel from "@Components/filters/FiltersPanel";
import { namePage } from "@Utils/listMessages";

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
      <Toolbar
        sx={{
          backgroundImage: `url(${Bg})`,
          display: { xs: "none", sm: "block" },
        }}
      />
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
        <Box component="span" className="footer">
          {" "}
          COPYRIGHT © {new Date().getFullYear()} {namePage} - TODOS LOS DERECHOS
          RESERVADOS
        </Box>
      </AntdFooter>
    </AntdLayout>
  );
};

export default Layout;
