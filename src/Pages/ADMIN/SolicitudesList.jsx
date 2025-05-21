// src/Pages/ADMIN/SolicitudesList.jsx
import UsuarioDialog from "./UsuarioDialog";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
const API = import.meta.env.VITE_API_URL;

const SolicitudesListMUI = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudesPendientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/solicitudes-pendientes`);
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: `HTTP error! status: ${res.status}` }));
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();
        setSolicitudes(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching solicitudes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudesPendientes();
  }, []);

  const aceptarSolicitud = async (id) => {
    try {
      const res = await fetch(`${API}/api/aceptar-solicitud/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al aceptar la solicitud");
      const data = await res.json();
      setSolicitudes(solicitudes.filter((s) => s.id !== id));
    } catch (error) {
      console.error("❌ Error en el frontend al aceptar:", error);
    }
  };

  const rechazarSolicitud = async (id) => {
    try {
      const res = await fetch(`${API}/api/rechazar-solicitud/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al rechazar solicitud");
      setSolicitudes(solicitudes.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState(null);

  const verInfoEstudiante = async (correo) => {
    try {
      const res = await fetch(
        `${API}/api/usuario-detalle?correo=${encodeURIComponent(correo)}`
      );
      if (!res.ok)
        throw new Error("No se pudo obtener la información del estudiante");
      const data = await res.json();
      setDatosUsuario(data);
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>
          Cargando solicitudes pendientes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar las solicitudes: {error}
      </Alert>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No hay solicitudes pendientes por el momento.
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        {" "}
        {/* Permite scroll si la tabla es muy larga */}
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          aria-label="tabla de solicitudes pendientes"
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                },
              }}
            >
              <TableCell>Usuario</TableCell>
              <TableCell>Cancha</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora Inicio</TableCell>
              <TableCell>Hora Fin</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow
                key={solicitud.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {solicitud.usuarioNombre || "N/A"}
                  <Tooltip title="Ver información del estudiante">
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      aria-label="info"
                      onClick={() => verInfoEstudiante(solicitud.usuarioCorreo)}
                    >
                      <InfoIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{solicitud.canchaNombre || "N/A"}</TableCell>
                <TableCell>
                  {solicitud.fecha
                    ? new Date(
                        `${solicitud.fecha}T00:00:00`
                      ).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>{solicitud.horaInicio || "N/A"}</TableCell>
                <TableCell>{solicitud.horaFin || "N/A"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Aceptar solicitud">
                    <IconButton
                      aria-label="aceptar"
                      color="success"
                      onClick={() => aceptarSolicitud(solicitud.id)}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar solicitud">
                    <IconButton
                      aria-label="rechazar"
                      color="error"
                      onClick={() => rechazarSolicitud(solicitud.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UsuarioDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        datos={datosUsuario}
      />
    </Paper>
  );
};

export default SolicitudesListMUI;
