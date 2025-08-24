const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [1, 'El monto debe ser mayor a 0']
  },
  reason: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  accountBalanceAtLoan: {
    type: Number,
    required: true,
    min: [0, 'El saldo no puede ser negativo']
  },
  interestLost: {
    type: Number
  },
  interestExtra: {
    type: Number,
    default: 0,
    min: [0, 'El interés extra no puede ser negativo']
  },
  totalToPay: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pendiente', 'pagado', 'atrasado'],
    default: 'pendiente'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
