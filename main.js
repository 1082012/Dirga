const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load history dari localStorage
let history = JSON.parse(localStorage.getItem("dirga_chat")) || [];
history.forEach(msg => addMessage(msg.text, msg.sender, false));

// Fungsi tambah pesan ke chat
function addMessage(text, sender, save = true) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (save) {
    history.push({ text, sender });
    localStorage.setItem("dirga_chat", JSON.stringify(history));
  }
}

// Efek typing bot
function showTyping() {
  const div = document.createElement("div");
  div.classList.add("typing");
  div.textContent = "Dirga sedang mengetik...";
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return div;
}

// Kirim pesan user
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";

  const typingDiv = showTyping();

  // Panggil API
  try {
    const res = await fetch(`https://veloria-ui.vercel.app/ai/openai?text=${encodeURIComponent(text)}`);
    const data = await res.json();
    chatContainer.removeChild(typingDiv);

    if (data.status) {
      simulateTyping(data.result, "bot");
    } else {
      addMessage("⚠️ Maaf, Dirga mengalami kendala.", "bot");
    }
  } catch (err) {
    chatContainer.removeChild(typingDiv);
    addMessage("⚠️ Gagal terhubung ke server.", "bot");
  }
}

// Efek ketik perlahan
function simulateTyping(text, sender) {
  let i = 0;
  const div = document.createElement("div");
  div.classList.add("message", sender);
  chatContainer.appendChild(div);

  const interval = setInterval(() => {
    div.textContent += text.charAt(i);
    i++;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 25);

  history.push({ text, sender });
  localStorage.setItem("dirga_chat", JSON.stringify(history));
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Sambutan pertama kali
if (history.length === 0) {
  addMessage("Halo! Saya Dirga, si Jenius AI 🤖✨\nAda yang bisa saya bantu hari ini?", "bot");
                    }
