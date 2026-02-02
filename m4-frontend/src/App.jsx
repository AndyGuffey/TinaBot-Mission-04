import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import FileUploader from "./components/FileUploader";
import ComplianceReport from "./components/ComplianceReport";
import ProgressIndicator from "./components/ProgressIndicator";
import Footer from "./components/Footer";

export default function App() {
  //? ========================
  //? === STATE MANAGEMENT
  //? ========================
  // Conversation Log - Tracks the entire chat history
  // First Msg is hardcoded intro from TinaBot
  const [log, setLog] = useState([
    {
      role: "interviewer",
      text: "Hi! I'm Tina, Im here to help you choose the right insurance policy. Can I ask you a few questions to esure that we find the best policy for you?",
    },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded files
  const [complianceReport, setComplianceReport] = useState(null); // Store analysis results
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [appMode, setAppMode] = useState("upload"); // "upload", "progress", or "report"
  const [answer, setAnswer] = useState(""); // Chat input field
  const [progressStep, setProgressStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  //? =================================
  //? === REFS FOR DOM MANIPULATION
  //? =================================

  const chatContainerRef = useRef(null); // References the chat container for scrolling
  const lastMessageRef = useRef(null); // References the most recent message
  const loadingMessageRef = useRef(null); // References the loading indicator

  //? =================================
  //? === EVENT HANDLERS
  //? =================================
  /**
   * Handles Enter key press in the textarea
   * Allows sending messages with Enter but permits new lines with Shift+Enter
   */

  const handleKeyDown = (e) => {
    // Check if Enter was pressed without holding Shift (for new lines)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      sendAnswer(); // Send the message
    }
  };

  /**
   * Handles file selection from the FileUploader component
   */
  const handleFilesSelected = (files) => {
    setUploadedFiles(files);
  };

  /**
   * Analyzes selected documents for compliance
   * Sends files to backend for extraction and Gemini analysis
   */
  const analyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMsg("Please select at least one document");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setAppMode("progress");
    setProgressStep(1);
    setProgressPercent(0);

    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      // Step 1: Upload and extract text from documents
      const uploadResponse = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload documents");
      }

      const uploadData = await uploadResponse.json();

      // Step 2: Analyze extracted documents for compliance
      const analysisResponse = await fetch(
        "http://localhost:3000/api/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documents: uploadData.extractedTexts,
            documentNames: uploadData.documentNames,
          }),
        },
      );

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze documents");
      }

      const analysisData = await analysisResponse.json();
      setComplianceReport(analysisData.report);
      setAppMode("report");
    } catch (error) {
      console.error("Analysis error:", error);
      setErrorMsg(error.message || "Failed to analyze documents");
      setAppMode("upload");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the app to upload mode for analyzing new documents
   */
  const resetToUpload = () => {
    setAppMode("upload");
    setUploadedFiles([]);
    setComplianceReport(null);
    setErrorMsg("");
  };

  //?  ==================================
  //?  === CONSTANTS
  //?  ==================================

  const MODEL = "gemini-2.5-flash"; // Specific AI model to use
  const API_URL = "http://localhost:3000/api/chat"; // Backend API endpoint

  //?  ==================================
  //?  === SIDE EFFECTS
  //?  ==================================
  /**
   * Sets the DaisyUI theme for the application
   * Applied once when component mounts
   */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "nzmai");
  }, []);

  /**
   * Simulates progress during document analysis
   * Updates progress step and percentage over ~60 seconds
   */
  useEffect(() => {
    if (appMode !== "progress") return;

    const progressSteps = [
      { step: 1, duration: 8000, targetPercent: 25 }, // Extracting documents: 8s to 25%
      { step: 2, duration: 15000, targetPercent: 50 }, // Analyzing content: 15s to 50%
      { step: 3, duration: 25000, targetPercent: 75 }, // Checking compliance rules: 25s to 75%
      { step: 4, duration: 60000, targetPercent: 100 }, // Generating report: 60s to 100%
    ];

    let currentProgress = 0;
    let currentStep = 1;
    let startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Find current step based on elapsed time
      for (let i = 0; i < progressSteps.length; i++) {
        if (elapsed < progressSteps[i].duration) {
          currentStep = progressSteps[i].step;
          // Calculate progress within this step
          const stepStart = i > 0 ? progressSteps[i - 1].duration : 0;
          const stepEnd = progressSteps[i].duration;
          const stepPrevPercent =
            i > 0 ? progressSteps[i - 1].targetPercent : 0;
          const stepTargetPercent = progressSteps[i].targetPercent;

          const stepProgress = (elapsed - stepStart) / (stepEnd - stepStart);
          currentProgress =
            stepPrevPercent +
            (stepTargetPercent - stepPrevPercent) * stepProgress;
          break;
        }
      }

      setProgressStep(currentStep);
      setProgressPercent(Math.min(Math.round(currentProgress), 99));

      // Stop when fully complete
      if (elapsed >= 60000) {
        clearInterval(interval);
        setProgressPercent(100);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [appMode]);

  /**
   * Auto-scrolls to the recent message whenever conversation updates
   * Smooth scrolling experience for ongoing conversations
   */
  useEffect(() => {
    // When log changes OR loading state changes
    if (loading && loadingMessageRef.current) {
      // If loading, scroll to the loading message
      loadingMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (lastMessageRef.current) {
      // Otherwise scroll to the last actual message
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [log, loading]); // run this effect when log or loading changes

  // ! ==================================
  // ! ==================================
  // ! == API INTERACTION
  // ! ==================================
  /**
   * Sends user message to the backend API and processes the response
   * Handles the complete lifecycle of a message:
   * 1- Validation and preparation
   * 2- API communication
   * 3- Response processing
   * 4- Error handling
   */

  async function sendAnswer() {
    setErrorMsg("");
    const trimmed = answer.trim();
    if (!trimmed || loading) return;

    // Immediately add the user message to the log
    setLog((prev) => [...prev, { role: "user", text: trimmed }]);

    // Clear the input field right away
    setAnswer("");

    // Then set loading state
    setLoading(true);

    try {
      // Format conversation history for the API
      // Get the updated log (including the new user message)
      const currentLog = [...log, { role: "user", text: trimmed }];

      const messages = currentLog.map((m) => ({
        role: m.role === "interviewer" ? "assistant" : "user",
        content: m.text,
      }));

      // Send request to backend API
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages,
          promptType: "insurance",
        }),
      });

      // Handle HTTP errors
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      // Process successful response
      const data = await res.json();

      // Add only the AI response to the log (user message was already added)
      setLog((prev) => [
        ...prev,
        { role: "interviewer", text: data.text ?? "(no reply)" },
      ]);
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  //? =========================
  //? == COMPONENT RENDER
  //? =========================
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-4xl mx-auto my-8 font-sans px-4">
        {/* ===== HEADER SECTION ===== */}
        <div
          className="border-2 p-4 mb-4 text-center rounded-lg"
          style={{ borderColor: "#ce1252" }}
        >
          <h1
            className="text-5xl font-bold mb-2 text-center"
            style={{ color: "#ce1252" }}
          >
            POC
          </h1>

          <h2
            className="text-3xl font-semibold mb-2 text-center"
            style={{ color: "#ce1252" }}
          >
            AI Compliance Report Assistant
          </h2>
        </div>

        {/* ===== ERROR MESSAGE DISPLAY ===== */}
        {errorMsg && (
          <div className="text-white bg-[#b61937] border border-[#8e132a] rounded-md px-4 py-3 my-4">
            {errorMsg}
          </div>
        )}

        {/* ===== CONDITIONAL RENDERING: UPLOAD VS PROGRESS VS REPORT MODE ===== */}
        {appMode === "upload" ? (
          <>
            {/* FILE UPLOAD SECTION */}
            <FileUploader
              onFilesSelected={handleFilesSelected}
              files={uploadedFiles}
              onAnalyze={analyzeDocuments}
              loading={loading}
            />
          </>
        ) : appMode === "progress" ? (
          <>
            {/* PROGRESS INDICATOR SECTION */}
            <ProgressIndicator step={progressStep} percent={progressPercent} />
          </>
        ) : (
          <>
            {/* COMPLIANCE REPORT SECTION */}
            <ComplianceReport report={complianceReport} />

            {/* UPLOAD NEW DOCUMENTS BUTTON */}
            <div className="flex justify-center mt-6">
              <button
                onClick={resetToUpload}
                className="btn gap-2 text-white"
                style={{ backgroundColor: "#ce1252" }}
              >
                <span>↻</span>
                Analyze More Documents
              </button>
            </div>
          </>
        )}

        {/* ===== LEGACY CHAT INTERFACE (Hidden for now) ===== */}
        {appMode === "legacy-chat" && (
          <>
            {/* CONVERSATION HISTORY DISPLAY */}
            <div
              ref={chatContainerRef}
              className="h-96 min-h-[450px] overflow-y-auto bg-white my-5 shadow-lg text-lg p-4 rounded-lg flex flex-col gap-2 border-[#a09d9e]"
            >
              {/* Map through conversation log and render each message */}
              {log.map((m, i) => (
                <div
                  key={i}
                  ref={i === log.length - 1 ? lastMessageRef : null}
                  className={`chat ${
                    m.role === "user" ? "chat-end" : "chat-start"
                  }`}
                >
                  {/* Add avatar only for TinaBot messages */}
                  {m.role === "interviewer" && (
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img src="/Favicon.png" alt="TinaBot Avatar" />
                      </div>
                    </div>
                  )}
                  {/* Chat bubble with conditional styling based on sender */}
                  <div
                    className={`chat-bubble ${
                      m.role === "user"
                        ? "bg-[#1078d4] text-white shadow-md"
                        : "bg-[#a09d9e] text-gray-800 shadow-md"
                    }`}
                  >
                    {/* Sender identification label */}
                    <span className="font-bold mr-2">
                      {m.role === "interviewer" ? "TinaBot" : "Me"}:
                    </span>
                    {/* Render message content with Markdown support */}
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Add the loading indicator as a chat bubble when loading */}
              {loading && (
                <div className="chat chat-start" ref={loadingMessageRef}>
                  <div className="chat-bubble bg-[#a09d9e] text-gray-800 shadow-md min-h-[60px] flex items-center">
                    <span className="font-bold mr-2">TinaBot:</span>
                    <span className="loading loading-dots loading-md text-[#b61937]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* USER INPUT AREA */}
            <div className="flex items-center gap-2">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer…"
                className="textarea flex-1 bg-white border-2 border-[#1078d4] text-gray-800 rounded-xl p-4 focus:outline-none focus:border-[#1078d4] focus:ring-1 focus:ring-[#1078d4] text-lg"
                disabled={loading}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={sendAnswer}
              disabled={loading || !answer.trim()}
              className={`btn btn-lg btn-block mt-4 border-none ${
                loading
                  ? "bg-[#a09d9e] cursor-not-allowed"
                  : "bg-[#1078d4] hover:bg-[#0d6abc] text-white"
              }`}
            >
              {loading ? "Thinking…" : "Submit"}
            </button>
          </>
        )}

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
