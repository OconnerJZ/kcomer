import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBackRounded,
  CloseRounded,
  MenuRounded,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@Features/auth/context/useAuth";
import AdminNavigation from "./AdminNavigation";
import { getAdminModuleForPath } from "../model/adminNavigation";

const DRAWER_WIDTH = 252;

export default function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const activeModule = getAdminModuleForPath(location.pathname);

  const navigation = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Box>
            <Typography variant="overline" color="text.secondary">qsCome</Typography>
            <Typography variant="subtitle1" fontWeight={700}>Admin Control Center</Typography>
          </Box>
          {!isDesktop && (
            <IconButton aria-label="Cerrar navegación" onClick={() => setMobileOpen(false)} size="small">
              <CloseRounded />
            </IconButton>
          )}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <AdminNavigation activePath={location.pathname} onNavigate={() => setMobileOpen(false)} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#2F2D2A",
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 1.5 } }}>
          {!isDesktop && (
            <IconButton color="inherit" aria-label="Abrir navegación" onClick={() => setMobileOpen(true)}>
              <MenuRounded />
            </IconButton>
          )}

          <Button
            color="inherit"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/explorar")}
            sx={{ px: { xs: 1, sm: 1.5 }, minWidth: 0 }}
          >
            qsCome
          </Button>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,.14)", my: 1.5 }} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {activeModule.label}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,.62)", display: { xs: "none", sm: "block" } }} noWrap>
              {user?.email}
            </Typography>
          </Box>

          <Chip
            label="ADMIN"
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,.10)",
              color: "white",
              border: "1px solid rgba(255,255,255,.12)",
              fontWeight: 700,
            }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            top: 64,
            height: "calc(100vh - 64px)",
            borderRightColor: "divider",
            bgcolor: "background.paper",
          },
        }}
      >
        {navigation}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "min(86vw, 300px)",
            bgcolor: "background.paper",
          },
        }}
      >
        {navigation}
      </Drawer>

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          ml: { md: `${DRAWER_WIDTH}px` },
          pt: { xs: "56px", sm: "64px" },
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 3.5, md: 4 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
