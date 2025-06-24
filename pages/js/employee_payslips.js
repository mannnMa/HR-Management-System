const allPayslips = [
  { employeeId: 'EMP001', period: 'March', payDate: '2025-04-15', netPay: 20000, url: '...' },
  { employeeId: 'EMP002', period: 'March', payDate: '2025-04-15', netPay: 18000, url: '...' },
  // ...more payslips
];

// Always use EMP001
const payslips = allPayslips.filter(p => p.employeeId === 'EMP001');

const container = document.getElementById("payslipCards");
if (!payslips.length) {
  container.innerHTML = `<div>No payslips found.</div>`;
} else {
  container.innerHTML = payslips.map(p => `
    <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between w-full max-w-xl">
      <div>
        <div class="text-xl font-semibold mb-2">${p.period}</div>
        <div class="text-gray-400 text-sm mb-1">Pay Date: ${p.payDate}</div>
        <div class="text-gray-400 text-sm mb-4">Net Pay: ₱${p.netPay}</div>
      </div>
      <a href="${p.url}" target="_blank" class="mt-4 bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded-lg shadow flex items-center justify-center font-semibold transition">
        Download
      </a>
    </div>
  `).join('');
}
