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
const payrollDateRangeEl = document.getElementById('payrollDateRange');

// --- Helper Functions ---
function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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

function calculateSSS(monthlyGrossPay) {
    if (monthlyGrossPay <= 0) return 0;
    const employeeShareRate = 0.05; // 5% for 2025
    let msc = 0;
    if (monthlyGrossPay < 5250) {
        msc = 5000;
    } else if (monthlyGrossPay >= 34750) {
        msc = 35000;
    } else {
        msc = Math.round((monthlyGrossPay - 250) / 500) * 500;
    }
    const contribution = msc * employeeShareRate;
    return contribution;
}


function calculatePhilHealth(monthlyBasicSalary) {
    if (monthlyBasicSalary <= 0) return 0;
    const employeeShareRate = 0.025;
    const premiumBase = Math.max(10000, Math.min(monthlyBasicSalary, 100000));
    const contribution = premiumBase * employeeShareRate;
    return contribution;
}


function calculatePagibig(monthlyBasicSalary) {
    if (monthlyBasicSalary <= 0) return 0;
    const rate = (monthlyBasicSalary <= 1500) ? 0.01 : 0.02;
    const contribution = Math.min(monthlyBasicSalary * rate, 200);
    return contribution;
}


function calculateWithholdingTax(taxableIncomeForPeriod, isHalfPeriod = false) {
    let tax = 0;
    if (isHalfPeriod) {
        if (taxableIncomeForPeriod <= 10417) {
            tax = 0;
        } else if (taxableIncomeForPeriod <= 16667) {
            tax = (taxableIncomeForPeriod - 10417) * 0.15;
        } else if (taxableIncomeForPeriod <= 33333) {
            tax = 937.50 + (taxableIncomeForPeriod - 16667) * 0.20;
        } else if (taxableIncomeForPeriod <= 83333) {
            tax = 4270.83 + (taxableIncomeForPeriod - 33333) * 0.25;
        } else if (taxableIncomeForPeriod <= 333333) {
            tax = 16770.83 + (taxableIncomeForPeriod - 83333) * 0.30;
        } else {
            tax = 91770.83 + (taxableIncomeForPeriod - 333333) * 0.35;
        }
    } else {
        if (taxableIncomeForPeriod <= 20833) {
            tax = 0;
        } else if (taxableIncomeForPeriod <= 33333) {
            tax = (taxableIncomeForPeriod - 20833) * 0.15;
        } else if (taxableIncomeForPeriod <= 66667) {
            tax = 1875 + (taxableIncomeForPeriod - 33333) * 0.20;
        } else if (taxableIncomeForPeriod <= 166667) {
            tax = 8541.80 + (taxableIncomeForPeriod - 66667) * 0.25;
        } else if (taxableIncomeForPeriod <= 666667) {
            tax = 33541.80 + (taxableIncomeForPeriod - 166667) * 0.30;
        } else {
            tax = 183541.80 + (taxableIncomeForPeriod - 666667) * 0.35;
        }
    }
    return tax > 0 ? tax : 0;
}


