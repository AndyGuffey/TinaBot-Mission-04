/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lato"', '"Helvetica"', '"Arial"', "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        nzmai: {
          // Primary brand color (NZMAI deep rose/burgundy)
          primary: "#ce1252",

          // Secondary color for accents
          secondary: "#f06aa9", // Light variant for hover states

          // Accent color for highlights
          accent: "#9d0d3a", // Darker variant for active states

          // Neutral colors for text, backgrounds
          neutral: "#212B36",

          // Base colors for backgrounds
          "base-100": "#ffffff", // Main background
          "base-200": "#f5f5f5", // Secondary background
          "base-300": "#e0e0e0", // Tertiary background

          // Info, success, warning, error for notifications
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          error: "#F44336",
        },
      },
      "light", // Also include default light theme as fallback
    ],
    // Set your custom theme as default
    darkTheme: "nzmai",
  },
};
