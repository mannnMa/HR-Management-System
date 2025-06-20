const uploadInput = document.getElementById("upload-input");
const uploadBtn = document.getElementById("upload-btn");
const profilePic = document.getElementById("profile-pic");

uploadBtn.addEventListener("click", () => {
  uploadInput.click(); // Open file selector
});


//
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
      localStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(file);
  }
});

//Load saved profile picture
window.addEventListener("load", () => {
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) {
    profilePic.src = savedPic;
  }
});

//profile info functionality
const editableFields = {
  "employee-name-display": "employeeName",
  "employee-id-display": "employeeId",
  "employee-position-display": "employeePosition",
  "employee-dept-display": "employeeDept"
};

// Load and auto-save contenteditable fields
for (const [elementId, storageKey] of Object.entries(editableFields)) {
  const el = document.getElementById(elementId);
  const savedValue = localStorage.getItem(storageKey);
  if (savedValue) el.textContent = savedValue;

  el.addEventListener("blur", () => {
    localStorage.setItem(storageKey, el.textContent.trim());
  });
}

