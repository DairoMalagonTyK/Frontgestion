import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const UsuarioDialog = ({ open, onClose, datos }) => {
  if (!datos) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Información del Estudiante</DialogTitle>
      <DialogContent dividers>
        <Typography><strong>Nombre:</strong> {datos.nombre}</Typography>
        <Typography><strong>Teléfono:</strong> {datos.telefono}</Typography>
        <Typography><strong>Cédula:</strong> {datos.cedula}</Typography>
        <Typography><strong>Programa:</strong> {datos.programa}</Typography>
        <Typography><strong>Rol:</strong> {datos.rol}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioDialog;
