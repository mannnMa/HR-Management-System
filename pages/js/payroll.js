// --- Payroll System with LocalStorage ---

// DOM Elements
const employeeNameEl = document.getElementById('employeeName');
const employeeIdEl = document.getElementById('employeeId');
const basicSalaryEl = document.getElementById('basicSalary');
const workingDaysEl = document.getElementById('workingDays');
const daysWorkedEl = document.getElementById('daysWorked');
const overtimeHoursEl = document.getElementById('overtimeHours');
const allowancesEl = document.getElementById('allowances');
const otherDeductionsInputEl = document.getElementById('otherDeductions');

const summaryBasicPayEl = document.getElementById('summaryBasicPay');
const summaryTotalAllowancesEl = document.getElementById('summaryTotalAllowances');
const summaryOvertimePayEl = document.getElementById('summaryOvertimePay');
const summaryGrossPayEl = document.getElementById('summaryGrossPay');
const summaryWithholdingTaxEl = document.getElementById('summaryWithholdingTax');
const summarySSSEl = document.getElementById('summarySSS');
const summaryPhilHealthEl = document.getElementById('summaryPhilHealth');
const summaryPagibigEl = document.getElementById('summaryPagibig');
const summaryOtherDeductionsEl = document.getElementById('summaryOtherDeductions');
const summaryTotalDeductionsEl = document.getElementById('summaryTotalDeductions');
const summaryNetPayEl = document.getElementById('summaryNetPay');

const resetButton = document.getElementById('resetButton');
const savePayrollButton = document.getElementById('savePayrollButton');
const generatePayslipButton = document.getElementById('generatePayslipButton');
const payrollForm = document.getElementById('payrollForm');
const messageArea = document.getElementById('messageArea');

