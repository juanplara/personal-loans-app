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

// Obtener todos los préstamos del usuario
const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await Loan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(prestamos);
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
      return res.status(404).json({ message: 'Préstamo no encontrado' });
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

module.exports = {
  crearPrestamo,
  obtenerPrestamos,
  obtenerPrestamo,
  actualizarPrestamo,
  eliminarPrestamo
};
