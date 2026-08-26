import { Layout as AntdLayout } from "antd";
import { Box, Toolbar } from "@mui/material";
import Navbar from "@Components/layout/Navbar";
import FiltersPanel from "@Features/explore/components/FiltersPanel";
import Bg from "@Assets/images/qscome-bg-6.png";
import { namePage } from "@Utils/listMessages";
import { isMobile } from "@Shared/utils/commons";
import Content from "./Content";

const {
  Header: AntdHeader,
  Content: AntdContent,
  Footer: AntdFooter,
} = AntdLayout;

export default function Layout() {
  return (
    <AntdLayout style={{ minHeight: "100dvh" }}>
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
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url(${Bg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        <Content />
      </AntdContent>
      {!isMobile() && (
        <AntdFooter
          style={{
            backgroundColor: "#3a3b3d",
            color: "#f5f5f5",
            textAlign: "center",
            letterSpacing: "3.2px",
          }}
        >
          <Box component="span" className="footer">
            COPYRIGHT © {new Date().getFullYear()} {namePage} - TODOS LOS DERECHOS RESERVADOS
          </Box>
        </AntdFooter>
      )}
    </AntdLayout>
  );
}
