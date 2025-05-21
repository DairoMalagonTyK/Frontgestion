// src/Components/NavBar/NavBar.jsx
import React from 'react';
import { AppBar, Tabs, Tab, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const NavBar = ({ usuario }) => {
  const location = useLocation();
  const esAdmin = usuario?.rol === 'Administrador';

  const tabs = esAdmin
    ? [
        { label: 'Solicitudes', to: '/AdminSolicitudes' },
        { label: 'Canchas', to: '/Canchas' },
        { label: 'Implementos', to: '/Implementos' }
      ]
    : [
        { label: 'Inicio', to: '/inicio' },
        { label: 'Mis Reservas', to: '/Reservas' },
        { label: 'Mis Solicitudes', to: '/Solicitudes' },
        { label: 'Nueva Solicitud', to: '/NuevaSolicitud' }
      ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Tabs value={location.pathname} textColor="primary" indicatorColor="primary">
          {tabs.map((tab) => (
            <Tab
              key={tab.to}
              label={tab.label}
              value={tab.to}
              component={Link}
              to={tab.to}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
