import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CardMedia,
  CardActions,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const canchaFondo = "/FondoSport.png";

const imagenPorCancha = {
  CanchaBaloncesto: "/CanchaBasketball.webp",
  CanchaSintetica1: "/CanchaMicro.jpg",
  CanchaVoleibol: "/CanchaVoleibol.jpg",
};

const HomePublic = () => {
  const [canchas, setCanchas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const res = await fetch(`${API}/api/canchas-con-implementos`);
        const data = await res.json();
        setCanchas(data);
      } catch (error) {
        console.error("❌ Error al obtener canchas públicas:", error);
      }
    };

    fetchCanchas();
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${canchaFondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        p: 4,
        position: "relative",
      }}
    >
      {/* Botón superior derecha */}
      <Box sx={{ position: "absolute", top: 20, right: 30 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </Button>
      </Box>

      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
        }}
      >
        Canchas e Implementos Disponibles
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
        {canchas.map((cancha, index) => (
          <Grid item xs={12} sm={6} md={4} key={cancha.id || index}>
            <Card
              sx={{
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
                bgcolor: "rgba(255,255,255,0.95)",
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={
                  imagenPorCancha[cancha.id] ||
                  `${API}/imagenes/${cancha.id}.jpg`
                }
                alt={cancha.nombre}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/imagenes/default-cancha.jpg"; // imagen por defecto
                }}
              />

              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {cancha.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Implementos disponibles:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {cancha.implementos?.length > 0 ? (
                    cancha.implementos.map((imp) => (
                      <Chip
                        key={`${cancha.id}-${imp.id}`}
                        label={imp.nombre}
                        size="small"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay implementos asignados.
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => navigate("/login")}
                >
                  Reservar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePublic;
