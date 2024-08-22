import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "1px 1px 10px 1px #ffffff",
      },
      keyframes: {
        slideInBottom: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-bottom": "slideInBottom 0.5s ease-out",
      },
      screens: {
        xs: "374px",
      },
    },
  },
  plugins: [],
});
