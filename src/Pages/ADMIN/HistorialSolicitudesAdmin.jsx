import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Chip,
} from "@mui/material";
const API = import.meta.env.VITE_API_URL;

const HistorialSolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await fetch(`${API}/api/solicitudes-todas`);
        if (!res.ok) throw new Error("Error al obtener las solicitudes");
        const data = await res.json();
        setSolicitudes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No hay solicitudes registradas.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Historial de Solicitudes
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: "bold" } }}>
              <TableCell>Usuario</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Cancha</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora Inicio</TableCell>
              <TableCell>Hora Fin</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((sol) => (
              <TableRow key={sol.id}>
                <TableCell>{sol.usuarioNombre}</TableCell>
                <TableCell>{sol.usuarioCorreo}</TableCell>
                <TableCell>{sol.canchaNombre}</TableCell>
                <TableCell>
                  {new Date(`${sol.fecha}T00:00:00`).toLocaleDateString(
                    "es-CO",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </TableCell>
                <TableCell>{sol.horaInicio}</TableCell>
                <TableCell>{sol.horaFin}</TableCell>
                <TableCell>{sol.descripcion}</TableCell>
                <TableCell>
                  <Chip
                    label={sol.estado}
                    color={
                      sol.estado === "pendiente"
                        ? "warning"
                        : sol.estado === "aceptada"
                        ? "success"
                        : sol.estado === "rechazada"
                        ? "error"
                        : "default"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HistorialSolicitudesAdmin;
