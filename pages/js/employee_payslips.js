const employeeId = localStorage.getItem('employeeId');
if (!employeeId) {
  window.location.href = 'employee_login.html';
}

fetch(`php/list_payslips.php?employeeId=${encodeURIComponent(employeeId)}`)
  .then(res => res.json())
  .then(payslips => {
    // Sort by period start date (assumes period is like "February 1, 2025 - February 15, 2025")
    payslips.sort((a, b) => {
      const getStartDate = p => {
        if (!p.period) return new Date(0);
        // Extract the first date in the period string
        const match = p.period.match(/^([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
        return match ? new Date(match[1]) : new Date(0);
      };
      return getStartDate(a) - getStartDate(b);
    });

    const container = document.getElementById("payslipCards");
    if (!payslips.length) {
      container.innerHTML = `<div>No payslips found.</div>`;
    } else {
      container.innerHTML = payslips.map(p => `
        <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between w-full max-w-xl">
          <div>
            <div class="text-xl font-semibold mb-2">${p.period || ''}</div>
            <div class="text-gray-400 text-sm mb-1">Pay Date: ${p.payDate || ''}</div>
            <div class="text-gray-400 text-sm mb-4">Net Pay: ₱${p.netPay ? Number(p.netPay).toFixed(2) : ''}</div>
          </div>
          <a href="${p.url}" target="_blank" class="mt-4 bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded-lg shadow flex items-center justify-center font-semibold transition">
            Download
          </a>
        </div>
      `).join('');
    }
  });

// Set the employee badge dynamically
const badge = document.getElementById('employeeId');
if (badge && employeeId) {
  badge.textContent = employeeId;
}
