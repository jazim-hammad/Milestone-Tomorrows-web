// Import Firebase Authentication and Firestore
import { auth, db } from "firebase-init";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentChatId = null;

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.getElementById("hamburger-button");
  const backButton = document.getElementById("back-button");

  // Function to handle authentication state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is signed in:", user); // Debug log
      const displayName = user.displayName || user.email.split("@")[0];
      const userId = user.uid;

      // Update greeting on chat page
      const chatGreeting = document.getElementById("chat-greeting");
      if (chatGreeting) {
        chatGreeting.innerText = `Hi, ${displayName}, I'm Miles, your career guide assistant.`;
      }

      // Update user info in the menu
      const userNameElement = document.getElementById("user-name");
      const userEmailElement = document.getElementById("user-email");
      if (userNameElement) userNameElement.innerText = `Name: ${displayName}`;
      if (userEmailElement) userEmailElement.innerText = `Email: ${user.email}`;

      // Show logout button and user info
      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) logoutButton.style.display = "block";

      // Show the hamburger button and hide the back button
      hamburgerButton.style.display = "block";
      backButton.style.display = "none";

      // Load chat history and create a new chat session if none exist
      const chats = await loadChatHistory(userId);
      displayChats(chats);

      if (chats.length === 0) {
        await createNewChat(userId);
      } else {
        currentChatId = chats[0].id;
        await loadChatMessages(currentChatId);
      }
    } else {
      console.log("No user is signed in."); // Debug log

      // Update greeting on chat page if it exists
      const chatGreeting = document.getElementById("chat-greeting");
      if (chatGreeting) {
        chatGreeting.innerText = `Hi, I'm Miles, your career guide assistant.`;
      }

      // Hide logout button and user info
      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) logoutButton.style.display = "none";

      // Show the back button and hide the hamburger button
      hamburgerButton.style.display = "none";
      backButton.style.display = "block";
    }
  });

  // Logout functionality
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User signed out successfully."); // Debug log
          window.location.href = "./public/index.html";
        })
        .catch((error) => {
          console.error("Sign Out Error", error);
        });
    });
  }

  // Login form submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm["identifier"].value;
      const password = loginForm["pswd"].value;
      signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
          console.log("User signed in successfully:", cred.user); // Debug log
          window.location.href = "./public/chat.html";
        })
        .catch((error) => {
          console.error("Sign In Error", error);
        });
    });
  }

  // Signup form submission
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signupForm["email"].value;
      const password = signupForm["pswd"].value;
      const displayName = signupForm["username"].value;
      createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
          return updateProfile(cred.user, {
            displayName: displayName,
          }).then(() => {
            console.log("User signed up successfully:", cred.user); // Debug log
            window.location.href = "./public/chat.html";
          });
        })
        .catch((error) => {
          console.error("Sign Up Error", error);
        });
    });
  }
});

async function createNewChat(userId) {
  try {
    const chatTitle = `Chat ${new Date().toLocaleString()}`;
    const chatDoc = await addDoc(collection(db, "chats"), {
      userId: userId,
      title: chatTitle,
      timestamp: new Date(),
    });
    currentChatId = chatDoc.id;
    document.getElementById("chat-messages").innerHTML = ""; // Clear chat messages
    displayChats(await loadChatHistory(userId)); // Refresh chat list
    return chatDoc.id;
  } catch (e) {
    console.error("Error creating new chat: ", e);
  }
}

async function saveMessage(chatId, message, sender) {
  if (!chatId) {
    console.error("Chat ID is null. Cannot save message.");
    return;
  }
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      message: message,
      sender: sender,
      timestamp: new Date(),
    });
    console.log("Message saved successfully");

    // If the message is the first one in the chat, update the chat title
    const chatDoc = doc(db, "chats", chatId);
    const chatData = (await getDoc(chatDoc)).data();
    if (chatData.title.startsWith("Chat ")) {
      const newTitle = message.split(" ").slice(0, 3).join(" "); // Generate a title from the first few words
      await updateDoc(chatDoc, { title: newTitle });
      displayChats(await loadChatHistory(chatData.userId)); // Refresh chat list
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function loadChatHistory(userId) {
  const q = query(
    collection(db, "chats"),
    where("userId", "==", userId),
    orderBy("timestamp")
  );

  try {
    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      chatData.id = doc.id; // Add the document ID to the chat data
      chats.push(chatData);
    });

    return chats;
  } catch (e) {
    console.error("Error loading chat history: ", e);
    return [];
  }
}

function displayChats(chats) {
  const chatList = document.getElementById("chat-list");
  chatList.innerHTML = ""; // Clear existing chat history

  chats.forEach((chat) => {
    const listItem = document.createElement("li");
    listItem.className = "chat-history-item";
    listItem.innerText = chat.title;
    listItem.dataset.chatId = chat.id;
    listItem.addEventListener("click", () => loadChatMessages(chat.id));
    chatList.appendChild(listItem);
  });
}

async function loadChatMessages(chatId) {
  currentChatId = chatId;
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp")
  );

  try {
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    displayMessages(messages);
  } catch (e) {
    console.error("Error loading chat messages: ", e);
  }
}

function displayMessages(messages) {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = ""; // Clear existing messages

  messages.forEach((msg) => {
    displayMessage(msg.message, msg.sender);
  });
}

function displayMessage(message, className) {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.className = className;
  messageElement.innerText = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
}

async function getChatbotResponse(message) {
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "Sorry, something went wrong.";
  }
}

const sendMessage = async () => {
  const user = auth.currentUser;
  if (user && currentChatId) {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value;
    messageInput.value = ""; // Clear input

    // Display the user's message immediately
    displayMessage(message, "user-message");

    // Save the user's message to Firestore
    await saveMessage(currentChatId, message, "user-message");

    // Get chatbot response
    const botResponse = await getChatbotResponse(message);
    displayMessage(botResponse, "bot-message");

    // Save the chatbot's response to Firestore
    await saveMessage(currentChatId, botResponse, "bot-message");
  } else {
    console.error(
      "Cannot send message. User is not authenticated or currentChatId is null."
    );
  }
};

document.getElementById("send-button").addEventListener("click", () => {
  const message = document.getElementById("chat-input").value.trim();
  if (message) {
    sendMessage(message);
    document.getElementById("chat-input").value = "";
  }
});

document
  .getElementById("new-chat-button")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      currentChatId = await createNewChat(user.uid);
    } else {
      console.error("User is not authenticated. Cannot create a new chat.");
    }
  });
