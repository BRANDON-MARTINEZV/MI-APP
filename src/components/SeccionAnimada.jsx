import { motion } from 'framer-motion';

function SeccionAnimada() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '2rem' }}
    >
      <h2>Sección con animación</h2>
      <p>Esto aparece suavemente usando Framer Motion.</p>
    </motion.div>
  );
}

export default SeccionAnimada;
