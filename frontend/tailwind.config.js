import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "1px 1px 20px 1px rgba(255, 255, 255, 0.645)",
        "active-shadow": "1px 1px 15px 0.5px rgba(255, 255, 255, 0.8)",
        "get-images-button": "4px 3px #D66D75",
        "get-images-button-hover": "6px 6px 2px #D66D75",
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
});
