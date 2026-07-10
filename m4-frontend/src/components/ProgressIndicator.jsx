export default function ProgressIndicator({ step, percent }) {
  const steps = [
    { number: 1, label: "Extracting Documents" },
    { number: 2, label: "Analysing Content" },
    { number: 3, label: "Checking Compliance Rules" },
    { number: 4, label: "Generating Report" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Step Indicators */}
      <div className="flex justify-between w-full max-w-2xl mb-8">
        {steps.map((s, index) => (
          <div key={s.number} className="flex flex-col items-center">
            {/* Circle with step number */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                s.number < step
                  ? "bg-green-500 text-white"
                  : s.number === step
                    ? "text-white animate-pulse"
                    : "bg-gray-300 text-gray-600"
              }`}
              style={
                s.number < step
                  ? { backgroundColor: "#22c55e" }
                  : s.number === step
                    ? { backgroundColor: "#ce1252" }
                    : {}
              }
            >
              {s.number < step ? "✓" : s.number}
            </div>
            {/* Step label */}
            <p className="text-sm font-medium mt-2 text-center max-w-20">
              {s.label}
            </p>
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mt-3 transition-all ${
                  s.number < step ? "bg-green-500" : "bg-gray-300"
                }`}
                style={s.number < step ? { backgroundColor: "#22c55e" } : {}}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <progress
          className="progress w-full h-3"
          value={percent}
          max="100"
          style={{
            "--tw-bg-opacity": "1",
            "--color-stop-1": "#ce1252",
          }}
        />
      </div>

      {/* Progress Percentage and Status */}
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: "#ce1252" }}>
          {percent}%
        </div>
        <p className="text-lg text-gray-600 mb-2">
          {steps[step - 1]?.label || "Completing..."}
        </p>
        <p className="text-sm text-gray-500">
          Please wait while we analyse your documents...
        </p>
      </div>

      {/* Loading animation */}
      <div className="flex gap-2 mt-6">
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: "#ce1252", animationDelay: "0s" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: "#f06aa9", animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: "#9d0d3a", animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
