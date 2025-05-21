import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const CanchasManager = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    estado: "",
  });
  const [canchaEditando, setCanchaEditando] = useState(null);

  const cargarCanchas = async () => {
    try {
      const res = await fetch(`${API}/api/canchas`);
      const data = await res.json();
      setCanchas(data);
    } catch (err) {
      console.error("❌ Error al cargar canchas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanchas();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCrear = async () => {
    const { nombre, tipo, estado } = formData;
    if (!nombre || !tipo || !estado) return alert("Completa todos los campos");

    try {
      const res = await axios.post(`${API}/api/crear-cancha`, formData);
      if (res.data.success) {
        alert("✅ Cancha creada");
        setFormData({ nombre: "", tipo: "", estado: "" });
        setOpenCrear(false);
        cargarCanchas();
      }
    } catch (err) {
      alert("❌ Error al crear cancha");
    }
  };

  const handleEditar = (cancha) => {
    setCanchaEditando(cancha);
    setFormData({
      nombre: cancha.nombre,
      tipo: cancha.tipo,
      estado: cancha.estado,
    });
    setOpenEditar(true);
  };

  const guardarEdicion = async () => {
    try {
      const res = await axios.put(
        `/api/editar-cancha/${canchaEditando.id}`,
        formData
      );
      if (res.data.success) {
        alert("✅ Cancha actualizada");
        setOpenEditar(false);
        cargarCanchas();
      }
    } catch (err) {
      alert("❌ Error al editar cancha");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ color: "primary.dark" }}>
          Canchas Registradas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => {
            setFormData({ nombre: "", tipo: "", estado: "" }); // Limpia todos los campos del formulario
            setOpenCrear(true); // Abre el formulario de creación
          }}
        >
          Crear Nueva
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {canchas.map((cancha) => (
            <Grid item xs={12} sm={6} md={4} key={cancha.id}>
              <Card sx={{ boxShadow: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{cancha.nombre}</Typography>
                  <Typography variant="body2">Tipo: {cancha.tipo}</Typography>
                  <Typography variant="body2">
                    Estado: {cancha.estado}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditar(cancha)}
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      disabled
                      startIcon={<CloudUploadIcon />}
                    >
                      Subir Imagen
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo crear */}
      <Dialog open={openCrear} onClose={() => setOpenCrear(false)}>
        <DialogTitle>Nueva Cancha</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrear(false)}>Cancelar</Button>
          <Button onClick={handleCrear} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo editar */}
      <Dialog open={openEditar} onClose={() => setOpenEditar(false)}>
        <DialogTitle>Editar Cancha</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditar(false)}>Cancelar</Button>
          <Button onClick={guardarEdicion} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CanchasManager;
