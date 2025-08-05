const Loan = require('../models/Loan');
const { format } = require('date-fns');
const { formatNumber } = require('../utils/formatters');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const exportCSV = async (req, res) => {
    try {
        const userId = req.user.id;
        const formatType = req.query.format || 'csv';

        const filters = { user: userId };

        if (req.query.reason) {
        filters.reason = { $regex: req.query.reason, $options: 'i' };
        }

        if (req.query.startDate) {
        filters.startDate = { $gte: new Date(req.query.startDate) };
        }

        if (req.query.endDate) {
        filters.endDate = filters.endDate || {};
        filters.endDate.$lte = new Date(req.query.endDate);
        }

        const loans = await Loan.find(filters).lean();

        if (formatType === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Préstamos');

        worksheet.columns = [
            { header: 'ID', key: '_id', width: 24 },
            { header: 'Monto', key: 'amount', width: 15 },
            { header: 'Motivo', key: 'reason', width: 30 },
            { header: 'Fecha Inicio', key: 'startDate', width: 15 },
            { header: 'Fecha Fin', key: 'endDate', width: 15 },
            { header: 'Saldo cuenta', key: 'accountBalanceAtLoan', width: 18 },
            { header: 'Interés perdido', key: 'interestLost', width: 18 },
            { header: 'Interés extra', key: 'interestExtra', width: 18 },
            { header: 'Total a pagar', key: 'totalToPay', width: 18 }
        ];

        loans.forEach(loan => {
            worksheet.addRow({
            ...loan,
            startDate: format(new Date(loan.startDate), 'yyyy-MM-dd'),
            endDate: loan.endDate ? format(new Date(loan.endDate), 'yyyy-MM-dd') : ''
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="prestamos.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
        return;
        }

        if (formatType === 'pdf') {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="prestamos.pdf"');

        doc.pipe(res);

        doc.fontSize(18).text('Lista de Préstamos', { align: 'center' });
        doc.moveDown();

        loans.forEach((loan, index) => {
            doc.fontSize(12).text(`Préstamo ${index + 1}`);
            doc.text(`Monto: $${formatNumber(loan.amount)}`);
            doc.text(`Motivo: ${loan.reason}`);
            doc.text(`Fecha Inicio: ${format(new Date(loan.startDate), 'yyyy-MM-dd')}`);
            doc.text(`Fecha Fin: ${loan.endDate ? format(new Date(loan.endDate), 'yyyy-MM-dd') : '-'}`);
            doc.text(`Saldo en cuenta: $${formatNumber(loan.accountBalanceAtLoan)}`);
            doc.text(`Interés perdido: $${formatNumber(loan.interestLost)}`);
            doc.text(`Interés extra: $${formatNumber(loan.interestExtra)}`);
            doc.text(`Total a pagar: $${formatNumber(loan.totalToPay)}`);
            doc.moveDown();
        });

        doc.end();
        return;
        }

        // CSV (por defecto)
        const fields = [
        { label: 'ID', value: '_id' },
        { label: 'Monto', value: row => formatNumber(row.amount) },
        { label: 'Motivo', value: 'reason' },
        { label: 'Fecha Inicio', value: row => format(new Date(row.startDate), 'yyyy-MM-dd') },
        { label: 'Fecha Fin', value: row => row.endDate ? format(new Date(row.endDate), 'yyyy-MM-dd') : '' },
        { label: 'Saldo en cuenta', value: row => formatNumber(row.accountBalanceAtLoan) },
        { label: 'Interés perdido', value: row => formatNumber(row.interestLost) },
        { label: 'Interés extra', value: row => formatNumber(row.interestExtra) },
        { label: 'Total a pagar', value: row => formatNumber(row.totalToPay) }
        ];

        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(loans);

        res.header('Content-Type', 'text/csv');
        res.attachment('prestamos.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Error exportando:', error);
        res.status(500).json({ error: 'Error al exportar préstamos' });
    }
};

module.exports = {
    exportCSV
};
