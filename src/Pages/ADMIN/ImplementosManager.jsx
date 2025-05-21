import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const ImplementosManager = () => {
  const [canchas, setCanchas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    marca: "",
    cantidad: "",
    canchaId: "",
  });
  const [editando, setEditando] = useState(false);

  const cargarCanchasYImplementos = async () => {
    try {
      const res = await axios.get(`${API}/api/canchas-y-sus-implementos`);
      setCanchas(res.data);
    } catch (err) {
      console.error("Error al cargar implementos:", err);
    }
  };

  useEffect(() => {
    cargarCanchasYImplementos();
  }, []);

  const handleOpenCrear = (canchaId) => {
    setFormData({ id: "", nombre: "", marca: "", cantidad: "", canchaId });
    setEditando(false);
    setOpenDialog(true);
  };

  const handleOpenEditar = (implemento, canchaId) => {
    setFormData({
      id: implemento.id,
      nombre: implemento.nombre,
      marca: implemento.marca,
      cantidad: implemento.cantidad,
      canchaId,
    });
    setEditando(true);
    setOpenDialog(true);
  };

  const handleGuardar = async () => {
    const { id, nombre, marca, cantidad, canchaId } = formData;
    if (!nombre || !marca || !cantidad)
      return alert("Completa todos los campos");

    try {
      if (editando) {
        await axios.put(`${API}/api/editar-implemento/${id}`, {
          nombre,
          marca,
          cantidad,
        });
        alert("✅ Implemento actualizado");
      } else {
        await axios.post(`${API}/api/crear-implemento`, {
          nombre,
          marca,
          cantidad,
          canchaId,
        });
        alert("✅ Implemento creado");
      }
      setOpenDialog(false);
      cargarCanchasYImplementos();
    } catch (err) {
      alert("❌ Error al guardar");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Implementos por Cancha
      </Typography>

      <Grid container spacing={3}>
        {canchas.map((cancha) => (
          <Grid item xs={12} sm={6} md={4} key={cancha.id}>
            <Paper
              sx={{
                p: 2,
                boxShadow: 4,
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">{cancha.nombre}</Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={() => handleOpenCrear(cancha.id)}
                >
                  Agregar Implemento
                </Button>
              </Stack>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Implementos:
                </Typography>

                {cancha.implementos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Sin implementos asignados.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Nombre</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Marca</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Cantidad</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Editar</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cancha.implementos.map((imp) => (
                          <TableRow key={imp.id}>
                            <TableCell>{imp.nombre}</TableCell>
                            <TableCell>{imp.marca}</TableCell>
                            <TableCell>{imp.cantidad}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => handleOpenEditar(imp, cancha.id)}
                              >
                                Editar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editando ? "Editar Implemento" : "Nuevo Implemento"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Marca"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Cantidad"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: e.target.value })
              }
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImplementosManager;
