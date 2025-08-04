const validateLoanData = (data) => {
  const { amount, reason, startDate, endDate, accountBalanceAtLoan, interestExtra } = data;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return 'El monto del préstamo debe ser un número mayor a cero';
  }

  if (!reason || reason.trim() === '') {
    return 'El motivo del préstamo es obligatorio';
  }

  if (!startDate || isNaN(Date.parse(startDate))) {
    return 'La fecha de inicio no es válida';
  }

  if (!endDate || isNaN(Date.parse(endDate))) {
    return 'La fecha de finalización no es válida';
  }

  if (!accountBalanceAtLoan || isNaN(accountBalanceAtLoan)) {
    return 'El saldo en la cuenta debe ser un número válido';
  }

  if (interestExtra !== undefined && isNaN(interestExtra)) {
    return 'El interés extra debe ser un número';
  }

  return null; // todo válido
};

module.exports = validateLoanData;
