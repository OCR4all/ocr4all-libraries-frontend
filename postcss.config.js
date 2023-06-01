module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    autoprefixer: {},
    tailwindcss: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
