// script.js

let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");

function updateHistoryUI() {
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  chatHistory.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.prompt;
    li.onclick = () => loadChat(index);
    historyList.appendChild(li);
  });
}

function startNewChat() {
  document.getElementById("chat-container").innerHTML = "";
}

function loadChat(index) {
  const chat = chatHistory[index];
  const container = document.getElementById("chat-container");
  container.innerHTML = "";
  appendMessage("user", chat.prompt);
  appendMessage("ai", chat.response);
}

async function sendMessage() {
  const inputBox = document.getElementById("input");
  const userInput = inputBox.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  inputBox.value = "";

  const loadingMsg = appendMessage("ai", "🧠 Thinking...");

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are VibhavGPT, a helpful AI for homework help." },
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ AI didn’t answer.";
    updateMessage(loadingMsg, reply);

    chatHistory.push({ prompt: userInput, response: reply });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    updateHistoryUI();

  } catch (err) {
    updateMessage(loadingMsg, "❌ Error: " + err.message);
  }
}

function appendMessage(role, text) {
  const container = document.getElementById("chat-container");
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function updateMessage(el, newText) {
  el.textContent = newText;
}

document.addEventListener("DOMContentLoaded", updateHistoryUI);
