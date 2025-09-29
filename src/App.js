import { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) setUsuario(user);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return usuario === 'admin'
    ? <AdminPanel onLogout={cerrarSesion} />
    : <UserPanel usuario={usuario} onLogout={cerrarSesion} />;
};

export default App;

