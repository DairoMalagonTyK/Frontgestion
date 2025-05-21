import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const SolicitudForm = ({ usuario }) => {
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("");
  const [implementosDisponibles, setImplementosDisponibles] = useState([]);
  const [implementosSeleccionados, setImplementosSeleccionados] = useState([]);
  const [canchas, setCanchas] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/canchas`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCanchas(res.data);
        } else {
          setCanchas([]);
        }
      })
      .catch(() => setCanchas([]));
  }, []);

  useEffect(() => {
    if (canchaSeleccionada) {
      axios
        .get(`${API}/api/implementos?cancha=${canchaSeleccionada}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setImplementosDisponibles(res.data);
          } else {
            setImplementosDisponibles([]);
          }
        })
        .catch(() => setImplementosDisponibles([]));
    }
  }, [canchaSeleccionada]);

  const verificarDisponibilidad = async (
    fecha,
    horaInicio,
    horaFin,
    canchaIRI
  ) => {
    const res = await fetch(
      `${API}/api/validar-disponibilidad?fecha=${fecha}&horaInicio=${horaInicio}&horaFin=${horaFin}&cancha=${canchaIRI}`
    );
    const data = await res.json();
    return data.disponible;
  };

  const validarConflictoUsuario = async (
    correo,
    fecha,
    horaInicio,
    horaFin,
    cancha
  ) => {
    const res = await fetch(
      `${API}/api/validar-solicitud-usuario?correo=${correo}&fecha=${fecha}&horaInicio=${horaInicio}&horaFin=${horaFin}&cancha=${cancha}`
    );
    const data = await res.json();
    return data.conflicto;
  };

  const normalizarHora = (hora) => (hora.length === 5 ? `${hora}:00` : hora);

  //Se envian los datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaFormateada = fecha.trim(); // ya viene como YYYY-MM-DD, no lo toques

    const horaInicioNormalizada = normalizarHora(horaInicio);
    const horaFinNormalizada = normalizarHora(horaFin);

    if (
      !descripcion ||
      !fecha ||
      !horaInicio ||
      !horaFin ||
      !canchaSeleccionada
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de enviar.",
      });
      return;
    }

    if (horaInicio >= horaFin) {
      Swal.fire({
        icon: "error",
        title: "Error en el horario",
        text: "La hora de inicio debe ser menor que la hora de fin.",
      });
      return;
    }

    const inicio = new Date(`1970-01-01T${horaInicioNormalizada}`);
    const fin = new Date(`1970-01-01T${horaFinNormalizada}`);
    const diferencia = (fin - inicio) / (1000 * 60);

    if (diferencia < 60) {
      Swal.fire({
        icon: "info",
        title: "Duración insuficiente",
        text: "La duración mínima debe ser de 1 hora.",
      });
      return;
    }

    const disponible = await verificarDisponibilidad(
      fecha,
      horaInicioNormalizada,
      horaFinNormalizada,
      canchaSeleccionada
    );

    if (!disponible) {
      Swal.fire({
        icon: "error",
        title: "Cancha ocupada",
        text: "Ya hay una reserva para esa cancha en ese horario.",
      });
      return;
    }

    const hayConflicto = await validarConflictoUsuario(
      usuario.correo,
      fecha,
      horaInicioNormalizada,
      horaFinNormalizada,
      canchaSeleccionada
    );

    if (hayConflicto) {
      Swal.fire({
        icon: "warning",
        title: "Conflicto detectado",
        text: "Ya tienes una solicitud o reserva en ese horario para la misma cancha.",
      });
      return;
    }

    try {
      console.log("📤 Fecha enviada al backend:", fechaFormateada);

      await axios.post(`${API}/api/solicitudes`, {
        fecha: fechaFormateada,
        horaInicio: horaInicioNormalizada,
        horaFin: horaFinNormalizada,
        descripcion,
        cancha: canchaSeleccionada,
        implementos: implementosSeleccionados,
        usuarioCorreo: usuario.correo,
      });

      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Tu solicitud fue registrada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setDescripcion("");
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      setCanchaSeleccionada("");
      setImplementosSeleccionados([]);
      setImplementosDisponibles([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al enviar la solicitud. Intenta nuevamente.",
      });
    }
  };

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "rgba(24, 84, 24, 0.56)",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
          Nueva Solicitud Deportiva
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Motivo / Descripción"
            fullWidth
            margin="normal"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />

          <TextField
            label="Fecha"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true, style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Hora de Inicio"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true, style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Hora de Fin"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true, style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "white" }}>
              Selecciona una Cancha
            </InputLabel>
            <Select
              value={canchaSeleccionada}
              onChange={(e) => setCanchaSeleccionada(e.target.value)}
              sx={{ color: "white", borderColor: "white" }}
            >
              {canchas.map((cancha) => (
                <MenuItem key={cancha.id} value={cancha.id}>
                  {cancha.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {implementosDisponibles.length > 0 && (
            <FormGroup>
              <Typography variant="subtitle1" sx={{ mt: 2, color: "white" }}>
                Implementos disponibles
              </Typography>
              {implementosDisponibles.map((imp) => (
                <FormControlLabel
                  key={imp.id}
                  control={
                    <Checkbox
                      checked={implementosSeleccionados.includes(imp.id)}
                      onChange={(e) => {
                        const nuevo = e.target.checked
                          ? [...implementosSeleccionados, imp.id]
                          : implementosSeleccionados.filter(
                              (id) => id !== imp.id
                            );
                        setImplementosSeleccionados(nuevo);
                      }}
                      sx={{ color: "white" }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "white" }}>
                      {imp.nombre}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 3,
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "#4caf50",
              },
            }}
          >
            Enviar Solicitud
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SolicitudForm;
