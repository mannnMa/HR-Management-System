document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("employee-evaluation-container");
  const content = document.getElementById("evaluation-content");
  const openBtn = document.getElementById("open-evaluation-btn");
  const closeBtn = document.getElementById("close-employee-eval-btn");

  openBtn?.addEventListener("click", () => {
    const pending = JSON.parse(localStorage.getItem("pendingEvaluations")) || [];

    content.innerHTML = ""; // Clear previous content

    if (pending.length === 0) {
      content.innerHTML = `<p style="color: red;">No evaluations assigned yet.</p>`;
    } else {
      pending.forEach(evalData => {
        const form = createEvaluationForm(evalData);
        content.appendChild(form);
      });
    }

    wrapper.style.display = "block";
    content.style.display = "block";
    wrapper.scrollIntoView({ behavior: "smooth" });
  });

  closeBtn?.addEventListener("click", () => {
    wrapper.style.display = "none";
  });

  function createEvaluationForm(data) {
    const container = document.createElement("div");
    container.className = "evaluation-item";
    container.innerHTML = `
      <p><strong>Employee:</strong> ${data.employee}</p>
      <p><strong>Department:</strong> ${data.department}</p>
      <p><strong>Position:</strong> ${data.position}</p>
      <form class="evaluation-answer-form" data-id="${data.id}">
        <div class="evaluation-questions">
          <h4>Answer Evaluation</h4>
          ${[1, 2, 3, 4, 5].map(n => `
            <div class="question">
              <p>${getQuestionText(n)}</p>
              <div class="choices">
                ${["Outstanding", "Very Good", "Good", "Fair", "Poor"].map(val => `
                  <label><input type="radio" name="q${n}" value="${val}" required> ${val}</label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        <button class="submit-evaluation" type="submit">Submit Evaluation</button>
      </form>
      <hr>
    `;

    const form = container.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const answers = [1, 2, 3, 4, 5].map(n =>
        form.querySelector(`input[name="q${n}"]:checked`)?.value || ""
      );

      const completedEval = {
        ...data,
        answers,
        timestamp: new Date().toLocaleString()
      };

      const completed = JSON.parse(localStorage.getItem("completedEvaluations")) || [];
      completed.push(completedEval);
      localStorage.setItem("completedEvaluations", JSON.stringify(completed));

      // Remove from pending
      let pending = JSON.parse(localStorage.getItem("pendingEvaluations")) || [];
      pending = pending.filter(e => e.id !== data.id);
      localStorage.setItem("pendingEvaluations", JSON.stringify(pending));

      alert(`Evaluation for ${data.employee} submitted.`);
      container.remove(); // Remove the submitted form
    });

    return container;
  }

  function getQuestionText(n) {
    const questions = {
      1: "1. Work Quality",
      2: "2. Communication Skills",
      3: "3. Attendance & Punctuality",
      4: "4. Teamwork",
      5: "5. Problem Solving"
    };
    return questions[n] || `Question ${n}`;
  }
});
