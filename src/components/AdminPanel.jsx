// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaImage, FaVideo, FaList, FaBox, FaEnvelope, FaUndo,
  FaHome, FaBlog, FaChartPie, FaFolder, FaBook, FaMagic,
  FaPhotoVideo, FaPalette, FaCogs, FaReact, FaSignOutAlt
} from 'react-icons/fa';
import './AdminPanel.css';

/* ---------- === ADICIONES PARA MAPA (Leaflet) === ---------- */
/* IMPORTAR react-leaflet y leaflet sólo si instalas las dependencias */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

/* Arreglo común para que el icono del marker funcione con bundlers (CRA) */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
/* ---------- === FIN ADICIONES MAPA === ---------- */

const AdminPanel = ({ onLogout }) => {
  const [seccion, setSeccion] = useState('imagenes');
  const [mostrarMas, setMostrarMas] = useState(false);

  /* ========== ADICIONES: ESTADOS Y EFECTOS ========== */
  // Clima
  const [clima, setClima] = useState(null);
  // Medicamento (resultado de búsqueda)
  const [medicamento, setMedicamento] = useState(null);
  const [busquedaMed, setBusquedaMed] = useState('');
  // Coordenadas para el mapa (Tláhuac CDMX según tu info)
  const position = [19.2752, -99.0096];

  useEffect(() => {
    // Fetch clima: usa REACT_APP_OPENWEATHER_KEY en .env (ver nota abajo)
    const key = process.env.REACT_APP_OPENWEATHER_KEY || 'TU_API_KEY';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mexico&appid=${key}&units=metric&lang=es`)
      .then(res => res.json())
      .then(data => {
        if (data && data.main && data.weather) {
          setClima({
            temp: data.main.temp,
            desc: data.weather[0].description
          });
        }
      })
      .catch(err => {
        console.error('Error al obtener clima:', err);
      });
  }, []);

  // Buscar medicamento usando FDA API; primero por generic_name, si no encuentra prueba brand_name
  const buscarMedicamento = async (nombre) => {
    if (!nombre || nombre.trim() === '') return;
    setMedicamento(null);
    try {
      const q = encodeURIComponent(nombre.trim());
      let res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${q}&limit=1`);
      let data = await res.json();

      if (!data.results || data.results.length === 0) {
        // intentar por brand_name
        res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${q}&limit=1`);
        data = await res.json();
      }

      if (data.results && data.results.length > 0) {
        const info = data.results[0];
        setMedicamento({
          nombre: nombre,
          uso: info.indications_and_usage ? info.indications_and_usage[0] : 'No disponible',
          efectos: info.adverse_reactions ? info.adverse_reactions[0] : 'No disponible',
          genericos: info.openfda?.generic_name ? info.openfda.generic_name.join(', ') : 'No disponible',
          clasificacion: info.openfda?.pharm_class_epc?.join(', ')
                       || info.openfda?.pharm_class_cs?.join(', ')
                       || 'No disponible'
        });
      } else {
        setMedicamento({ nombre, uso: 'No encontrado', efectos: 'No encontrado', genericos: 'No encontrado', clasificacion: 'No encontrado' });
      }
    } catch (err) {
      console.error('Error en búsqueda de medicamento:', err);
      setMedicamento({ nombre, uso: 'Error', efectos: 'Error', genericos: '-', clasificacion: '-' });
    }
  };
  /* ========== FIN ADICIONES ========== */

  const renderContenido = () => {
    switch (seccion) {
      case 'imagenes':
        return (
          <motion.div key="imagenes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Listas de Imágenes</h2>
            <ul className="lista-imagenes">
              {['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'imagen4.jpg', 'imagen5.jpg','imagen6.jpg','imagen7.jpg','imagen8.png',
                'imagen9.jpg','imagen10.webp','imagen11.png','imagen12.jpg','imagen13.png','imagen14.png','imagen15.png'
              ].map((img, i) => (
                <li key={i}><img src={img} alt={`Imagen ${i + 1}`} className="imagen" /></li>
              ))}
            </ul>
          </motion.div>
        );

      case 'videos':
        return (
          <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Videos y Audios</h2>
            <video controls width="100%">
              <source src="video_farma-tec.mp4" type="video/mp4" />
            </video>
            <audio controls>
              <source src="California Love (Original Version).mp3" type="audio/mp3" />
            </audio>
          </motion.div>
        );

      case 'listas':
        return (
          <motion.div key="listas" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Productos Recomendados</h2>
            <ul className="lista-estetica">
              <li>💊 Paracetamol 500mg</li>
              <li>🧴 Alcohol etílico 70%</li>
              <li>🧪 Jarabe para la tos infantil</li>
              <li>🩹 Curitas adhesivas</li>
            </ul>

            <h3>Consejos Farmacéuticos</h3>
            <ol className="lista-estetica">
              <li>No automedicarse</li>
              <li>Leer bien las etiquetas</li>
              <li>Consultar al farmacéutico</li>
              <li>Guardar medicamentos fuera del alcance de los niños</li>
            </ol>

            <p onClick={() => setMostrarMas(!mostrarMas)} className="toggle-ver-mas">
              {mostrarMas ? 'Ver menos ▲' : 'Ver más ▼'}
            </p>

            {mostrarMas && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>Productos en promoción</h3>
                <ul className="lista-estetica">
                  <li>🧼 Gel antibacterial x3</li>
                  <li>🩺 Termómetro digital</li>
                  <li>😷 Mascarillas N95</li>
                </ul>
              </motion.div>
            )}
          </motion.div>
        );

      case 'contenedores':
        return (
          <motion.div key="contenedores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="contenedores">
            <h2>💊 Información sobre Medicamentos</h2>

            {/* <-- AÑADÍ: búsqueda API MEDICAMENTOS (no removí las tarjetas informativas) */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Buscar medicamento (ej: ibuprofen)"
                value={busquedaMed}
                onChange={(e) => setBusquedaMed(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') buscarMedicamento(busquedaMed); }}
                style={{ padding: '8px', width: '70%', marginRight: 8 }}
              />
              <button onClick={() => buscarMedicamento(busquedaMed)} style={{ padding: '8px 12px' }}>Buscar</button>
            </div>

            {medicamento && (
              <motion.div className="tarjeta" whileHover={{ scale: 1.02 }}>
                <h3>{medicamento.nombre}</h3>
                <p><strong>Clasificación:</strong> {medicamento.clasificacion}</p>
                <p><strong>Genéricos:</strong> {medicamento.genericos}</p>
                <p><strong>Uso:</strong> {medicamento.uso}</p>
                <p><strong>Efectos secundarios:</strong> {medicamento.efectos}</p>
              </motion.div>
            )}

            {/* Mantuve las tarjetas informativas originales */}
            <div className="tarjetas-contenedor" style={{ marginTop: 18 }}>
              <motion.div className="tarjeta" whileHover={{ scale: 1.02 }}>
                <h3>🧪 ¿Qué son los medicamentos?</h3>
                <p>
                  Son sustancias químicas que se usan para prevenir, tratar o curar enfermedades. Algunos requieren receta médica y otros no.
                </p>
              </motion.div>

              <motion.div className="tarjeta" whileHover={{ scale: 1.02 }}>
                <h3>📂 Clasificación de medicamentos</h3>
                <ul>
                  <li><strong>Por uso:</strong> Analgésicos, antibióticos, antihistamínicos, etc.</li>
                  <li><strong>Por vía:</strong> Oral, inyectable, tópica (piel), oftálmica, etc.</li>
                </ul>
              </motion.div>

              <motion.div className="tarjeta" whileHover={{ scale: 1.02 }}>
                <h3>⚠️ Uso responsable</h3>
                <ul>
                  <li>No automedicarse</li>
                  <li>Consultar al médico o farmacéutico</li>
                  <li>Leer siempre las indicaciones</li>
                  <li>Guardar en lugar fresco y seco</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'contacto':
        return (
          <motion.div key="contacto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="contacto">
            <h2>📞 Contacto de la Farmacia</h2>
            <p>Bienvenido a la sección de contacto de nuestra farmacia. Aquí podrás encontrar los detalles sobre cómo ponerte en contacto con nosotros.</p>

            <div className="contacto-info">
              <h3>📍 Información de la Empresa</h3>
              <ul>
                <li><strong>Nombre:</strong> Farma-Tec</li>
                <li><strong>Dirección:</strong> Av Estanislao Ramírez Ruiz 301,<br />Amp. Selene, Tláhuac, 13420 Ciudad de México, CDMX</li>
                <li><strong>Correo Electrónico:</strong> <a href="mailto:farma-tec@gmail.com">farma-tec@gmail.com</a></li>
                <li><strong>Teléfono:</strong> <a href="tel:+525589785474">+52 55-89-78-54-74</a></li>
              </ul>

              <h3>🕐 Horario de Atención</h3>
              <p>De <strong>lunes a viernes</strong>, de <strong>9:00 AM a 6:00 PM</strong>.<br />
                <strong>Sábados</strong> de <strong>10:00 AM a 2:00 PM</strong>.</p>
            </div>

            {/* <--Mapa interactivo  */}
            <h3>📍 Ubicacion </h3>
            <div style={{ height: 320, width: '100%', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
              <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>
                    Farma-Tec <br /> Av Estanislao Ramírez Ruiz 301
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        );

      case 'devoluciones':
        return (
          <motion.div key="devoluciones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="devoluciones">
            <h2>📦 Formulario de Devolución de Producto</h2>
            <p>Por favor, completa el siguiente formulario para iniciar el proceso de devolución:</p>

            <form className="formulario-devolucion">
              <label>
                Nombre completo:
                <input type="text" placeholder="Ej. Juan Pérez" required />
              </label>

              <label>
                Correo electrónico:
                <input type="email" placeholder="Ej. juan@example.com" required />
              </label>

              <label>
                Producto a devolver:
                <input type="text" placeholder="Nombre del producto" required />
              </label>

              <label>
                Fecha de compra:
                <input type="date" required />
              </label>

              <label>
                Motivo de la devolución:
                <textarea placeholder="Describe el motivo..." rows="4" required></textarea>
              </label>

              <label>
                Evidencia (foto del producto, ticket, etc.):
                <input type="file" accept="image/*,.pdf" />
              </label>

              <button type="submit">Enviar solicitud</button>
            </form>

            <h3>📻 Clima actual:</h3>
            {/* <-- AÑADÍ: muestra datos reales si están disponibles */}
            {clima ? (
              <p>{clima.temp}°C - {clima.desc}</p>
            ) : (
              <p>Cargando clima...</p>
            )}

            <audio autoPlay loop>
              <source src="Write this down 2pac,The notorious,Biggie,Snoop dogg,Ice cube.mp3" type="audio/mpeg" />
            </audio>
          </motion.div>
        );

      default:
        return <p>Sección no encontrada</p>;
    }
  };

  return (
    <div className="contenedor">
      <div className="menu-lateral">
        <h1>Farma-Tec</h1>
        <img src="/logo.jpg" alt="Logo Farma-Tec" className="logo-farmatec" />
        <nav className="menu-farmacia">
          <ul>
            <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('imagenes')}><FaImage /> Imágenes</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('videos')}><FaVideo /> Videos y Audios</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('listas')}><FaList /> Listas</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('contenedores')}><FaBox /> Contenedores</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('contacto')}><FaEnvelope /> Contacto</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={() => setSeccion('devoluciones')}><FaUndo /> Devoluciones</button>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }}>
      <button onClick={onLogout}><FaSignOutAlt /> Cerrar sesión</button>
    </motion.li>
          </ul>
        </nav>
      </div>

      <div className="contenido">
        {renderContenido()}
      </div>
    </div>
  );
};

export default AdminPanel;
