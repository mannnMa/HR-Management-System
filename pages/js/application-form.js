window.addEventListener("DOMContentLoaded", function () {
  const resumeInput = document.getElementById("resume");
  const fileLabel = document.getElementById("fileLabel");
  const form = document.getElementById("applicationForm");
  const trackingDisplay = document.getElementById("trackingNumber");
  const modal = document.getElementById("successModal");
  const termsModal = document.getElementById("termsModal");

  // === File label update ===
  resumeInput.addEventListener("change", () => {
    fileLabel.textContent = resumeInput.files.length > 0
      ? resumeInput.files[0].name
      : "No file chosen";
  });

  // === Block numbers in name fields ===
  ["firstName", "middleName", "lastName"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("keydown", e => {
      if (e.key >= '0' && e.key <= '9') e.preventDefault();
    });
    input.addEventListener("input", function () {
      this.value = this.value.replace(/\d/g, "");
    });
  });

  // === Form submission ===
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const termsChecked = document.getElementById("terms").checked;
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneValue = document.getElementById("phone").value.trim();

    const nameFields = [firstName, middleName, lastName];
    const hasNumber = nameFields.some(name => /\d/.test(name));
    if (hasNumber) {
      alert("Name fields should not contain numbers.");
      return;
    }

    const isValidPhone = /^(\+639|09)\d{9}$/.test(phoneValue);
    if (!isValidPhone) {
      alert("Please enter a valid Philippine phone number (e.g. 09171234567 or +639171234567).");
      return;
    }

    if (resumeInput.files.length === 0) {
      alert("Please upload your resume before submitting.");
      return;
    }

    if (!termsChecked) {
      termsModal.style.display = "block";
      return;
    }

    const trackingNumber = generateTrackingNumber();
    trackingDisplay.textContent = trackingNumber;
    modal.style.display = "block";
  });

  // === Generate tracking number ===
  function generateTrackingNumber() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `APP-${randomNum}`;
  }

  // === Close success modal ===
  window.closeModal = function () {
    modal.style.display = "none";
    form.reset();
    fileLabel.textContent = "No file chosen";
  };

  // === Close terms modal ===
  window.closeTermsModal = function () {
    termsModal.style.display = "none";
  };
});
