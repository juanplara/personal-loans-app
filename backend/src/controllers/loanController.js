const Loan = require('../models/Loan');
const {
  calcularTasaDiaria,
  calcularDias,
  calcularInteresPerdido,
  calcularTotalAPagar
} = require('../utils/loanCalculator');

const tasaEAnual = 0.0925; // Puedes leer esto desde el .env también
const tasaDiaria = calcularTasaDiaria(tasaEAnual);

const crearPrestamo = async (req, res) => {
  try {
    const { amount, reason, startDate, endDate, accountBalanceAtLoan, interestExtra = 0 } = req.body;

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
      totalToPay
    });

    await nuevoPrestamo.save();
    res.status(201).json(nuevoPrestamo);

  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearPrestamo };
