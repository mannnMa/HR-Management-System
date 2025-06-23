const applicants = [
  { number: "AAA000", department: "Admin", position: "Receptionist", status: "Hired" },
  { number: "BBB001", department: "HR", position: "HR Assistant", status: "Pending" },
];

// Department-position
const departmentPositions = {
  "Admin": [
    "Admin Manager",
    "Office Assistant",
    "Document Controller",
    "Receptionist",
    "Executive Assistant"
  ],
  "IT": [
    "System Analyst",
    "Junior Developer",
    "IT Support Specialist",
    "Frontend Developer",
    "Network Engineer"
  ],
  "HR": [
    "HR Manager",
    "Recruiter",
    "HR Assistant",
    "Training Coordinator",
    "Compensation Analyst"
  ],
  "Sale": [
    "Sales Executive",
    "Account Manager",
    "Sales Coordinator",
    "Business Development Officer",
    "Sales Manager"
  ],
  "Marketing": [
    "Marketing Strategist",
    "Content Specialist",
    "SEO Analyst",
    "Social Media Manager",
    "Product Marketing Manager"
  ],
  "Finance": [
    "Accountant",
    "Financial Analyst",
    "Accounts Payable Clerk",
    "Budget Officer",
    "Internal Auditor"
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const updateModal = document.getElementById("updateModal");
  const saveStatusBtn = document.getElementById("saveStatusBtn");
  const cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  const searchInput = document.getElementById("searchInput");
  const applicantTable = document.getElementById("applicantTable");
  const statusBoxes = document.querySelectorAll(".status-box");

  const filterDepartment = document.getElementById("filterDepartment");
  const filterPosition = document.getElementById("filterPosition");
  const filterStatus = document.getElementById("filterStatus");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  let currentApplicantIndex = null;
  let selectedStatus = null;

  function populateTable(data) {
    applicantTable.innerHTML = "";

    data.forEach((applicant, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${applicant.number}</td>
        <td>${applicant.department}</td>
        <td>${applicant.position}</td>
        <td><span class="status ${applicant.status.toLowerCase()}">${applicant.status}</span></td>
        <td><button class="action-btn update-btn" data-index="${index}">Update</button></td>
      `;
      applicantTable.appendChild(tr);
    });

    if (data.length === 0) {
        applicantTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No matching applicants found.</td></tr>`;
    return;
}

    updateCounts(data);
  }

  function updateCounts(data) {
    document.getElementById("totalCount").textContent = data.length;
    document.getElementById("shortlistCount").textContent = data.filter(a => a.status === "Shortlisted").length;
    document.getElementById("hiredCount").textContent = data.filter(a => a.status === "Hired").length;
  }

  applicantTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("update-btn")) {
      currentApplicantIndex = parseInt(e.target.dataset.index);
      selectedStatus = applicants[currentApplicantIndex].status;

      statusBoxes.forEach(box => {
        const status = box.dataset.status;
        box.classList.remove("selected", "pending", "shortlisted", "hired", "rejected");
        if (status === selectedStatus) {
          box.classList.add("selected", status.toLowerCase());
        }
      });

      updateModal.classList.add("show");
    }
  });

  statusBoxes.forEach(box => {
    box.addEventListener("click", () => {
      selectedStatus = box.dataset.status;

      statusBoxes.forEach(b => {
        b.classList.remove("selected", "pending", "shortlisted", "hired", "rejected");
      });

      box.classList.add("selected", selectedStatus.toLowerCase());
    });
  });

  saveStatusBtn.addEventListener("click", () => {
    if (currentApplicantIndex !== null && selectedStatus) {
      applicants[currentApplicantIndex].status = selectedStatus;
      populateTable(applicants);
      updateModal.classList.remove("show");
      selectedStatus = null;
    }
  });

  cancelUpdateBtn.addEventListener("click", () => {
    updateModal.classList.remove("show");
    selectedStatus = null;
  });

  window.addEventListener("click", (e) => {
    if (e.target.id === "updateModal") {
      updateModal.classList.remove("show");
      selectedStatus = null;
    }
  });

  function updatePositionOptions(department) {
    filterPosition.innerHTML = "<option value=''>All Positions</option>";

    let positions = [];

    if (department && departmentPositions[department]) {
      positions = departmentPositions[department];
    } else {
      const all = new Set();
      Object.values(departmentPositions).flat().forEach(p => all.add(p));
      positions = Array.from(all);
    }

    positions.forEach(pos => {
      const option = document.createElement("option");
      option.value = pos;
      option.textContent = pos;
      filterPosition.appendChild(option);
    });
  }

  function applyAllFilters() {
    const keyword = searchInput.value.toLowerCase();
    const dep = filterDepartment.value;
    const pos = filterPosition.value;
    const stat = filterStatus.value;

    const filtered = applicants.filter(a => {
      const matchSearch = a.number.toLowerCase().includes(keyword);
      const matchDep = dep === "" || a.department === dep;
      const matchPos = pos === "" || a.position === pos;
      const matchStat = stat === "" || a.status === stat;
      return matchSearch && matchDep && matchPos && matchStat;
    });

    populateTable(filtered);
  }

  function populateFilters() {
    const departments = Object.keys(departmentPositions);
    departments.forEach(dep => {
      const option = document.createElement("option");
      option.value = dep;
      option.textContent = dep;
      filterDepartment.appendChild(option);
    });

    updatePositionOptions("");
  }

  filterDepartment.addEventListener("change", () => {
    updatePositionOptions(filterDepartment.value);
    filterPosition.value = "";
    applyAllFilters();
  });

  [filterPosition, filterStatus].forEach(select => {
    select.addEventListener("change", applyAllFilters);
  });

  searchInput.addEventListener("input", applyAllFilters);

  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterDepartment.value = "";
    filterPosition.value = "";
    filterStatus.value = "";
    updatePositionOptions(""); // reset all positions
    applyAllFilters();
  });

  // Initial render
  populateFilters();
  populateTable(applicants);

  document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    updateModal.classList.remove("show");
    selectedStatus = null;
  }
  });

});
