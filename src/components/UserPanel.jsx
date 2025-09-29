import { motion } from 'framer-motion';

const UserPanel = ({ usuario, onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem' }}
    >
      <h1>Bienvenido, {usuario}</h1>
      <button onClick={onLogout}>Cerrar sesión</button>
    </motion.div>
  );
};

export default UserPanel;
