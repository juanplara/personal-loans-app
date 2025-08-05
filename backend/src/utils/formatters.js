const formatNumber = (value) => {
  return value?.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });
};

module.exports = { formatNumber };
