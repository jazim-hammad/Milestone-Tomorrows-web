document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.getElementById("hamburger-button");
  const menuContent = document.getElementById("menu-content");

  // Ensure the elements are found
  if (!hamburgerButton || !menuContent) {
    console.error("Hamburger button or menu content not found!");
    return;
  }

  // Toggle menu visibility
  hamburgerButton.addEventListener("click", () => {
    console.log("Hamburger button clicked"); // Debug log
    if (menuContent.style.display === "block") {
      menuContent.style.display = "none";
    } else {
      menuContent.style.display = "block";
    }
  });
});
