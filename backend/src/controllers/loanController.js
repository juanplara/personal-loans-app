// controllers/loanController.js
const Loan = require('../models/Loan');

// Crear préstamo
const crearPrestamo = async (req, res, next) => {
  try {
    const { amount, reason, startDate, endDate, accountBalanceAtLoan } = req.body;

    const nuevoPrestamo = new Loan({
      amount,
      reason,
      startDate,
      endDate,
      accountBalanceAtLoan,
      user: req.user.id
    });

    const prestamoGuardado = await nuevoPrestamo.save();
    res.status(201).json(prestamoGuardado);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los préstamos con filtros, búsqueda, orden y paginación
const obtenerPrestamos = async (req, res, next) => {
  try {
    const { estado, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    // Filtro por estado
    if (estado) query.status = estado;

    // Búsqueda por motivo (insensible a mayúsculas)
    if (search) query.reason = { $regex: search, $options: 'i' };

    // Ordenamiento
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prestamos = await Loan.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Loan.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      prestamos
    });
  } catch (error) {
    next(error);
  }
};

// Obtener préstamo por ID
const obtenerPrestamo = async (req, res, next) => {
  try {
    const prestamo = await Loan.findOne({ _id: req.params.id, user: req.user.id });
    if (!prestamo) {
      const err = new Error('Préstamo no encontrado');
      err.statusCode = 404;
      return next(err);
    }
    res.json(prestamo);
  } catch (error) {
    next(error);
  }
};

// Actualizar préstamo
const actualizarPrestamo = async (req, res, next) => {
  try {
    const prestamo = await Loan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!prestamo) {
      const err = new Error('Préstamo no encontrado');
      err.statusCode = 404;
      return next(err);
    }

    res.json(prestamo);
  } catch (error) {
    next(error);
  }
};

// Eliminar préstamo
const eliminarPrestamo = async (req, res, next) => {
  try {
    const prestamo = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!prestamo) {
      const err = new Error('Préstamo no encontrado');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// Estadísticas
const obtenerEstadisticas = async (req, res, next) => {
  try {
    const estadisticas = await Loan.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$status',
          totalPrestamos: { $sum: 1 },
          totalMonto: { $sum: '$amount' }
        }
      }
    ]);

    res.json(estadisticas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearPrestamo,
  obtenerPrestamos,
  obtenerPrestamo,
  actualizarPrestamo,
  eliminarPrestamo,
  obtenerEstadisticas
};
