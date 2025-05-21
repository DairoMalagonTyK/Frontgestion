import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const HomePage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
<Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(200, 255, 200, 0.75)' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Bienvenido al Sistema de Solicitudes Deportivas
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Esta plataforma te permite registrar y gestionar solicitudes para el uso de implementos y escenarios deportivos de manera fácil y organizada. Accede a las reservas, consulta tu historial y mantente al tanto del uso de los recursos deportivos de la universidad.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Características del Sistema:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Solicita implementos o canchas disponibles según la oferta institucional." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Consulta tus solicitudes anteriores y verifica el estado de aprobación." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Visualiza detalles de tus reservas y horarios asignados." />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          ¿Cómo empezar?
        </Typography>
        <Typography variant="body1">
          Dirígete a la sección de <strong>"Nueva Solicitud"</strong> para registrar tu requerimiento deportivo. ¡Gestiona tu tiempo y recursos de forma eficiente!
        </Typography>
      </Paper>
    </Box>
  );
};

export default HomePage;
