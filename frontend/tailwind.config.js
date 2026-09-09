/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0B0D14",
          900: "#12141F",
          800: "#1B1E2B",
          700: "#2A2E3F",
          600: "#454A5E",
          500: "#5C6178",
          400: "#7C8199",
          300: "#A4A9BD",
          200: "#CBCEDC",
          100: "#E4E6EF",
          50: "#F4F5F9",
        },
        signal: {
          50: "#EEF1FF",
          100: "#DEE3FF",
          200: "#B8C2FF",
          300: "#8C9BFF",
          400: "#6577FF",
          500: "#3A54F5",
          600: "#2B3FD1",
          700: "#2130A6",
          800: "#1A2680",
          900: "#141D63",
        },
        signal2: {
          400: "#00C2A8",
          500: "#00A891",
          600: "#00897A",
        },
        amber: {
          400: "#F5A524",
          500: "#E8940E",
        },
        rose: {
          400: "#F5495C",
          500: "#E12F44",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 18, 30, 0.04), 0 8px 24px -12px rgba(15, 18, 30, 0.10)",
        popover: "0 12px 32px -8px rgba(15, 18, 30, 0.22)",
      },
      borderRadius: {
        card: "14px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
