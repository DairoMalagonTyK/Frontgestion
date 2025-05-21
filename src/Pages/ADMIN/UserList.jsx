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
} from "@mui/material";
const API = import.meta.env.VITE_API_URL;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API}/api/usuarios`);
        if (!response.ok) throw new Error("Error al cargar usuarios");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
        <Typography sx={{ ml: 2 }}>Cargando usuarios...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar usuarios: {error}
      </Alert>
    );
  }

  if (users.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No hay usuarios registrados.
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3, mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Usuarios del Sistema
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de usuarios">
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
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Programa</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>{user.programa}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>{user.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserList;
