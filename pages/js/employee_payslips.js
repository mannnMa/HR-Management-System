const employeeId = localStorage.getItem('employeeId');
if (!employeeId) {
  window.location.href = 'employee_login.html';
}

function computePayDate(period) {
  if (!period) return '';
  const parts = period.split(' - ');
  if (parts.length !== 2) return '';
  const endDate = new Date(parts[1]);
  if (isNaN(endDate)) return '';

  const day = endDate.getDate();
  const month = endDate.getMonth(); // 0-based
  const year = endDate.getFullYear();

  let payDate;

  if (day === 15) {
    // Pay date is last day of the same month
    const lastDay = new Date(year, month + 1, 0).getDate();
    payDate = new Date(year, month, lastDay);
  } else if (day === 30 || day === 31) {
    // Pay date is 15th of next month
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    payDate = new Date(nextYear, nextMonth, 15);
  } else {
    // Default: use the end date itself
    payDate = endDate;
  }

  // Format: Month DD, YYYY
  return payDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

fetch(`php/list_payslips.php?employeeId=${encodeURIComponent(employeeId)}`)
  .then(res => res.json())
  .then(payslips => {
    // Sort payslips by period end date descending (latest first)
    payslips.sort((a, b) => {
      const getEndDate = p => {
        if (!p.period) return new Date(0);
        const parts = p.period.split(' - ');
        return new Date(parts[1]);
      };
      return getEndDate(b) - getEndDate(a);
    });

    const container = document.getElementById("payslipCards");
    if (!payslips.length) {
      container.innerHTML = `<div>No payslips found.</div>`;
    } else {
      container.innerHTML = payslips.map(p => `
        <div class="payslip-card">
          <div class="pay-period">${p.period || ''}</div>
          <div class="pay-date">Pay Date: ${computePayDate(p.period)}</div>
          <div class="net-pay">Net Pay: ₱${p.netPay ? Number(p.netPay).toLocaleString() : ''}</div>
          <a href="${p.url}" target="_blank" style="text-decoration:none;">
            <button class="download-btn" type="button">
              Download
              <svg viewBox="0 0 24 24" style="margin-left:6px;"><path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
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
