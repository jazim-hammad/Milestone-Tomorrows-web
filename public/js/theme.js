document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-theme");
  });

  // Initialize the correct theme on page load
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");
  }
});