function performCalculations() {
    const basicSalary = parseFloat(basicSalaryEl.value) || 0;
    const actualDaysWorked = parseFloat(daysWorkedEl.value) || 0;
    const overtimeHours = parseFloat(overtimeHoursEl.value) || 0;
    const allowances = parseFloat(allowancesEl.value) || 0;
    const otherDeductions = parseFloat(otherDeductionsInputEl.value) || 0;
    const payrollPeriod = workingDaysEl.value;
    const isHalfPeriod = payrollPeriod === "15 Days";

    // 1. Basic Pay & Overtime
    const actualBasicPayForPeriod = calculateProratedBasicPay(basicSalary, actualDaysWorked, STANDARD_MONTHLY_WORKING_DAYS);
    const overtimePay = calculateOvertimePay(basicSalary, overtimeHours);
    const grossPayForPeriod = actualBasicPayForPeriod + allowances + overtimePay;

    // 2. Estimated full month gross to base deductions on
    const estimatedMonthlyGross = isHalfPeriod ? grossPayForPeriod * 2 : grossPayForPeriod;

    // 3. Full monthly contributions (2025 logic)
    const fullMonthlySSS = calculateSSS(estimatedMonthlyGross);
    const fullMonthlyPhilHealth = calculatePhilHealth(basicSalary);
    const fullMonthlyPagibig = calculatePagibig(basicSalary);

    // 4. Contribution per period (half if semi-monthly)
    const sssContribution = isHalfPeriod ? fullMonthlySSS / 2 : fullMonthlySSS;
    const philHealthContribution = isHalfPeriod ? fullMonthlyPhilHealth / 2 : fullMonthlyPhilHealth;
    const pagibigContribution = isHalfPeriod ? fullMonthlyPagibig / 2 : fullMonthlyPagibig;

    // 5. Withholding Tax based on taxable income for the period
    const taxableIncome = grossPayForPeriod - sssContribution - philHealthContribution - pagibigContribution;
    const withholdingTax = calculateWithholdingTax(taxableIncome, isHalfPeriod);

    // 6. Total deductions & Net Pay
    const totalDeductions = sssContribution + philHealthContribution + pagibigContribution + withholdingTax + otherDeductions;
    const netPay = grossPayForPeriod - totalDeductions;

    // 7. Update UI
    summaryBasicPayEl.textContent = formatCurrency(actualBasicPayForPeriod);
    summaryOvertimePayEl.textContent = formatCurrency(overtimePay);
    summaryTotalAllowancesEl.textContent = formatCurrency(allowances);
    summaryGrossPayEl.textContent = formatCurrency(grossPayForPeriod);
    summarySSSEl.textContent = formatCurrency(sssContribution);
    summaryPhilHealthEl.textContent = formatCurrency(philHealthContribution);
    summaryPagibigEl.textContent = formatCurrency(pagibigContribution);
    summaryWithholdingTaxEl.textContent = formatCurrency(withholdingTax);
    summaryOtherDeductionsEl.textContent = formatCurrency(otherDeductions);
    summaryTotalDeductionsEl.textContent = formatCurrency(totalDeductions);
    summaryNetPayEl.textContent = formatCurrency(netPay);

    // 8. Return full object for other uses (e.g., payslip)
    return {
        employeeName: employeeNameEl.value,
        employeeId: employeeIdEl.value,
        payrollPeriod,
        basicSalaryInput: basicSalary,
        daysWorked: actualDaysWorked,
        actualBasicPayForPeriod,
        overtimeHours,
        overtimePay,
        allowances,
        grossPay: grossPayForPeriod,
        sssContribution,
        philHealthContribution,
        pagibigContribution,
        withholdingTax,
        otherDeductions,
        totalDeductions,
        netPay,
        calculatedAt: new Date().toISOString()
    };
}
// --- Event Listeners ---
[basicSalaryEl, overtimeHoursEl, allowancesEl, otherDeductionsInputEl].forEach(el => {
    el.addEventListener('input', () => {
        if (parseFloat(el.value) < 0) {
            el.value = 0;
            showValidationModal("Negative numbers are not allowed.", "warning");
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
    showValidationModal("Form reset.", "info");
});
// Update allowed range based on payroll period
workingDaysEl.addEventListener('change', () => {
  const period = workingDaysEl.value;
  if (period === "15 Days") {
    daysWorkedEl.max = 15;
    if (parseInt(daysWorkedEl.value) > 15) {
      daysWorkedEl.value = 15;
      showValidationModal("For 15 Days, actual days worked can't exceed 15.", "warning");
    }
  } else if (period === "1 Month") {
    daysWorkedEl.max = 30;
    if (parseInt(daysWorkedEl.value) > 30) {
      daysWorkedEl.value = 30;
      showValidationModal("For 1 Month, actual days worked can't exceed 30.", "warning");
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
    showValidationModal("Please fill in all required fields.");
  }

  return valid;
}

    savePayrollButton.addEventListener('click', () => {
  if (!validateRequiredFields()) return;

  const payrollData = performCalculations();
  const localKey = `payroll_${payrollData.employeeId}_${Date.now()}`;
  
  try {
    localStorage.setItem(localKey, JSON.stringify(payrollData));
    showValidationModal(`Payroll for ${payrollData.employeeName} saved locally!`, "success");
    alert(`Payroll for ${payrollData.employeeName} has been saved!`);
    loadPayrollHistory();
  } catch (error) {
    console.error("Error saving payroll data: ", error);
    showValidationModal("Error saving payroll data. Check console for details.");
    alert("Error saving payroll data. Check the console for details.");
  }
});


    // Validate actual days worked every time it's changed
    daysWorkedEl.addEventListener('input', () => {
      let value = parseInt(daysWorkedEl.value);
      const period = workingDaysEl.value;
    
      if (value < 0) {
        daysWorkedEl.value = 0;
        showValidationModal("Negative numbers are not allowed.", "warning");
      }
    
      if (period === "15 Days" && value > 15) {
        daysWorkedEl.value = 15;
        showValidationModal("For 15 Days, actual days worked can't exceed 15.", "warning");
      } else if (period === "1 Month" && value > 30) {
        daysWorkedEl.value = 30;
        showValidationModal("For 1 Month, actual days worked can't exceed 30.", "warning");
      }

  performCalculations();
});


generatePayslipButton.addEventListener('click', () => {
  if (!validateRequiredFields()) return;

  const data = performCalculations();
  const modal = document.getElementById("payslipModal");
  const content = document.getElementById("payslipContent");

  // Fill modal content
  content.innerHTML = `
    <button id="closePayslipBtn" class="float-right text-red-500 font-bold text-lg mb-2">×</button>
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

  document.getElementById("closePayslipBtn").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.classList.remove("hidden");

  // --- jsPDF generation ---
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "A4" });

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("Connectiv7", 105, 20, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("times", "normal");
  doc.text("Official Payslip", 105, 28, { align: "center" });

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Employee Information", 20, 40);
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${data.employeeName}`, 20, 47);
  doc.text(`Employee ID: ${data.employeeId}`, 20, 54);
  doc.text(`Payroll Period: ${data.payrollPeriod}`, 20, 61);

  const leftX = 25, rightX = 110, valueXLeft = 75, valueXRight = 170;
  let y = 72;

  doc.setFont("times", "bold");
  doc.text("Earnings", leftX, y);
  doc.text("Deductions", rightX, y);
  y += 7;

  doc.setFont("times", "normal");
  doc.text("Basic Pay:", leftX, y);
  doc.text(formatCurrency(data.actualBasicPayForPeriod), valueXLeft, y, { align: "right" });
  doc.text("SSS:", rightX, y);
  doc.text(formatCurrency(data.sssContribution), valueXRight, y, { align: "right" });

  y += 7;
  doc.text("Overtime Pay:", leftX, y);
  doc.text(formatCurrency(data.overtimePay), valueXLeft, y, { align: "right" });
  doc.text("PhilHealth:", rightX, y);
  doc.text(formatCurrency(data.philHealthContribution), valueXRight, y, { align: "right" });

  y += 7;
  doc.text("Allowances:", leftX, y);
  doc.text(formatCurrency(data.allowances), valueXLeft, y, { align: "right" });
  doc.text("Pag-IBIG:", rightX, y);
  doc.text(formatCurrency(data.pagibigContribution), valueXRight, y, { align: "right" });

  y += 7;
  doc.setFont("times", "bold");
  doc.text("Gross Pay:", leftX, y);
  doc.text(formatCurrency(data.grossPay), valueXLeft, y, { align: "right" });
  doc.setFont("times", "normal");
  doc.text("Withholding Tax:", rightX, y);
  doc.text(formatCurrency(data.withholdingTax), valueXRight, y, { align: "right" });

  y += 7;
  doc.text("Other Deductions:", rightX, y);
  doc.text(formatCurrency(data.otherDeductions), valueXRight, y, { align: "right" });

  y += 7;
  doc.setFont("times", "bold");
  doc.text("Total Deductions:", rightX, y);
  doc.text(formatCurrency(data.totalDeductions), valueXRight, y, { align: "right" });

  y += 15;
  doc.setDrawColor(0, 128, 0);
  doc.setLineWidth(1);
  doc.rect(20, y, 170, 15);

  doc.setFontSize(16);
  doc.setTextColor(0, 128, 0);
  doc.text(`Net Pay: ${formatCurrency(data.netPay)}`, 105, y + 10, { align: "center" });
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(10);
  doc.setFont("times", "italic");
  doc.text(`Generated on: ${new Date(data.calculatedAt).toLocaleString()}`, 20, y + 25);

  // --- Upload logic ---
  const pdfBlob = doc.output('blob');
  const formData = new FormData();

  const cleanName = data.employeeName.trim().replace(/\s+/g, '');
  const cleanDateRange = payrollDateRangeEl.value.trim().replace(/[\/\s:]+/g, '_');

  const pdfFilename = `payslip_${data.employeeId}_${cleanName}_${cleanDateRange}.pdf`;
  const jsonFilename = `payslip_${data.employeeId}_${cleanName}_${cleanDateRange}.json`;

  formData.append("pdfFile", pdfBlob, pdfFilename);

  const payslipMeta = {
    period: payrollDateRangeEl.value,
    payDate: new Date(data.calculatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    netPay: data.netPay
  };

  const metaBlob = new Blob([JSON.stringify(payslipMeta)], { type: "application/json" });
  formData.append("metaFile", metaBlob, jsonFilename);

  fetch("./php/upload_payslip.php", {
    method: "POST",
    body: formData,
  })
    .then(response => response.text())
    .then(result => {
      console.log("Upload response:", result);
      showValidationModal("Payslip uploaded to server!", "success");
    })
    .catch(error => {
      console.error("Upload error:", error);
      showValidationModal("Upload failed. Check connection or permissions.", "error");
    });
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
    showValidationModal("All payroll history has been deleted.", "success");
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

// Validation Modal logic
function showValidationModal(message, type = "warning") {
  const msgEl = document.getElementById('validationModalMsg');
  msgEl.textContent = message;
  msgEl.style.color = type === "success" ? "#16a34a" : type === "error" ? "#b91c1c" : "#b45309";
  document.getElementById('validationModal').style.display = 'flex';
}
document.getElementById('closeValidationModal').onclick = function() {
  document.getElementById('validationModal').style.display = 'none';
};

