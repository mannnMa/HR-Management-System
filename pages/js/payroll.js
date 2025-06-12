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


// --- Constants (2025 Rates) ---
const STANDARD_MONTHLY_WORKING_DAYS = 22; // This can be adjusted based on company policy

// --- Calculation Logic ---

/**
 * Calculates prorated basic pay based on days worked.
 * This logic remains the same.
 */
function calculateProratedBasicPay(monthlySalary, daysWorkedInPeriod, standardDaysInMonth) {
    if (!monthlySalary || !daysWorkedInPeriod || !standardDaysInMonth || standardDaysInMonth <= 0) return 0;
    return (monthlySalary / standardDaysInMonth) * daysWorkedInPeriod;
}

/**
 * Calculates standard overtime pay (25% premium).
 * This logic remains the same for regular OT.
 */
function calculateOvertimePay(basicSalary, overtimeHours) {
    if (!basicSalary || !overtimeHours) return 0;
    const dailyRate = basicSalary / STANDARD_MONTHLY_WORKING_DAYS;
    const hourlyRate = dailyRate / 8;
    const otPay = hourlyRate * 1.25 * overtimeHours;
    return otPay;
}

/**
 * FIXED: Calculates SSS contribution based on the official 2025 table.
 * The previous formula was an approximation. This is the correct bracket-based calculation.
 * NOTE: SSS is based on GROSS PAY for the month.
 */
function calculateSSS(grossMonthlyPay) {
    if (grossMonthlyPay <= 0) return 0;

    // Official SSS Contribution Table for 2025 (Employee Share: 4.5%)
    // This function finds the correct employee contribution for a given monthly gross pay.
    const brackets = [
        { ceiling: 4249.99, contribution: 180.00 },
        { ceiling: 4749.99, contribution: 202.50 },
        { ceiling: 5249.99, contribution: 225.00 },
        { ceiling: 5749.99, contribution: 247.50 },
        { ceiling: 6249.99, contribution: 270.00 },
        { ceiling: 6749.99, contribution: 292.50 },
        { ceiling: 7249.99, contribution: 315.00 },
        { ceiling: 7749.99, contribution: 337.50 },
        { ceiling: 8249.99, contribution: 360.00 },
        { ceiling: 8749.99, contribution: 382.50 },
        { ceiling: 9249.99, contribution: 405.00 },
        { ceiling: 9749.99, contribution: 427.50 },
        { ceiling: 10249.99, contribution: 450.00 },
        { ceiling: 10749.99, contribution: 472.50 },
        { ceiling: 11249.99, contribution: 495.00 },
        { ceiling: 11749.99, contribution: 517.50 },
        { ceiling: 12249.99, contribution: 540.00 },
        { ceiling: 12749.99, contribution: 562.50 },
        { ceiling: 13249.99, contribution: 585.00 },
        { ceiling: 13749.99, contribution: 607.50 },
        { ceiling: 14249.99, contribution: 630.00 },
        { ceiling: 14749.99, contribution: 652.50 },
        { ceiling: 15249.99, contribution: 675.00 },
        { ceiling: 15749.99, contribution: 697.50 },
        { ceiling: 16249.99, contribution: 720.00 },
        { ceiling: 16749.99, contribution: 742.50 },
        { ceiling: 17249.99, contribution: 765.00 },
        { ceiling: 17749.99, contribution: 787.50 },
        { ceiling: 18249.99, contribution: 810.00 },
        { ceiling: 18749.99, contribution: 832.50 },
        { ceiling: 19249.99, contribution: 855.00 },
        { ceiling: 19749.99, contribution: 877.50 },
        { ceiling: 20249.99, contribution: 900.00 },
        { ceiling: 20749.99, contribution: 922.50 },
        { ceiling: 21249.99, contribution: 945.00 },
        { ceiling: 21749.99, contribution: 967.50 },
        { ceiling: 22249.99, contribution: 990.00 },
        { ceiling: 22749.99, contribution: 1012.50 },
        { ceiling: 23249.99, contribution: 1035.00 },
        { ceiling: 23749.99, contribution: 1057.50 },
        { ceiling: 24249.99, contribution: 1080.00 },
        { ceiling: 24749.99, contribution: 1102.50 },
        { ceiling: 25249.99, contribution: 1125.00 },
        { ceiling: 25749.99, contribution: 1147.50 },
        { ceiling: 26249.99, contribution: 1170.00 },
        { ceiling: 26749.99, contribution: 1192.50 },
        { ceiling: 27249.99, contribution: 1215.00 },
        { ceiling: 27749.99, contribution: 1237.50 },
        { ceiling: 28249.99, contribution: 1260.00 },
        { ceiling: 28749.99, contribution: 1282.50 },
        { ceiling: 29249.99, contribution: 1305.00 },
        { ceiling: 29749.99, contribution: 1327.50 },
    ];

    if (grossMonthlyPay < 4250) return 180.00;
    if (grossMonthlyPay >= 29750) return 1350.00;

    const bracket = brackets.find(b => grossMonthlyPay <= b.ceiling);
    return bracket ? bracket.contribution : 1350.00; // Default to max if something goes wrong
}

