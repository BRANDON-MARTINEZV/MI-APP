import { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/mi-farmacia/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password: clave })
      });

      const data = await response.json();

      if (data.success) {
       
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("rol", data.rol);

        
        onLogin(data.rol === "admin" ? "admin" : data.usuario);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("❌ Error de conexión con el servidor");
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <img src="logo.jpg" alt="Logo de farmacia" className="logo" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Correo electrónico"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type={mostrarClave ? 'text' : 'password'}
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
          <span
            onClick={() => setMostrarClave(!mostrarClave)}
            className="eye-icon"
          >
            👁️
          </span>
          <button type="submit">LOGIN</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          ¿No tienes cuenta?{" "}
        <a href="#" onClick={(e) => { 
           e.preventDefault(); 
             onLogin(null, true); 
          }}>
        Regístrate aquí
      </a>
      </p>

      </div>
    </motion.div>
  );
};

export default Login;
