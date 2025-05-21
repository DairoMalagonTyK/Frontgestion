import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Card, CardContent, Typography, Chip } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
const API = import.meta.env.VITE_API_URL;

const ListaSolicitudes = ({ usuario }) => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const res = await axios.get(
          `${API}/api/mis-solicitudes?correo=${usuario.correo}`
        );
        setSolicitudes(res.data);
      } catch (err) {
        console.error("Error al cargar solicitudes", err);
      }
    };

    obtenerSolicitudes();
  }, [usuario]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#ffffff" }}>
        Mis Solicitudes
      </Typography>

      <Grid container spacing={2}>
        {solicitudes.length === 0 ? (
          <Typography variant="body1" sx={{ ml: 2 }}>
            No hay solicitudes registradas.
          </Typography>
        ) : (
          solicitudes.map((solicitud) => (
            <Grid item xs={12} md={6} lg={4} key={solicitud.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <EventNoteIcon color="primary" />
                    {(() => {
                      const [year, month, day] = solicitud.fecha.split("-");
                      return `${day}/${month}/${year}`;
                    })()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    {solicitud.horaInicio} - {solicitud.horaFin}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <SportsSoccerIcon fontSize="small" sx={{ mr: 1 }} />
                    Cancha: {solicitud.canchaNombre}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Motivo: {solicitud.descripcion}
                  </Typography>
                  <Chip
                    label={solicitud.estado}
                    color={
                      solicitud.estado === "aceptada"
                        ? "success"
                        : solicitud.estado === "rechazada"
                        ? "error"
                        : "warning"
                    }
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ListaSolicitudes;