/**
 * CONFIRMED: Calculates PhilHealth contribution.
 * The total premium is 5%. Your calculation of 2.5% (0.025) for the employee's share is CORRECT.
 * It is based on the full MONTHLY BASIC SALARY.
 */
function calculatePhilHealth(monthlyBasicSalary) {
    if (monthlyBasicSalary <= 0) return 0;
    // Premium is 5% total, employee share is 2.5%
    const employeeRate = 0.025;
    // Salary base is capped between 10,000 and 100,000
    let premiumBase = Math.max(10000, Math.min(monthlyBasicSalary, 100000));
    return premiumBase * employeeRate;
}

/**
 * FIXED: Calculates Pag-IBIG contribution with updated 2025 rates.
 * The contribution rate and maximum contribution have increased.
 * It is based on the full MONTHLY BASIC SALARY.
 */
function calculatePagibig(monthlyBasicSalary) {
    if (monthlyBasicSalary <= 0) return 0;
    
    // 2025 Updated Rates: Employee share is 2% up to a max of 200
    // The rate is 2% for salary above 1,500. Below that, it's 1%.
    let rate = monthlyBasicSalary > 1500 ? 0.02 : 0.01;
    let contribution = monthlyBasicSalary * rate;
    
    // The maximum monthly contribution for the employee is now 200.
    return Math.min(contribution, 200);
}

/**
 * FIXED: Calculates Withholding Tax using the correct method.
 * This now uses the SEMI-MONTHLY tax table for accuracy on bi-weekly payrolls.
 * It no longer calculates monthly tax and divides by 2.
 */
function calculateWithholdingTax(taxableIncomeForPeriod) {
    if (taxableIncomeForPeriod <= 0) return 0;
    
    let tax = 0;
    
    // BIR Withholding Tax Table for SEMI-MONTHLY payroll (TRAIN Law)
    if (taxableIncomeForPeriod <= 10417) {
        tax = 0;
    } else if (taxableIncomeForPeriod <= 16666) {
        tax = (taxableIncomeForPeriod - 10417) * 0.15;
    } else if (taxableIncomeForPeriod <= 33333) {
        tax = 937.50 + (taxableIncomeForPeriod - 16667) * 0.20;
    } else if (taxableIncomeForPeriod <= 83333) {
        tax = 4166.67 + (taxableIncomeForPeriod - 33333) * 0.25;
    } else if (taxableIncomeForPeriod <= 333333) {
        tax = 16666.67 + (taxableIncomeForPeriod - 83333) * 0.30;
    } else {
        tax = 91666.67 + (taxableIncomeForPeriod - 333333) * 0.35;
    }
    
    return tax;
}


