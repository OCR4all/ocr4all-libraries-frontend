const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
    "./src/formkit.theme.ts",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
      },
      animation: {
        "waving-hand": "wave 2s linear infinite",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
      colors: {
        primary: {
          0: "var(--p-main-0)",
          50: "var(--p-main-50)",
          100: "var(--p-main-100)",
          200: "var(--p-main-200)",
          300: "var(--p-main-300)",
          400: "var(--p-main-400)",
          500: "var(--p-main-500)",
          600: "var(--p-main-600)",
          700: "var(--p-main-700)",
          800: "var(--p-main-800)",
          900: "var(--p-main-900)",
          950: "var(--p-main-950)",
        },
        surface: {
          DEFAULT: "var(--bg-500)",
          0: "var(--p-bg-0)",
          50: "var(--p-bg-50)",
          100: "var(--p-bg-100)",
          200: "var(--p-bg-200)",
          300: "var(--p-bg-300)",
          400: "var(--p-bg-400)",
          500: "var(--p-bg-500)",
          600: "var(--p-bg-600)",
          700: "var(--p-bg-700)",
          800: "var(--p-bg-800)",
          900: "var(--p-bg-900)",
          950: "var(--p-bg-950)",
        },
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar"),
    plugin(function ({ addVariant, e, postcss }) {
      addVariant("firefox", ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: "-moz-document",
          params: "url-prefix()",
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`,
          )}`;
        });
      });
    }),
  ],
};
