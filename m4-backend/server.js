//? ========================================
//? == CONFIGURATION AND DEPENDENCIES
//? ========================================
require("dotenv").config(); // Load .env variables

// Import libraries
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompts = require("./prompt.js");

// Initialize Express app
const app = express();

//? ========================================
//? == MIDDLEWARE SETUP
//? ========================================
// Enable CORS for (frontend-backend communication)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

//? ========================================
//? == GEMINI AI SETUP
//? ========================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//? ========================================
//? == API ROUTES
//? ========================================
// GET / - Test route to check server status
app.get("/", (req, res) => {
  res.send("Server is connected");
});

/**
 * Chat API endpoint
 * POST /chat - Process conversation and generate AI response
 *
 * Request body:
 * - model: (default: "gemini-2.5-flash")
 * - messages: Array of conversation messages
 * - promptType: Type of system prompt to use (default: "general")
 *
 * Response:
 * - JSON object with model, role, and text properties
 */
app.post("/chat", async (req, res) => {
  try {
    // Extract request parameters with defaults
    const {
      model = "gemini-2.5-flash",
      messages,
      promptType = "general",
    } = req.body;

    // Initialize the Gemini model
    const geminiModel = genAI.getGenerativeModel({ model });

    // Get the system prompt based on promptType
    const systemPrompt = prompts[promptType] || prompts.general;

    // Validate that messages array exists and isn't empty
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Extract the most recent user message
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content || "";

    //? ========================================
    //? == CONVERSATION CONTEXT FORMATTING
    //? ========================================

    // Format previous messages as context for the AI
    let conversationContext = "";
    if (messages.length > 1) {
      // Format previous messages as a conversation log
      conversationContext = "Previous conversation:\n";
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        const speaker = msg.role === "assistant" ? "Tina" : "User";
        conversationContext += `${speaker}: ${msg.content}\n`;
      }
      conversationContext += "\n";
    }

    // Combine system prompt, conversation context, and user message
    const prompt = `${systemPrompt}\n\n${conversationContext}User: ${userContent}`;

    try {
      //? ========================================
      //? == GEMINI API INTERACTION
      //? ========================================

      // Send the prompt to Gemini API using the text generation capability
      // use the "user" role for the entire context to simplify the interaction
      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      // Extract the text response from the API result
      const responseText = result.response.text();

      // Return successful response to the frontend
      return res.json({
        model,
        role: "assistant",
        text: responseText,
      });
    } catch (err) {
      // Log error information for Gemini API issues
      console.error("Gemini API error details:", err);
      throw err;
    }
  } catch (err) {
    // Handle and log any errors that occur during processing
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message || "Gemini API error" });
  }
});

//* ========================================
//* == SERVER INITIALIZATION
//* ========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
