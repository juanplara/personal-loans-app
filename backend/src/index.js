// ─────────────────────────────────────────────────────────────
// 📦 Importaciones de paquetes externos
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// 📄 Importar rutas
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');

// 🛡️ Importar middlewares personalizados
const errorHandler = require('./middlewares/errorMiddleware');

// 📁 Cargar variables de entorno
dotenv.config();

// 🚀 Inicializar aplicación
const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────
// 🛡️ Seguridad y protección

// Seguridad con cabeceras HTTP
app.use(helmet());

// Limitar solicitudes por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
});
app.use(limiter);

// Limpiar entrada de scripts maliciosos (XSS) usando librería xss
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
});

// ─────────────────────────────────────────────────────────────
// 🔧 Middlewares generales

app.use(cors()); // Habilitar CORS (actualmente abierto a todos)
app.use(express.json()); // Parsear JSON en solicitudes

// ─────────────────────────────────────────────────────────────
// 🔗 Rutas principales

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Control de Préstamos funcionando ✅');
});

// ─────────────────────────────────────────────────────────────
// ❌ Middleware para rutas no encontradas

app.use((req, res, next) => {
  const error = new Error(`No se encontró la ruta: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 🧱 Middleware centralizado para manejo de errores
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────
// 🔌 Conexión a la base de datos y levantar el servidor

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conexión a MongoDB exitosa');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Error al conectar a MongoDB:', err);
});
