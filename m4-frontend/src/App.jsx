import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  //? ========================
  //? === STATE MANAGEMENT
  //? ========================
  // Conversation Log - Tracks the entire chat history
  // First Msg is hardcoded intro from TinaBot
  const [log, setLog] = useState([
    {
      role: "interviewer",
      text: "Hi! I'm TinaBot, Im here to help you choose the right insurance policy. Can I ask you a few questions to esure that we find the best policy for you?",
    },
  ]);
  const [answer, setAnswer] = useState(""); // Current user input
  const [loading, setLoading] = useState(false); // Tracks API request status
  const [errorMsg, setErrorMsg] = useState(""); // Stores error messages

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

  //?  ==================================
  //?  === CONSTANTS
  //?  ==================================

  const MODEL = "gemini-2.5-flash"; // Specific AI model to use
  const API_URL = "http://localhost:3000/chat"; // Backend API endpoint

  //?  ==================================
  //?  === SIDE EFFECTS
  //?  ==================================
  /**
   * Sets the DaisyUI theme for the application
   * Applied once when component mounts
   */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "tinabot");
  }, []);

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
      <div className="max-w-2xl mx-auto my-8 font-sans">
        {/* ===== HEADER SECTION ===== */}
        <div className="border-2 border-[#1078d4] p-4 mb-4 text-center rounded-lg">
          <h1 className="text-5xl font-bold mb-2 text-[#1078d4] text-center">
            TinaBot&apos;s
          </h1>

          <h2 className="text-3xl font-semibold mb-2 text-[#1078d4] text-center">
            Insurance Policy Assistant
          </h2>
        </div>

        {/* ===== CONVERSATION HISTORY DISPLAY ===== */}
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

        {/* ===== USER INPUT AREA ===== */}
        <div className="flex items-center gap-2">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown} // Enable Enter key submission
            placeholder="Type your answer…"
            className="textarea flex-1 bg-white border-2 border-[#1078d4] text-gray-800 rounded-xl p-4 focus:outline-none focus:border-[#1078d4] focus:ring-1 focus:ring-[#1078d4] text-lg"
            disabled={loading} // Prevent input during loading
          />
        </div>

        {/* ===== SUBMIT BUTTON ===== */}
        <button
          onClick={sendAnswer}
          disabled={loading || !answer.trim()} // Disable when loading or empty input
          className={`btn btn-lg btn-block mt-4 border-none ${
            loading
              ? "bg-[#a09d9e] cursor-not-allowed" // Gray when disabled
              : "bg-[#1078d4] hover:bg-[#0d6abc] text-white" // Blue when active
          }`}
        >
          {loading ? "Thinking…" : "Submit"}
        </button>

        {/* ===== ERROR MESSAGE DISPLAY ===== */}
        {errorMsg && (
          <div className="text-white bg-[#b61937] border border-[#8e132a] rounded-md px-4 py-3 my-4">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
