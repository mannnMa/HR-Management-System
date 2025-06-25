document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-filter input");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const sortBy = document.getElementById("sortBy");
  const deptFilter = document.getElementById("departmentFilter");
  const posFilter = document.getElementById("positionFilter");
  const empTypeFilter = document.getElementById("employmentTypeFilter");
  const allCards = document.querySelectorAll(".job-card");

  const departmentPositions = {
    "Admin": ["Admin Manager", "Office Assistant", "Document Controller", "Receptionist", "Executive Assistant"],
    "IT": ["System Analyst", "Junior Developer", "IT Support Specialist", "Frontend Developer", "Network Engineer"],
    "HR": ["HR Manager", "Recruiter", "HR Assistant", "Training Coordinator", "Compensation Analyst"],
    "Sale": ["Sales Executive", "Account Manager", "Sales Coordinator", "Business Development Officer", "Sales Manager"],
    "Marketing": ["Marketing Strategist", "Content Specialist", "SEO Analyst", "Social Media Manager", "Product Marketing Manager"],
    "Finance": ["Accountant", "Financial Analyst", "Accounts Payable Clerk", "Budget Officer", "Internal Auditor"]
  };

  function populatePositions(dept) {
    posFilter.innerHTML = "";
    if (!dept) {
      posFilter.innerHTML = `<option value="">Position</option><option value="" disabled>- Select Department First -</option>`;
      return;
    }

    posFilter.innerHTML = `<option value="">All Positions</option>`;
    departmentPositions[dept].forEach(position => {
      const opt = document.createElement("option");
      opt.value = position;
      opt.textContent = position;
      posFilter.appendChild(opt);
    });
  }

  deptFilter.addEventListener("change", () => {
    const selectedDept = deptFilter.value;
    populatePositions(selectedDept);
    filterJobs();
  });

  posFilter.addEventListener("change", filterJobs);
  empTypeFilter.addEventListener("change", filterJobs);
  sortBy.addEventListener("change", filterJobs);
  searchInput.addEventListener("input", filterJobs);
  resetBtn.addEventListener("click", resetFilters);

  function filterJobs() {
    const keyword = searchInput.value.toLowerCase();
    const dept = deptFilter.value;
    const pos = posFilter.value;
    const emp = empTypeFilter.value;

    allCards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p")?.textContent.toLowerCase();
      const cardDept = card.dataset.department;
      const cardPos = card.dataset.position;
      const cardEmp = card.dataset.employment;

      const matchesKeyword = title.includes(keyword) || description.includes(keyword);
      const matchesDept = !dept || cardDept === dept;
      const matchesPos = !pos || cardPos === pos;
      const matchesEmp = !emp || cardEmp === emp;

      if (matchesKeyword && matchesDept && matchesPos && matchesEmp) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  function resetFilters() {
    searchInput.value = "";
    sortBy.value = "";
    deptFilter.value = "";
    empTypeFilter.value = "";
    populatePositions(""); // Reset position dropdown

    allCards.forEach(card => {
      card.style.display = "block";
    });
  }

  const requirementLinks = document.querySelectorAll(".req a");
  const modal = document.querySelector(".requirements-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const requirementsList = document.getElementById("requirementsList");

  const requirementsModal = document.querySelector(".requirements-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalJobTitle = document.getElementById("modalJobTitle");
  const modalDepartment = document.getElementById("modalDepartment");
  const modalType = document.getElementById("modalType");
  const modalDeadline = document.getElementById("modalDeadline");
  const qualificationsList = document.getElementById("qualificationsList");


  const defaultQualifications = [
    "Educational Background: Bachelor’s degree in Business Administration, Management, or related field. A Master’s degree is a plus.",
    "Work Experience: Minimum 3–5 years experience in office administration or management. Previous supervisory or managerial experience preferred.",
    "Key Skills: Knowledge of administrative procedures, HR support, and record keeping. Strong organizational and multitasking skills.",
    "Job Responsibilities: Oversee daily administrative operations, supervise staff, assign tasks."
    ];

    document.querySelectorAll(".req a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(".job-card");
        const title = card.querySelector("h3").textContent;
        const dept = card.getAttribute("data-department") || "Not specified";
        const emp = card.getAttribute("data-employment") || "Not specified";
        const deadline = card.querySelector(".deadline")?.textContent.split(": ")[1] || "N/A";

        modalJobTitle.textContent = `${title} Requirements`;
        modalDepartment.textContent = dept;
        modalType.textContent = emp;
        modalDeadline.textContent = deadline;

        qualificationsList.innerHTML = "";
        defaultQualifications.forEach(q => {
            const [label, rest] = q.split(":");
            const li = document.createElement("li");
            li.innerHTML = `<strong>${label}:</strong>${rest}`;
            qualificationsList.appendChild(li);
        });

        requirementsModal.classList.remove("hidden");
        });
    });

    closeModal.addEventListener("click", () => {
    requirementsModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
    if (e.target === requirementsModal) {
        requirementsModal.classList.add("hidden");
    }
    });

  // Initialize
  populatePositions("");
});
