document.addEventListener("DOMContentLoaded", () => {
  const evaluationContainer = document.getElementById("evaluation-container");
  const openEvaluationBtn = document.getElementById("open-evaluation-button");
  const closeEvaluationBtn = document.getElementById("close-evaluation-btn");
  const assignForm = document.getElementById("evaluation-assignment-form");
  const nameInput = document.getElementById("admin-name");
  const deptSelect = document.getElementById("admin-department");
  const positionInput = document.getElementById("admin-position");
  const evalResults = document.getElementById("evaluation-results");

  // Open evaluation modal
  openEvaluationBtn?.addEventListener("click", () => {
    evaluationContainer.style.display = "block";
    evaluationContainer.scrollIntoView({ behavior: "smooth" });
  });

  // Close evaluation modal
  closeEvaluationBtn?.addEventListener("click", () => {
    evaluationContainer.style.display = "none";
  });

  // Assign evaluation
  assignForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const newEval = {
      id: Date.now(),
      employee: nameInput.value.trim().toLowerCase(), // normalize for comparison
      department: deptSelect.value,
      position: positionInput.value.trim(),
    };

    if (!newEval.employee || !newEval.department || !newEval.position) {
      alert("Please fill in all fields.");
      return;
    }

    const pending = loadPending();
    pending.push(newEval);
    savePending(pending);

    alert("Evaluation assigned to " + nameInput.value.trim());
    assignForm.reset();
    loadCompletedEvaluations();
  });

  function loadCompletedEvaluations() {
    evalResults.innerHTML = "";
    const completed = loadEvaluations();

    completed.forEach(e => {
      const div = document.createElement("div");
      div.className = "evaluation-result";
      div.innerHTML = `
        <h3>${e.employee} - ${e.position} (${e.department})</h3>
        <ul>
          <li>Work Quality: ${e.answers?.[0] || "N/A"}</li>
          <li>Communication Skills: ${e.answers?.[1] || "N/A"}</li>
          <li>Attendance & Punctuality: ${e.answers?.[2] || "N/A"}</li>
          <li>Teamwork: ${e.answers?.[3] || "N/A"}</li>
          <li>Problem Solving: ${e.answers?.[4] || "N/A"}</li>
        </ul>
        <small>Submitted: ${e.timestamp || "Unknown"}</small>
        <hr />
      `;
      evalResults.appendChild(div);
    });
  }

  function loadEvaluations() {
    return JSON.parse(localStorage.getItem("completedEvaluations")) || [];
  }

  function savePending(data) {
    localStorage.setItem("pendingEvaluations", JSON.stringify(data));
  }

  function loadPending() {
    return JSON.parse(localStorage.getItem("pendingEvaluations")) || [];
  }

  loadCompletedEvaluations();
});
