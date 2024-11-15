<template>
  <div id="app" class="chatbot-container">
    <div class="chatbot-header">
      <h1>Pet Care Chatbot</h1>
    </div>
    <div class="chat-area">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div :class="`message-bubble ${message.role}`">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="question-input">
      <input
        v-model="newQuestion"
        @keyup.enter="askQuestion"
        placeholder="Ask me anything about pets!"
      />
      <button @click="askQuestion" class="send-button">
        Send
      </button>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import OpenAI from "openai";
import { useToast } from "vue-toastification";
const OpenAI_KEY = import.meta.env.VITE_OPENAI_KEY;

export default {
  data() {
    return {
      messages: [],
      newQuestion: "", // Holds the user's new question
      toast: useToast()
    };
  },
  methods: {
    // Ask the question directly if it is pet-related
    async askQuestion() {
      // Check if the question contains pet-related keywords
      const petKeywords = ["pet", "dog", "cat", "animal", "fish", "bird", "reptile", "lizard", "snake"];
      const isPetRelated = petKeywords.some(keyword =>
        this.newQuestion.toLowerCase().includes(keyword)
      );

      if (isPetRelated) {
        // Add the user's question to the messages
        this.messages.push({ role: "user", text: this.newQuestion });

        // Store and clear the input field
        const question = this.newQuestion;
        this.newQuestion = "";

        // Call the OpenAI API
        try {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: question }],
            },
            {
              headers: {
                Authorization: `Bearer ${OpenAI_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Add the chatbot's response to the messages
          const reply = response.data?.choices?.[0]?.message?.content || "Sorry, an error occurred.";
          this.messages.push({ role: "bot", text: reply });
        } catch (error) {
          console.error("API error:", error);
          this.messages.push({ role: "bot", text: "Sorry, an error occurred." });
        }
      } else {
          this.toast.warning("Please enter a pet-related question.", {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
});
      }
    },
  },
};
</script>

<style scoped>
/* Overall container */
.chatbot-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

/* Header */
.chatbot-header {
  background-color: #f7dec9;
  /* background-color: blue; */
  text-align: center;
  padding: 10px 0;
  border-radius: 12px 12px 0 0;
  color: white;
}

.chatbot-header h1 {
  margin: 0;
  font-size: 1.8em;
  font-weight: bold;
}



/* Chat area */
.chat-area {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
  min-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9em;
  max-width: 70%;
  word-wrap: break-word;
}

/* User message */
.message-bubble.user {
  background: #f29040;
  color: white;
  align-self: flex-end;
}

/* Bot message */
.message-bubble.bot {
  background: #e5e5e5;
  color: #333;
  align-self: flex-start;
}

/* Question input */
.question-input {
  display: flex;
  gap: 10px;
  margin-top: auto;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-input input {
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 1em;
  outline: none;
  transition: border-color 0.3s ease;
}

.question-input input:focus {
  border-color: #f29040;
}

/* Send button */
.send-button {
  background: #f29040;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s ease;
}

.send-button:hover {
  background: #f29040;
}

/* Responsive styles */
@media (max-width: 768px) {
  .chatbot-container {
    padding: 15px;
  }

  .chatbot-header h1 {
    font-size: 1.5em;
  }

  .chat-area {
    min-height: 300px;
  }

  .question-input input {
    font-size: 0.9em;
  }

  .send-button {
    padding: 8px 15px;
    font-size: 0.9em;
  }
}
</style>
