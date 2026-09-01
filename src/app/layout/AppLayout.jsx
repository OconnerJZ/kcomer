import { Layout as AntdLayout } from "antd";
import { Box, Toolbar } from "@mui/material";
import Navbar from "@App/navigation/Navbar";
import FiltersPanel from "@Features/explore/components/FiltersPanel";
import Bg from "@Assets/images/qscome-bg-6.png";
import Content from "@Shared/components/layout/Content";

const { Header: AntdHeader, Content: AntdContent, Footer: AntdFooter } = AntdLayout;
const APP_NAME = "qsCome";

export default function AppLayout() {
  return (
    <AntdLayout style={{ minHeight: "100dvh" }}>
      <Box className="header-navbar">
        <AntdHeader>
          <Navbar />
          <FiltersPanel />
        </AntdHeader>
      </Box>
      <Toolbar sx={{ backgroundImage: `url(${Bg})`, display: { xs: "none", sm: "block" } }} />
      <AntdContent className="app-content" style={{ position: "relative", overflow: "hidden", padding: "0", backgroundImage: `linear-gradient(rgba(255, 249, 244, 0.84), rgba(255, 249, 244, 0.84)), url(${Bg})`, backgroundSize: "contain", backgroundPosition: "center" }}>
        <Content />
      </AntdContent>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <AntdFooter style={{ backgroundColor: "#292522", color: "#fff9f4", textAlign: "center", letterSpacing: "3.2px" }}>
          <Box component="span" className="footer">
            COPYRIGHT © {new Date().getFullYear()} {APP_NAME} - TODOS LOS DERECHOS RESERVADOS
          </Box>
        </AntdFooter>
      </Box>
    </AntdLayout>
  );
}
