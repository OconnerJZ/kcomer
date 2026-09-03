import { Layout as AntdLayout } from "antd";
import { Box, Toolbar } from "@mui/material";
import Navbar from "@App/navigation/Navbar";
import FiltersPanel from "@Features/explore/components/FiltersPanel";
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
      <Toolbar sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", display: { xs: "none", sm: "block" } }} />
      <AntdContent className="app-content" style={{ position: "relative", overflow: "hidden", padding: "0", backgroundColor: "#F5F2EC" }}>
        <Content />
      </AntdContent>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <AntdFooter style={{ backgroundColor: "#302D29", color: "#F5F2EC", textAlign: "left", letterSpacing: "1.4px" }}>
          <Box component="span" className="footer">
            COPYRIGHT © {new Date().getFullYear()} {APP_NAME} - TODOS LOS DERECHOS RESERVADOS
          </Box>
        </AntdFooter>
      </Box>
    </AntdLayout>
  );
}