// --- Helper Functions ---
function formatCurrency(amount) {
    return `₱${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

function showMessage(message, type = "info") {
    messageArea.textContent = message;
    messageArea.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700', 'bg-yellow-100', 'text-yellow-700', 'bg-blue-100', 'text-blue-700');
    if (type === "success") {
        messageArea.classList.add('bg-green-100', 'text-green-700');
    } else if (type === "error") {
        messageArea.classList.add('bg-red-100', 'text-red-700');
    } else if (type === "warning") {
        messageArea.classList.add('bg-yellow-100', 'text-yellow-700');
    } else {
        messageArea.classList.add('bg-blue-100', 'text-blue-700');
    }
    messageArea.classList.remove('hidden');
    setTimeout(() => {
        if (messageArea.textContent === message) {
            messageArea.classList.add('hidden');
        }
    }, 5000);
}

// --- Calculation Logic ---
const STANDARD_MONTHLY_WORKING_DAYS = 22;

function calculateProratedBasicPay(monthlySalary, daysWorkedInPeriod, standardDaysInMonth) {
    if (!monthlySalary || !daysWorkedInPeriod || !standardDaysInMonth || standardDaysInMonth <= 0) return 0;
    return (monthlySalary / standardDaysInMonth) * daysWorkedInPeriod;
}

function calculateOvertimePay(basicSalary, overtimeHours) {
    if (!basicSalary || !overtimeHours) return 0;
    const dailyRate = basicSalary / STANDARD_MONTHLY_WORKING_DAYS;
    const hourlyRate = dailyRate / 8;
    const otPay = hourlyRate * 1.25 * overtimeHours;
    return otPay;
}

function calculateSSS(grossPay, isHalfPeriod = false) {
    if (grossPay <= 0) return 0;
    let msc = 0;
    if (grossPay < 3250) msc = 3250;
    else if (grossPay >= 30000) msc = 30000;
    else msc = Math.ceil(grossPay / 500) * 500;
    
    const contribution = msc * 0.045;
    return isHalfPeriod ? contribution / 2 : contribution;
}

function calculatePhilHealth(basicSalary, isHalfPeriod = false) {
    if (basicSalary <= 0) return 0;
    let premiumBase = Math.max(10000, Math.min(basicSalary, 100000));
    const contribution = premiumBase * 0.025;
    return isHalfPeriod ? contribution / 2 : contribution;
}

function calculatePagibig(basicSalary, isHalfPeriod = false) {
    if (basicSalary <= 0) return 0;
    let rate = basicSalary < 1500 ? 0.01 : 0.02;
    let contribution = basicSalary * rate;
    contribution = Math.min(contribution, 100);
    return isHalfPeriod ? contribution / 2 : contribution;
}

function calculateWithholdingTax(grossPay, sss, philhealth, pagibig, isHalfPeriod = false) {
    const taxableIncome = grossPay - sss - philhealth - pagibig;
    let tax = 0;
    
    if (taxableIncome <= 20833) {
        tax = 0;
    } else if (taxableIncome <= 33333) {
        tax = (taxableIncome - 20833) * 0.15;
    } else if (taxableIncome <= 66667) {
        tax = 1875 + (taxableIncome - 33333) * 0.20;
    } else if (taxableIncome <= 166667) {
        tax = 8541.80 + (taxableIncome - 66667) * 0.25;
    } else if (taxableIncome <= 666667) {
        tax = 33541.80 + (taxableIncome - 166667) * 0.30;
    } else {
        tax = 183541.80 + (taxableIncome - 666667) * 0.35;
    }
    
    return isHalfPeriod ? tax / 2 : tax;
}

function performCalculations() {
    const basicSalary = Math.max(0, parseFloat(basicSalaryEl.value) || 0);
    const actualDaysWorked = Math.max(0, parseFloat(daysWorkedEl.value) || STANDARD_MONTHLY_WORKING_DAYS);
    const overtimeHours = Math.max(0, parseFloat(overtimeHoursEl.value) || 0);
    const allowances = Math.max(0, parseFloat(allowancesEl.value) || 0);
    const otherDeductions = Math.max(0, parseFloat(otherDeductionsInputEl.value) || 0);

    const payrollPeriod = workingDaysEl.value;
    const isHalfPeriod = payrollPeriod === "15 Days";

    const actualBasicPayForPeriod = calculateProratedBasicPay(basicSalary, actualDaysWorked, STANDARD_MONTHLY_WORKING_DAYS);
    const overtimePay = calculateOvertimePay(basicSalary, overtimeHours);
    const grossPay = actualBasicPayForPeriod + allowances + overtimePay;

    const sssContribution = calculateSSS(grossPay, isHalfPeriod);
    const philHealthContribution = calculatePhilHealth(basicSalary, isHalfPeriod);
    const pagibigContribution = calculatePagibig(basicSalary, isHalfPeriod);
    const withholdingTax = calculateWithholdingTax(grossPay, sssContribution, philHealthContribution, pagibigContribution, isHalfPeriod);

    const totalDeductions = sssContribution + philHealthContribution + pagibigContribution + withholdingTax + otherDeductions;
    const netPay = grossPay - totalDeductions;

    summaryBasicPayEl.textContent = formatCurrency(actualBasicPayForPeriod);
    summaryTotalAllowancesEl.textContent = formatCurrency(allowances);
    summaryOvertimePayEl.textContent = formatCurrency(overtimePay);
    summaryGrossPayEl.textContent = formatCurrency(grossPay);

    summaryWithholdingTaxEl.textContent = formatCurrency(withholdingTax);
    summarySSSEl.textContent = formatCurrency(sssContribution);
    summaryPhilHealthEl.textContent = formatCurrency(philHealthContribution);
    summaryPagibigEl.textContent = formatCurrency(pagibigContribution);
    summaryOtherDeductionsEl.textContent = formatCurrency(otherDeductions);
    summaryTotalDeductionsEl.textContent = formatCurrency(totalDeductions);
    summaryNetPayEl.textContent = formatCurrency(netPay);

    return {
        employeeName: employeeNameEl.value,
        employeeId: employeeIdEl.value,
        payrollPeriod: payrollPeriod,
        basicSalaryInput: basicSalary,
        daysWorked: actualDaysWorked,
        actualBasicPayForPeriod: actualBasicPayForPeriod,
        overtimeHours: overtimeHours,
        overtimePay: overtimePay,
        allowances: allowances,
        grossPay: grossPay,
        sssContribution: sssContribution,
        philHealthContribution: philHealthContribution,
        pagibigContribution: pagibigContribution,
        withholdingTax: withholdingTax,
        otherDeductions: otherDeductions,
        totalDeductions: totalDeductions,
        netPay: netPay,
        calculatedAt: new Date().toISOString()
    };
}

// --- Event Listeners ---
[basicSalaryEl, overtimeHoursEl, allowancesEl, otherDeductionsInputEl].forEach(el => {
    el.addEventListener('input', () => {
        if (parseFloat(el.value) < 0) {
            el.value = 0;
            showMessage("Negative numbers are not allowed.", "warning");
        }
        performCalculations();
    });
});

[employeeNameEl, employeeIdEl, workingDaysEl].forEach(el => {
    el.addEventListener('input', performCalculations);
});


resetButton.addEventListener('click', () => {
    payrollForm.reset();
    performCalculations();
    showMessage("Form reset.", "info");
});
// Update allowed range based on payroll period
workingDaysEl.addEventListener('change', () => {
  const period = workingDaysEl.value;
  if (period === "15 Days") {
    daysWorkedEl.max = 15;
    if (parseInt(daysWorkedEl.value) > 15) {
      daysWorkedEl.value = 15;
      showMessage("For 15 Days, actual days worked can't exceed 15.", "warning");
    }
  } else if (period === "1 Month") {
    daysWorkedEl.max = 30;
    if (parseInt(daysWorkedEl.value) > 30) {
      daysWorkedEl.value = 30;
      showMessage("For 1 Month, actual days worked can't exceed 30.", "warning");
    }
  }
});
    // Apply the max value once when the page loads
    workingDaysEl.dispatchEvent(new Event('change'));

function validateRequiredFields() {
  let valid = true;

  const requiredFields = [
    employeeNameEl,
    employeeIdEl,
    basicSalaryEl,
    workingDaysEl,
    daysWorkedEl,
    overtimeHoursEl,
    allowancesEl,
    otherDeductionsInputEl
  ];

  requiredFields.forEach(field => {
    if (field.value.trim() === "") {
      field.style.border = "2px solid red";
      valid = false;
    } else {
      field.style.border = ""; // Reset if valid
    }
  });

  if (!valid) {
    showMessage("Please fill in all required fields.", "warning");
  }

  return valid;
}

    savePayrollButton.addEventListener('click', () => {
    if (!validateRequiredFields()) return;

    const payrollData = performCalculations();

     const localKey = `payroll_${payrollData.employeeId}_${Date.now()}`;
        try {
          localStorage.setItem(localKey, JSON.stringify(payrollData));
         showMessage(`Payroll for ${payrollData.employeeName} saved locally!`, "success");
          alert(`Payroll for ${payrollData.employeeName} has been saved!`);
            } catch (error) {
                console.error("Error saving payroll data: ", error);
                showMessage("Error saving payroll data. Check console for details.", "error");
                alert("Error saving payroll data. Check the console for details.");
            }
        });

    // Validate actual days worked every time it's changed
    daysWorkedEl.addEventListener('input', () => {
      let value = parseInt(daysWorkedEl.value);
      const period = workingDaysEl.value;
    
      if (value < 0) {
        daysWorkedEl.value = 0;
        showMessage("Negative numbers are not allowed.", "warning");
      }
    
      if (period === "15 Days" && value > 15) {
        daysWorkedEl.value = 15;
        showMessage("For 15 Days, actual days worked can't exceed 15.", "warning");
      } else if (period === "1 Month" && value > 30) {
        daysWorkedEl.value = 30;
        showMessage("For 1 Month, actual days worked can't exceed 30.", "warning");
      }

  performCalculations();
});


generatePayslipButton.addEventListener('click', () => {
  if (!validateRequiredFields()) return;

  const payrollData = performCalculations();
  console.log("--- GENERATE PAYSLIP (DATA) ---");
  console.log(payrollData);
  showMessage(`Payslip data for ${payrollData.employeeName} generated.`, "info");
  alert(`Payslip for: ${payrollData.employeeName}\nNet Pay: ${formatCurrency(payrollData.netPay)}`);
});

// Initialize calculations
performCalculations();


// --- Payroll History Section ---

function loadPayrollHistory() {
  const tableBody = document.getElementById("historyTableBody");
  const noRecords = document.getElementById("noRecordsMessage");

  if (!tableBody || !noRecords) return;

  tableBody.innerHTML = "";
  const keys = Object.keys(localStorage).filter(key => key.startsWith("payroll_"));

  if (keys.length === 0) {
    noRecords.style.display = "block";
    return;
  } else {
    noRecords.style.display = "none";
  }

  keys.forEach(key => {
    const data = JSON.parse(localStorage.getItem(key));
    const row = document.createElement("tr");
    row.style.borderBottom = "1px solid #ccc";

    row.innerHTML = `
      <td style="padding: 8px;">${data.employeeName}</td>
      <td style="padding: 8px;">${data.employeeId}</td>
      <td style="padding: 8px;">${data.payrollPeriod}</td>
      <td style="padding: 8px; color: green; font-weight: bold;">${formatCurrency(data.netPay)}</td>
      <td style="padding: 8px;">${new Date(data.calculatedAt).toLocaleString()}</td>
      <td style="padding: 8px;">
        <button onclick="deletePayrollRecord('${key}')" style="color: red; font-weight: bold;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function deletePayrollRecord(key) {
  localStorage.removeItem(key);
  loadPayrollHistory();
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleHistoryBtn");
  const historyContainer = document.getElementById("payrollHistoryContainer");

  if (toggleBtn && historyContainer) {
    toggleBtn.addEventListener("click", () => {
      const isVisible = historyContainer.style.display === "block";
      historyContainer.style.display = isVisible ? "none" : "block";
      toggleBtn.textContent = isVisible ? "Show Payroll History" : "Hide Payroll History";
    });
  }

  loadPayrollHistory();
});
