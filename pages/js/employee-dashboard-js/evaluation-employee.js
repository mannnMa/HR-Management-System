document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("employee-evaluation-container");
  const content = document.getElementById("evaluation-content");
  const form = document.getElementById("evaluation-answer-form");
  const openBtn = document.getElementById("open-evaluation-btn");
  const closeBtn = document.getElementById("close-employee-eval-btn");

  const nameDisplay = document.getElementById("eval-name");
  const posDisplay = document.getElementById("eval-position");
  const deptDisplay = document.getElementById("eval-department");

  let currentEval = null;

  openBtn?.addEventListener("click", () => {
    const pending = JSON.parse(localStorage.getItem("pendingEvaluations")) || [];

    // Take the most recent or first evaluation regardless of name
    currentEval = pending[pending.length - 1];

    if (currentEval) {
      nameDisplay.textContent = currentEval.employee;
      posDisplay.textContent = currentEval.position;
      deptDisplay.textContent = currentEval.department;
    } else {
      nameDisplay.textContent = "N/A";
      posDisplay.textContent = "N/A";
      deptDisplay.textContent = "N/A";
    }

    wrapper.style.display = "block";
    content.style.display = "block";
  });

  closeBtn?.addEventListener("click", () => {
    wrapper.style.display = "none";
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentEval) return;

    const answers = [1, 2, 3, 4, 5].map(n =>
      document.querySelector(`input[name="q${n}"]:checked`)?.value || ""
    );

    const completed = {
      ...currentEval,
      answers,
      timestamp: new Date().toLocaleString()
    };

    const allCompleted = JSON.parse(localStorage.getItem("completedEvaluations")) || [];
    allCompleted.push(completed);
    localStorage.setItem("completedEvaluations", JSON.stringify(allCompleted));

    // Remove from pending
    const pending = JSON.parse(localStorage.getItem("pendingEvaluations")) || [];
    const updatedPending = pending.filter(e => e.id !== currentEval.id);
    localStorage.setItem("pendingEvaluations", JSON.stringify(updatedPending));

    form.reset();
    alert("Evaluation submitted!");
    wrapper.style.display = "none";
  });
});
