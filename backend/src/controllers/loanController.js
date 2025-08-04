const Loan = require('../models/Loan');
const {
  calcularTasaDiaria,
  calcularDias,
  calcularInteresPerdido,
  calcularTotalAPagar
} = require('../utils/loanCalculator');

const validateLoanData = require('../utils/validateLoanData');

const tasaEAnual = 0.0925; // Puedes leer esto desde el .env también
const tasaDiaria = calcularTasaDiaria(tasaEAnual);

const crearPrestamo = async (req, res) => {
  try {
    const { amount, reason, startDate, endDate, accountBalanceAtLoan, interestExtra = 0 } = req.body;

    // Validaciones básicas
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
      user: req.user.id // ¡Recordatorio! Ya se asocian a usuario
    });

    await nuevoPrestamo.save();
    res.status(201).json(nuevoPrestamo);

  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearPrestamo };
