const Loan = require('../models/Loan');
const {
  calcularTasaDiaria,
  calcularDias,
  calcularInteresPerdido,
  calcularTotalAPagar
} = require('../utils/loanCalculator');

const tasaEAnual = 0.0925;
const tasaDiaria = calcularTasaDiaria(tasaEAnual);

// Crear préstamo (ya implementado)
const crearPrestamo = async (req, res) => {
  try {
    const { amount, reason, startDate, endDate, accountBalanceAtLoan, interestExtra = 0 } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a 0' });
    }

    if (!startDate || isNaN(new Date(startDate))) {
      return res.status(400).json({ message: 'Fecha de inicio inválida' });
    }

    if (endDate && isNaN(new Date(endDate))) {
      return res.status(400).json({ message: 'Fecha de finalización inválida' });
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'La fecha de finalización no puede ser anterior a la de inicio' });
    }

    if (!accountBalanceAtLoan || accountBalanceAtLoan < 0) {
      return res.status(400).json({ message: 'Debe indicar el saldo de la cuenta (mayor o igual a 0)' });
    }

    if (interestExtra < 0) {
      return res.status(400).json({ message: 'El interés extra no puede ser negativo' });
    }

    const dias = calcularDias(new Date(startDate), new Date(endDate));
    const interesPerdido = calcularInteresPerdido(amount, dias, tasaDiaria);
    const totalToPay = calcularTotalAPagar(amount, interesPerdido, interestExtra);

    const nuevoPrestamo = new Loan({
      amount,
      reason,
      startDate,
      endDate,
      accountBalanceAtLoan,
      interestLost: interesPerdido,
      interestExtra,
      totalToPay,
      user: req.user.id
    });

    await nuevoPrestamo.save();
    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los préstamos del usuario con filtros, ordenamiento y paginación
const obtenerPrestamos = async (req, res) => {
  try {
    const {
      startDateFrom,
      startDateTo,
      reason,
      minAmount,
      maxAmount,
      sortBy,
      order,
      page = 1,
      limit = 10
    } = req.query;

    const query = { user: req.user.id };

    // Filtros
    if (startDateFrom || startDateTo) {
      query.startDate = {};
      if (startDateFrom) query.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) query.startDate.$lte = new Date(startDateTo);
    }

    if (reason) {
      query.reason = { $regex: reason, $options: 'i' };
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (req.query.isActive !== undefined) {
      const now = new Date();
      const isActive = req.query.isActive === 'true';
      query.endDate = isActive ? { $gte: now } : { $lt: now };
    }

    // Ordenamiento
    const allowedSortFields = ['amount', 'startDate', 'endDate', 'createdAt', 'totalToPay'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    // Paginación
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Obtener total para info de paginación
    const total = await Loan.countDocuments(query);

    const prestamos = await Loan.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    res.json({
      total,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      prestamos
    });
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ message: 'Error al obtener préstamos' });
  }
};

// Obtener un solo préstamo por ID
const obtenerPrestamo = async (req, res) => {
  try {
    const prestamo = await Loan.findOne({ _id: req.params.id, user: req.user.id });
    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    res.json(prestamo);
  } catch (error) {
    console.error('Error al obtener préstamo:', error);
    res.status(500).json({ message: 'Error al obtener préstamo' });
  }
};

// Actualizar un préstamo
const actualizarPrestamo = async (req, res) => {
  try {
    const prestamo = await Loan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!prestamo) {
      const error = new Error('Préstamo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    res.json(prestamo);
  } catch (error) {
    console.error('Error al actualizar préstamo:', error);
    res.status(500).json({ message: 'Error al actualizar préstamo' });
  }
};

// Eliminar un préstamo
const eliminarPrestamo = async (req, res) => {
  try {
    const prestamo = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    res.json({ message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    res.status(500).json({ message: 'Error al eliminar préstamo' });
  }
};

// Estadísticas de prestamos
const obtenerEstadisticasPrestamos = async (req, res) => {
  try {
    const stats = await Loan.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalLoans: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalInterestLost: { $sum: '$interestLost' },
          totalInterestExtra: { $sum: '$interestExtra' },
          totalToPay: { $sum: '$totalToPay' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalLoans: 0,
        totalAmount: 0,
        totalInterestLost: 0,
        totalInterestExtra: 0,
        totalToPay: 0
      });
    }

    res.json(stats[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};


module.exports = {
  crearPrestamo,
  obtenerPrestamos,
  obtenerPrestamo,
  actualizarPrestamo,
  eliminarPrestamo,
  obtenerEstadisticasPrestamos
};