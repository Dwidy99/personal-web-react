const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  darkMode: "class", // ✅ menggunakan class, bisa dikontrol manual atau via system

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },

    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
      sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
    },

    screens: {
      "2xsm": "375px",
      xsm: "425px",
      tablet: "640px",
      desktop: "1280px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },

    extend: {
      colors: {
        /* 🌞 LIGHT MODE */
        white: "#FFFFFF",
        black: { DEFAULT: "#1C2434", 2: "#010101" },
        gray: {
          DEFAULT: "#EFF4FB",
          2: "#F7F9FC",
          3: "#FAFAFA",
          ...colors.gray,
        },
        body: "#64748B",
        stroke: "#E2E8F0",
        primary: "#3C50E0",
        secondary: "#80CAEE",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        graydark: "#333A48",
        whiten: "#F1F5F9",
        whiter: "#F5F7FD",

        /* 🌙 DARK MODE */
        dark: "#FFD966",
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3d4d60",
        "form-input": "#1d2a39",

        /* 🔹 Meta / Semantic Colors */
        meta: {
          1: "#B02A37",
          2: "#1F2937",
          3: "#047857",
          4: "#1E293B",
          5: "#1D4ED8",
          6: "#B45309",
          7: "#DC2626",
          8: "#C2410C",
          9: "#374151",
          10: "#0E7490",
          11: "#7F1D1D",
          12: "#1F2937",
          13: "#164E63",
          14: "#065F46",
          15: "#155E75",
        },
      },

      fontSize: {
        "title-xxl": ["44px", "55px"],
        "title-xl": ["36px", "45px"],
        "title-xl2": ["33px", "45px"],
        "title-lg": ["28px", "35px"],
        "title-md": ["24px", "30px"],
        "title-md2": ["26px", "30px"],
        "title-sm": ["20px", "26px"],
        "title-xsm": ["18px", "24px"],
      },

      spacing: {
        22.5: "5.625rem",
        25: "6.25rem",
        100: "25rem",
      },

      zIndex: {
        1: "1",
        9: "9",
        99: "99",
        999: "999",
        9999: "9999",
        99999: "99999",
      },

      keyframes: {
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
      },

      animation: {
        rotating: "rotating 30s linear infinite",
        "spin-1.5": "spin 1.5s linear infinite",
      },

      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#64748B", // text-body
            a: { color: "#3C50E0", "&:hover": { color: "#1D4ED8" } },
            img: {
              borderRadius: "0.5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            },
          },
        },
        invert: {
          css: {
            color: "#AEB7C0", // dark text
            a: { color: "#80CAEE", "&:hover": { color: "#3C50E0" } },
          },
        },
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
