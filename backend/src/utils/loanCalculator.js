// src/utils/loanCalculator.js

function calcularTasaDiaria(tasaAnual) {
  return Math.pow(1 + tasaAnual, 1 / 365) - 1;
}

function calcularDias(startDate, endDate) {
  const msEnUnDia = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(endDate) - new Date(startDate)) / msEnUnDia);
}

function calcularInteresPerdido(monto, dias, tasaDiaria) {
  return monto * Math.pow(1 + tasaDiaria, dias) - monto;
}

function calcularTotalAPagar(monto, interesPerdido, interesExtra) {
  return monto + interesPerdido + interesExtra;
}

module.exports = {
  calcularTasaDiaria,
  calcularDias,
  calcularInteresPerdido,
  calcularTotalAPagar
};
