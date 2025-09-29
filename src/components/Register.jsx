import { useState } from "react";
import { motion } from "framer-motion";
import "./Login.css"; 

const Register = ({ onRegisterSuccess, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [rol, setRol] = useState("user");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/mi-farmacia/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password: clave, rol }),
      });

      const data = await response.json();

      if (data.success) {
        setMensaje("✅ Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        setError("");
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
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
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit">Registrarse</button>
        </form>

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <p>
          <a href="#" onClick={onCancel}>
            ← Volver al login
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