// --- Main Calculation Flow ---
function performCalculations() {
    // --- Inputs ---
    const basicSalary = parseFloat(basicSalaryEl.value) || 0;
    const actualDaysWorked = parseFloat(daysWorkedEl.value) || STANDARD_MONTHLY_WORKING_DAYS;
    const overtimeHours = parseFloat(overtimeHoursEl.value) || 0;
    const allowances = parseFloat(allowancesEl.value) || 0;
    const otherDeductions = parseFloat(otherDeductionsInputEl.value) || 0;
    const payrollPeriod = workingDaysEl.value;
    const isHalfPeriod = payrollPeriod === "15 Days";

    // --- Earnings Calculation ---
    // Note: For SSS, we need to estimate the gross for the *entire month*
    const actualBasicPayForPeriod = calculateProratedBasicPay(basicSalary, actualDaysWorked, STANDARD_MONTHLY_WORKING_DAYS);
    const overtimePay = calculateOvertimePay(basicSalary, overtimeHours);
    const grossPayForPeriod = actualBasicPayForPeriod + allowances + overtimePay;

    // --- Deductions Calculation ---
    
    // Calculate full MONTHLY contributions first
    // SSS is based on estimated full month gross pay. A simple estimate is doubling the period pay.
    const estimatedMonthlyGross = isHalfPeriod ? grossPayForPeriod * 2 : grossPayForPeriod;
    const totalMonthlySSS = calculateSSS(estimatedMonthlyGross);
    const totalMonthlyPhilHealth = calculatePhilHealth(basicSalary);
    const totalMonthlyPagibig = calculatePagibig(basicSalary);

    // Get the deduction for the current pay period (half if semi-monthly)
    const sssContributionForPeriod = isHalfPeriod ? totalMonthlySSS / 2 : totalMonthlySSS;
    const philHealthContributionForPeriod = isHalfPeriod ? totalMonthlyPhilHealth / 2 : totalMonthlyPhilHealth;
    const pagibigContributionForPeriod = isHalfPeriod ? totalMonthlyPagibig / 2 : totalMonthlyPagibig;

    // Calculate Taxable Income for THIS PERIOD
    const taxableIncomeForPeriod = grossPayForPeriod - sssContributionForPeriod - philHealthContributionForPeriod - pagibigContributionForPeriod;

    // Calculate Withholding Tax based on THIS PERIOD's taxable income
    const withholdingTax = calculateWithholdingTax(taxableIncomeForPeriod);
    
    // --- Final Calculation ---
    const totalDeductions = sssContributionForPeriod + philHealthContributionForPeriod + pagibigContributionForPeriod + withholdingTax + otherDeductions;
    const netPay = grossPayForPeriod - totalDeductions;

    // --- Update UI (remains the same) ---
    // ... your UI update code here ...
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
    loadPayrollHistory();
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

  const data = performCalculations();
  const modal = document.getElementById("payslipModal");
  const content = document.getElementById("payslipContent");

  content.innerHTML = `
    <p><strong>Name:</strong> ${data.employeeName}</p>
    <p><strong>ID:</strong> ${data.employeeId}</p>
    <p><strong>Period:</strong> ${data.payrollPeriod}</p>
    <hr class="my-2">
    <p><strong>Basic Pay:</strong> ${formatCurrency(data.actualBasicPayForPeriod)}</p>
    <p><strong>Overtime Pay:</strong> ${formatCurrency(data.overtimePay)}</p>
    <p><strong>Allowances:</strong> ${formatCurrency(data.allowances)}</p>
    <p><strong>Gross Pay:</strong> ${formatCurrency(data.grossPay)}</p>
    <hr class="my-2">
    <p><strong>SSS:</strong> ${formatCurrency(data.sssContribution)}</p>
    <p><strong>PhilHealth:</strong> ${formatCurrency(data.philHealthContribution)}</p>
    <p><strong>Pag-IBIG:</strong> ${formatCurrency(data.pagibigContribution)}</p>
    <p><strong>Withholding Tax:</strong> ${formatCurrency(data.withholdingTax)}</p>
    <p><strong>Other Deductions:</strong> ${formatCurrency(data.otherDeductions)}</p>
    <p><strong>Total Deductions:</strong> ${formatCurrency(data.totalDeductions)}</p>
    <hr class="my-2">
    <p class="text-xl font-bold"><strong>Net Pay:</strong> ${formatCurrency(data.netPay)}</p>
    <p class="text-sm text-gray-500 mt-2"><em>Generated on: ${new Date(data.calculatedAt).toLocaleString()}</em></p>
  `;

  modal.classList.remove("hidden");
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
document.getElementById("deleteAllBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all payroll history?")) {
    Object.keys(localStorage)
      .filter(key => key.startsWith("payroll_"))
      .forEach(key => localStorage.removeItem(key));
    loadPayrollHistory();
    showMessage("All payroll history has been deleted.", "success");
  }
});

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

// Close button for the payslip modal
document.getElementById("closePayslipBtn").addEventListener("click", () => {
  document.getElementById("payslipModal").classList.add("hidden");
});

