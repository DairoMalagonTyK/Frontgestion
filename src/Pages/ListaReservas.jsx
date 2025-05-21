import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
const API = import.meta.env.VITE_API_URL;

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const correoUsuario = localStorage.getItem("correo");

    if (!correoUsuario) {
      console.warn("⚠️ No hay correo en localStorage, no se ejecuta fetch");
      return;
    }

    const fetchReservas = async () => {
      try {
        const res = await fetch(
          `${API}/api/reservas-usuario?correo=${encodeURIComponent(
            correoUsuario
          )}`
        );
        if (!res.ok) throw new Error("No se pudo obtener las reservas");
        const data = await res.json();
        setReservas(data);
      } catch (err) {
        console.error("❌ Error cargando reservas:", err);
      }
    };

    fetchReservas();
  }, []);

  const estadoColor = {
    aceptada: "success",
    rechazada: "error",
    pendiente: "warning",
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#ffffff" }}>
        Mis Reservas
      </Typography>
      <Grid container spacing={2}>
        {reservas.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reserva #{r.id}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <EventIcon sx={{ mr: 1 }} />
                  {(() => {
                    const [year, month, day] = r.fecha.split("-");
                    return `${day}/${month}/${year}`;
                  })()}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <AccessTimeIcon sx={{ mr: 1 }} /> {r.horaInicio} - {r.horaFin}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <SportsSoccerIcon sx={{ mr: 1 }} /> {r.cancha}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Observaciones:</strong> {r.observaciones}
                </Typography>

                <Chip
                  label={r.estado}
                  color={estadoColor[r.estado] || "default"}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaReservas;
