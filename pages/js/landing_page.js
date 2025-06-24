 <script>
  document.getElementById("feedbackForm").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("toast").style.display = "block";

    setTimeout(() => {
      document.getElementById("toast").style.display = "none";
      document.getElementById("feedbackForm").reset();
    }, 4000);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
</script>
