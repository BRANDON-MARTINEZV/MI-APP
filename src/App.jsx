import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import Gallery from './components/Gallery';
import SeccionAnimada from './components/SeccionAnimada';
import './index.css';

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario"));
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro';
  });

  useEffect(() => {
    document.body.className = temaOscuro ? 'dark' : '';
    localStorage.setItem('tema', temaOscuro ? 'oscuro' : 'claro');
  }, [temaOscuro]);

  const toggleTema = () => {
    setTemaOscuro(prev => !prev);
  };

  const handleLogin = (user, wantsRegister = false) => {
    if (wantsRegister) {
      setMostrarRegistro(true);
      return;
    }
    localStorage.setItem("usuario", user);
    setUsuario(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const handleRegisterSuccess = () => {
    setMostrarRegistro(false);
  };

  return (
    <>
      <button onClick={toggleTema} className="boton-tema">
        {temaOscuro ? 'Modo Claro' : 'Modo Oscuro'}
      </button>

      {!usuario ? (
        mostrarRegistro ? (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onCancel={() => setMostrarRegistro(false)}
          />
        ) : (
          <Login onLogin={handleLogin} />
        )
      ) : usuario === "admin" ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <>
          <UserPanel usuario={usuario} onLogout={handleLogout} />
          <SeccionAnimada />
          <Gallery />
        </>
      )}
    </>
  );
}

export default App;

