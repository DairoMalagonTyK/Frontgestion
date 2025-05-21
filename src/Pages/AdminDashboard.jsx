import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  CssBaseline,
  Divider,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import StadiumIcon from "@mui/icons-material/Stadium";
import BuildIcon from "@mui/icons-material/Build";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion } from "framer-motion";

import SolicitudesListMUI from "./ADMIN/SolicitudesList";
import UserListMUI from "./ADMIN/UserList";
import CanchasManagerMUI from "./ADMIN/CanchasManager";
import ImplementosManagerMUI from "./ADMIN/ImplementosManager";
import HistorialSolicitudesAdmin from "./ADMIN/HistorialSolicitudesAdmin";
import ReservasListAdmin from "./ADMIN/ReservasListAdmin";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Solicitudes");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    {
      text: "Solicitudes Pendientes",
      icon: <DescriptionIcon />,
      section: "Solicitudes",
    },
    {
      text: "Historial de Solicitudes",
      icon: <HistoryIcon />,
      section: "Historial",
    },
    { text: "Reservas", icon: <EventIcon />, section: "Reservas" },
    { text: "Usuarios", icon: <PeopleIcon />, section: "Usuarios" },
    { text: "Canchas", icon: <StadiumIcon />, section: "Canchas" },
    { text: "Implementos", icon: <BuildIcon />, section: "Implementos" },
  ];

  const drawer = (
    <div>
      <Toolbar /> {/* Espaciador para alinear con AppBar */}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedSection === item.section}
              onClick={() => {
                setSelectedSection(item.section);
                if (mobileOpen) handleDrawerToggle();
              }}
              sx={{
                borderLeft:
                  selectedSection === item.section
                    ? "4px solid #2e7d32"
                    : "4px solid transparent",
                boxShadow: selectedSection === item.section ? 2 : 0,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
                "&:hover": { backgroundColor: "secondary.light" },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    selectedSection === item.section
                      ? "primary.contrastText"
                      : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderSection = () => {
    let sectionComponent;
    switch (selectedSection) {
      case "Solicitudes":
        sectionComponent = <SolicitudesListMUI />;
        break;
      case "Historial":
        sectionComponent = <HistorialSolicitudesAdmin />;
        break;
      case "Reservas":
        sectionComponent = <ReservasListAdmin />;
        break;
      case "Usuarios":
        sectionComponent = <UserListMUI />;
        break;
      case "Canchas":
        sectionComponent = <CanchasManagerMUI />;
        break;
      case "Implementos":
        sectionComponent = <ImplementosManagerMUI />;
        break;
      default:
        sectionComponent = (
          <Typography variant="h5">Selecciona una sección</Typography>
        );
    }

    return (
      <motion.div
        key={selectedSection}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {sectionComponent}
      </motion.div>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar fijo */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#2e7d32",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "20px !important", // aún más compacto
            px: 2,
          }}
        >
          <Typography variant="h6" noWrap component="div" fontSize="1rem">
            Panel de Administración
          </Typography>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/login")}
            startIcon={<LogoutIcon />}
            sx={{
              backgroundColor: "#e53935",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              padding: "4px 10px",
              "&:hover": {
                backgroundColor: "#c62828",
                transform: "scale(1.05)",
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
              position: "relative",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "grey.100",
          p: 3,
          mt: "64px", // Espacio para el AppBar
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "primary.dark", mb: 2 }}
        >
          Bienvenido al Panel de Administración
        </Typography>
        <Typography paragraph sx={{ color: "text.secondary", mb: 4 }}>
          Desde este panel, puedes gestionar usuarios, solicitudes, canchas e
          implementos del sistema.
        </Typography>

        {renderSection()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
