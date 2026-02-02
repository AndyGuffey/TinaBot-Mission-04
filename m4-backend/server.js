//? ========================================
//? == CONFIGURATION AND DEPENDENCIES
//? ========================================
require("dotenv").config(); // Load .env variables

// Import libraries
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompts = require("./prompt.js");
const complianceRules = require("./compliance-rules.js");
const { extractTextFromFile } = require("./fileExtractor.js");

// Initialize Express app
const app = express();

//? ========================================
//? == MIDDLEWARE SETUP
//? ========================================
// Enable CORS for (frontend-backend communication)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Word, and TXT files are allowed.",
        ),
      );
    }
  },
});

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
 * File Upload endpoint
 * POST /api/upload - Handle file uploads and extract text
 *
 * Request:
 * - Form-data with files in "documents" field
 *
 * Response:
 * - JSON with extractedTexts (array of text content) and documentNames
 */
app.post("/api/upload", upload.array("documents"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const extractedTexts = [];
    const documentNames = [];

    // Extract text from each file
    for (const file of req.files) {
      try {
        const text = await extractTextFromFile(file.buffer, file.originalname);
        extractedTexts.push(text);
        documentNames.push(file.originalname);
      } catch (error) {
        console.error(
          `Error extracting text from ${file.originalname}:`,
          error,
        );
        return res.status(400).json({
          error: `Failed to process file: ${file.originalname}`,
          details: error.message,
        });
      }
    }

    res.json({
      status: "success",
      extractedTexts,
      documentNames,
      fileCount: extractedTexts.length,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      error: "Failed to upload files",
      details: error.message,
    });
  }
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
app.post("/api/chat", async (req, res) => {
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
/**
 * Compliance Analysis endpoint
 * POST /api/analyze - Process documents for financial planning compliance
 *
 * Request body:
 * - documents: Array of document objects with extracted text
 * - documentNames: Array of original filenames for reference
 *
 * Response:
 * - JSON compliance report with detailed analysis
 */
app.post("/api/analyze", async (req, res) => {
  try {
    const { documents, documentNames } = req.body;

    if (!documents || documents.length === 0) {
      return res.status(400).json({ error: "No documents provided" });
    }

    // Combine all documents for holistic analysis
    const combinedDocumentText = documents
      .map((doc, idx) => `\n\n--- Document: ${documentNames[idx]} ---\n${doc}`)
      .join("");

    // Format compliance rules for the prompt
    const rulesContext = complianceRules.rules
      .map(
        (r) =>
          `Step ${r.step}: ${r.name} (${r.severity})\n` +
          `  Description: ${r.description}\n` +
          `  Key Elements: ${r.keyElements.join(", ")}`,
      )
      .join("\n\n");

    // Get the compliance prompt
    const compliancePrompt = prompts.compliance;

    // Combine prompt with rules context
    const fullPrompt = `${compliancePrompt}\n\n=== COMPLIANCE RULES ===\n${rulesContext}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(
      `${fullPrompt}\n\n=== DOCUMENTS TO ANALYZE ===\n${combinedDocumentText}`,
    );

    const analysisResult = response.response.text();

    // Parse JSON response from Gemini
    let complianceReport;
    try {
      const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
      complianceReport = JSON.parse(jsonMatch[0]);
    } catch {
      // If Gemini doesn't return valid JSON, return raw text wrapped in object
      complianceReport = {
        summary: analysisResult,
        rawResponse: true,
      };
    }

    res.json({
      status: "success",
      model: "gemini-2.5-flash",
      report: complianceReport,
    });
  } catch (error) {
    console.error("Compliance analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze documents",
      details: error.message,
    });
  }
});

//* ========================================
//* == SERVER INITIALIZATION
//* ========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
