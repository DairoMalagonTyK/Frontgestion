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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const ReservasListAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para observaciones
  const [dialogOpen, setDialogOpen] = useState(false);
  const [obsTexto, setObsTexto] = useState("");
  const [reservaIdActiva, setReservaIdActiva] = useState("");

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const res = await fetch(`${API}/api/reservas`);
      if (!res.ok) throw new Error("Error al obtener reservas");
      const data = await res.json();
      setReservas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoObservacion = (id, textoActual) => {
    setReservaIdActiva(id);
    setObsTexto(textoActual || "");
    setDialogOpen(true);
  };

  const guardarObservacion = async () => {
    try {
      await axios.post(`${API}/api/guardar-observacion`, {
        reservaId: reservaIdActiva,
        observacion: obsTexto,
      });

      // Actualizar localmente
      setReservas((prev) =>
        prev.map((r) =>
          r.id === reservaIdActiva ? { ...r, observacion: obsTexto } : r
        )
      );

      setDialogOpen(false);
    } catch (err) {
      console.error("Error al guardar observación:", err);
    }
  };

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

  if (reservas.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No hay reservas registradas.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Reservas Aceptadas
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
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.usuarioNombre}</TableCell>
                <TableCell>{r.usuarioCorreo}</TableCell>
                <TableCell>{r.canchaNombre}</TableCell>
                <TableCell>
                  {new Date(`${r.fecha}T00:00:00`).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>{r.horaInicio}</TableCell>
                <TableCell>{r.horaFin}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => abrirDialogoObservacion(r.id, r.observacion)}
                  >
                    {r.observacion ? "Editar" : "Agregar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de observación */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Observación de la Reserva</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={obsTexto}
            onChange={(e) => setObsTexto(e.target.value)}
            placeholder="Escribe tu observación..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={guardarObservacion} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReservasListAdmin;
