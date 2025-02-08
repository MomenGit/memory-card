/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        "background-img": 'url("/background.jpeg")',
      },
    },
    colors: {
      primary: "#014A8E",
      secondary: "#FDC708",
    },
    fontFamily: {
      sans: ["fredoka", "ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ['"Roboto Mono"', "ui-monospace", "SFMono-Regular"],
    },
  },
  plugins: [],
};
