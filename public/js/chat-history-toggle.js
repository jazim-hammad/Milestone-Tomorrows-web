document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.getElementById("chat-hamburger");
  const chatHistory = document.querySelector(".chat-history");

  // Ensure the elements are found
  if (!hamburgerButton || !chatHistory) {
    console.error("Hamburger button or chat history not found!");
    return;
  }

  // Toggle chat history visibility
  hamburgerButton.addEventListener("click", () => {
    console.log("Chat hamburger button clicked"); // Debug log
    if (chatHistory.style.display === "flex") {
      chatHistory.style.display = "none";
    } else {
      chatHistory.style.display = "flex";
    }
  });
});
