import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
          900: "#064e3b",
        },
      },
    },
  },
  plugins: [],
};

export default config;