const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'junicode': ['Junicode', 'normal'],
      },
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
          0: "rgb(var(--main-0) / <alpha-value>)",
          50: "rgb(var(--main-50) / <alpha-value>)",
          100: "rgb(var(--main-100) / <alpha-value>)",
          200: "rgb(var(--main-200) / <alpha-value>)",
          300: "rgb(var(--main-300) / <alpha-value>)",
          400: "rgb(var(--main-400) / <alpha-value>)",
          500: "rgb(var(--main-500) / <alpha-value>)",
          600: "rgb(var(--main-600) / <alpha-value>)",
          700: "rgb(var(--main-700) / <alpha-value>)",
          800: "rgb(var(--main-800) / <alpha-value>)",
          900: "rgb(var(--main-900) / <alpha-value>)",
          950: "rgb(var(--main-950) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--bg-500) / <alpha-value>)",
          0: "rgb(var(--bg-0) / <alpha-value>)",
          50: "rgb(var(--bg-50) / <alpha-value>)",
          100: "rgb(var(--bg-100) / <alpha-value>)",
          200: "rgb(var(--bg-200) / <alpha-value>)",
          300: "rgb(var(--bg-300) / <alpha-value>)",
          400: "rgb(var(--bg-400) / <alpha-value>)",
          500: "rgb(var(--bg-500) / <alpha-value>)",
          600: "rgb(var(--bg-600) / <alpha-value>)",
          700: "rgb(var(--bg-700) / <alpha-value>)",
          800: "rgb(var(--bg-800) / <alpha-value>)",
          900: "rgb(var(--bg-900) / <alpha-value>)",
          950: "rgb(var(--bg-950) / <alpha-value>)",
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
