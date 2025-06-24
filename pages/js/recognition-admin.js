document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recognition-container");
  const openBtn = document.querySelector(".grid-item-recognition .view-nav");
  const closeBtn = document.getElementById("close-recognition-btn");
  const form = document.getElementById("recognition-form");
  const list = document.getElementById("recognition-list");
  const fileInput = document.getElementById("recognition-file");
  const fileNameDisplay = document.getElementById("recognition-file-name-display");

  //Fix old recognitions without IDs BEFORE anything else
  const oldRecognitions = JSON.parse(localStorage.getItem("recognitions")) || [];
  let updated = false;
  const fixedRecognitions = oldRecognitions.map(rec => {
    if (!rec.id) {
      updated = true;
      return { ...rec, id: Date.now() + Math.floor(Math.random() * 10000) };
    }
    return rec;
  });
  if (updated) {
    localStorage.setItem("recognitions", JSON.stringify(fixedRecognitions));
  }

  //Show recognition container if previously open
  if (localStorage.getItem("recognitionVisible") === "true") {
    container.style.display = "block";
    loadRecognitions();
  }

  openBtn?.addEventListener("click", () => {
    container.style.display = "block";
    container.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("recognitionVisible", "true");
    loadRecognitions();
  });

  closeBtn?.addEventListener("click", () => {
    container.style.display = "none";
    localStorage.setItem("recognitionVisible", "false");
  });

  fileInput?.addEventListener("change", () => {
    fileNameDisplay.textContent = fileInput.files.length > 0
      ? fileInput.files[0].name
      : "No file chosen";
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("recognition-title").value.trim();
    const employee = document.getElementById("recognized-employee").value.trim();
    const message = document.getElementById("recognition-message").value.trim();
    const image = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : null;

    const newRecognition = {
      id: Date.now(),
      title,
      employee,
      message,
      image,
      timestamp: new Date().toLocaleString()
    };

    const recognitions = JSON.parse(localStorage.getItem("recognitions")) || [];
    recognitions.push(newRecognition);
    localStorage.setItem("recognitions", JSON.stringify(recognitions));

    form.reset();
    fileNameDisplay.textContent = "No file chosen";
    loadRecognitions();
  });

  function loadRecognitions() {
    list.innerHTML = "";

    const recognitions = JSON.parse(localStorage.getItem("recognitions")) || [];

    recognitions.slice().reverse().forEach(rec => {
      const div = document.createElement("div");
      div.className = "recognition-item";
      div.innerHTML = `
        <button type="button" class="delete-recognition-btn" data-id="${rec.id}">&times;</button>
        <h3>${rec.title}</h3>
        <p><strong>${rec.employee}</strong></p>
        <p>${rec.message}</p>
        <div class="recognition-image-container">
          ${rec.image ? `<img src="${rec.image}" class="recognition-img" style="max-width: 250px; border-radius: 6px;">` : ""}
          <span class="recognition-timestamp">${rec.timestamp}</span>
        </div>
      `;
      list.appendChild(div);

      const deleteBtn = div.querySelector(".delete-recognition-btn");
      deleteBtn.addEventListener("click", () => {
        const id = parseInt(deleteBtn.dataset.id);
        const updatedList = (JSON.parse(localStorage.getItem("recognitions")) || []).filter(item => item.id !== id);
        localStorage.setItem("recognitions", JSON.stringify(updatedList));
        loadRecognitions();
      });
    });
  }
});
