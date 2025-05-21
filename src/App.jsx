import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import Login from "./Components/Login/Login";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/NavBar/NavBar";
import HomePage from "./Pages/HomePage";
import HomePublic from "./Pages/HomePublic";
import ListaSolicitudes from "./Pages/ListaSolicitudes";
import ListaReservas from "./Pages/ListaReservas";
import SolicitudForm from "./Pages/SolicitudForm";
import AdminDashboard from "./Pages/AdminDashboard";

import "./App.css";

const theme = createTheme({
  palette: {
    primary: { main: "#4caf50" },
    secondary: { main: "#8bc34a" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  // Maneja el logout
  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/">
        <Routes>
          {/* Página pública sin login */}
          <Route path="/" element={<HomePublic />} />

          {/* Página de login explícita */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Rutas del administrador */}
          {usuario?.rol === "Administrador" && (
            <Route
              path="/*"
              element={
                <div className="app-container">
                  <AdminDashboard usuario={usuario} onLogout={handleLogout} />
                  <Footer />
                </div>
              }
            />
          )}

          {/* Rutas protegidas para usuario común */}
          {usuario && usuario.rol !== "Administrador" && (
            <Route
              path="/*"
              element={
                <div className="app-container">
                  <Header usuario={usuario} onLogout={handleLogout} />
                  <NavBar usuario={usuario} />
                  <main className="app-content">
                    <Routes>
                      <Route path="/inicio" element={<HomePage />} />
                      <Route
                        path="/Solicitudes"
                        element={<ListaSolicitudes usuario={usuario} />}
                      />
                      <Route
                        path="/Reservas"
                        element={<ListaReservas usuario={usuario} />}
                      />
                      <Route
                        path="/NuevaSolicitud"
                        element={<SolicitudForm usuario={usuario} />}
                      />
                      <Route path="*" element={<Navigate to="/inicio" />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          )}

          {/* Redirección si alguien entra a ruta desconocida sin sesión */}
          {!usuario && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
