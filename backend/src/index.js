const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('API de Control de Préstamos funcionando ✅');
});

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`No se encontró la ruta: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Manejo centralizado de errores
const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler);


// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});
