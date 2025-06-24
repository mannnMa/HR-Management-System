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

    alert("Evaluation assigned to Employee");
    assignForm.reset();
    loadCompletedEvaluations();
  });

  function loadCompletedEvaluations() {
    if (!evalResults) return;
    evalResults.innerHTML = "";

    const completed = loadEvaluations();

    completed.forEach((e, index) => {
      const div = document.createElement("div");
      div.className = "evaluation-result";

      div.innerHTML = `
        <h3 contenteditable="true" class="editable-name">${e.employee}</h3>
        <p contenteditable="true" class="editable-position">${e.position}</p>
        <p contenteditable="true" class="editable-department">${e.department}</p>
        <ul>
          <li contenteditable="true">Work Quality: <span class="answer">${e.answers?.[0] || "N/A"}</span></li>
          <li contenteditable="true">Communication Skills: <span class="answer">${e.answers?.[1] || "N/A"}</span></li>
          <li contenteditable="true">Attendance & Punctuality: <span class="answer">${e.answers?.[2] || "N/A"}</span></li>
          <li contenteditable="true">Teamwork: <span class="answer">${e.answers?.[3] || "N/A"}</span></li>
          <li contenteditable="true">Problem Solving: <span class="answer">${e.answers?.[4] || "N/A"}</span></li>
        </ul>
        <small>Submitted: ${e.timestamp || "Unknown"}</small>
        <br />
        <button class="save-eval-btn" data-index="${index}">Save</button>
        <button class="delete-eval-btn" data-index="${index}">Delete</button>
        <hr />
      `;
      evalResults.appendChild(div);
    });

    // Add delete functionality
    document.querySelectorAll(".delete-eval-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const completed = loadEvaluations();
        completed.splice(index, 1);
        localStorage.setItem("completedEvaluations", JSON.stringify(completed));
        loadCompletedEvaluations();
      });
    });

    // Add save functionality
    document.querySelectorAll(".save-eval-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const container = e.target.closest(".evaluation-result");

        const updated = {
          ...loadEvaluations()[index],
          employee: container.querySelector(".editable-name").textContent.trim(),
          position: container.querySelector(".editable-position").textContent.trim(),
          department: container.querySelector(".editable-department").textContent.trim(),
          answers: Array.from(container.querySelectorAll("ul li span.answer")).map(el => el.textContent.trim())
        };

        const completed = loadEvaluations();
        completed[index] = updated;
        localStorage.setItem("completedEvaluations", JSON.stringify(completed));
        alert("Evaluation updated successfully.");
      });
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
