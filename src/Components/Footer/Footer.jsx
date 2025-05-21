import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 2,
        textAlign: "center",
        borderTop: "1px solid #ddd",
        mt: "auto",
      }}
    >
      <Container>
        <Typography variant="body2" color="textSecondary">
          © 2025 SSID - Sistema de Solicitud e Implementos Deportivos
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <img src="/UDLAlogo.png" style={{ height: 24, marginRight: 8 }} />
          <Typography variant="body2" color="textSecondary">
            Universidad de la Amazonia · Florencia, Caquetá
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
