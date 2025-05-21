import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [programa, setPrograma] = useState("");
  const [rol] = useState("Usuario");
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeNombre = (e) => setNombre(e.target.value);
  const handleChangePrograma = (e) => setPrograma(e.target.value);

  async function registrarUsuario(nombre, correo, contrasenia) {
    try {
      console.log("📤 Enviando a backend:");
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          contrasenia,
          programaNombre: programa,
          rolNombre: rol,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: data.message,
        });
        setEmail("");
        setPassword("");
        setNombre("");
        setPrograma("");
        setIsRegistrando(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Ocurrió un error.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo contactar con el servidor (¿está encendido el backend?).",
      });
      console.error("❌ Error en registrarUsuario:", error.message);
    }
  }

  async function iniciarSesion(correo, contrasenia) {
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasenia }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: `Bienvenido ${data.nombre}`,
        }).then(() => {
          const usuarioData = { nombre: data.nombre, correo, rol: data.rol };
          if (typeof onLogin === "function") {
            onLogin(usuarioData);
            localStorage.setItem("correo", usuarioData.correo);
            if (usuarioData.rol === "Administrador") {
              navigate("/admin");
            } else {
              navigate("/inicio");
            }
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo contactar con el servidor.",
      });
      console.error(error);
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    console.log("🧪 Formulario enviado - Registrando:", isRegistrando);
    if (isRegistrando) {
      registrarUsuario(nombre, email, password);
    } else {
      iniciarSesion(email, password);
    }
  }

  const handleChangeForm = () => {
    setIsRegistrando(!isRegistrando);
    setEmail("");
    setPassword("");
    setNombre("");
    setPrograma("");
  };

  return (
    <div className="contenedor__todo">
      <div className="caja__trasera">
        {isRegistrando ? (
          <div>
            <h3>¿Ya tienes cuenta?</h3>
            <p>Inicia sesión para acceder</p>
            <button className="botons" onClick={handleChangeForm}>
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <div id="caja__trasera2">
            <h3>¿Aún no tienes cuenta?</h3>
            <p>Regístrate para empezar</p>
            <button className="botons" onClick={handleChangeForm}>
              Registrarse
            </button>
          </div>
        )}
      </div>

      <div
        className={`contenedor__login-register ${
          isRegistrando ? "isRegistrando" : ""
        }`}
      >
        {isRegistrando ? (
          <form className="formulario__register" onSubmit={submitHandler}>
            <h2>Regístrate</h2>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              required
              value={nombre}
              onChange={handleChangeNombre}
              className="imputs"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={handleChangeEmail}
              className="imputs"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={handleChangePassword}
              className="imputs"
            />
            <input
              name="programa"
              type="text"
              placeholder="Programa académico"
              required
              value={programa}
              onChange={handleChangePrograma}
              className="imputs"
            />
            <button type="submit">Registrar</button>
          </form>
        ) : (
          <form className="formulario__login" onSubmit={submitHandler}>
            <h2>Iniciar Sesión - SSID</h2>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={handleChangeEmail}
              className="imputs"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={handleChangePassword}
              className="imputs"
            />
            <button type="submit">Iniciar Sesión</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
