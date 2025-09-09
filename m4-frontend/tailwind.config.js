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
        tinabot: {
          // Primary brand color (used for buttons, focus elements)
          primary: "#1078d4", // Example: blue - replace with client's primary color

          // Secondary color for accents and less prominent elements
          secondary: "#b61937", // Example: green - replace with client's secondary color

          // Accent color for highlights
          accent: "#4c94dc", // Example: orange - replace with accent color

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
    darkTheme: "tinabot",
  },
};
