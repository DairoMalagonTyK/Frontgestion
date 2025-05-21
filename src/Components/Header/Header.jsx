import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const Header = ({ usuario, onLogout }) => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        px: 4,
        py: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      {/* CONTENIDO CENTRADO */}
      <Box
        sx={{
          textAlign: 'center',
          mx: 'auto',
          flex: 1,
    mr: { md: -8 }
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
          SSID - Solicitudes Deportivas
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
          Universidad de la Amazonia · Florencia, Caquetá
        </Typography>
        <Typography variant="body2" fontStyle="italic" sx={{ mt: 0.5, fontSize: { xs: '0.9rem', md: '1rem' } }}>
          Bienvenido, {usuario?.nombre || 'Usuario'}
        </Typography>
            </Box>

      {/* BOTÓN A LA DERECHA */}
      <Box
        sx={{
          mt: { xs: 2, md: 0 },
          textAlign: 'right'
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onLogout}
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
