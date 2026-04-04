/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    safelist: [
        "bg-[#a6c792]",
        "h-[100dvh]",
        "overflow-y-auto",
        "overflow-hidden",
        "m-0",
        "inset-0",
        "z-1",
        "bg-teal-400",

        "xs:block",
        "sm:block",
        "md:block",
        "lg:block",
        "xl:block",
        "2xl:block",
        "3xl:block",

        // hidden
        "xs:hidden",
        "sm:hidden",
        "md:hidden",
        "lg:hidden",
        "xl:hidden",
        "2xl:hidden",
        "3xl:hidden",

        "left-[0rem]",
        "right-[0rem]",
        "left-[0rem]",
        "right-[0rem]",

    ],
    theme: {
        screens: {
            xs: '30rem',
            sm: '40rem',            
            md: '48rem',
            lg: '64rem',
            xl: '80rem',
            '2xl': '96rem',
            '3xl': '117.5rem',
            menu: '36.625rem',
            soko: '71.875rem',
        }
    },

    extend: {
        colors: {
            white: "#ffffff",
            black: "#111114",
            yellow: "#efff5b",
            green: "#4cd964",
            orange: "#f54f11",
            grey: "#a0a0a0",
            blue: "#007aff"
        },

        fontFamily: {
            inter: ["Inter", "sans-serif"]
        },

        fontSize: {
            h1: ["3rem", { lineHeight: "120%", fontWeight: "700" }],
            h2: ["2.25rem", { lineHeight: "120%", fontWeight: "700" }],
            h3: ["1.75rem", { lineHeight: "120%", fontWeight: "600" }],
            h4: ["1.375rem", { lineHeight: "120%", fontWeight: "600" }],

            body: ["1rem", { lineHeight: "160%" }],
            small: ["0.875rem", { lineHeight: "160%" }],
        },
    },

    plugins: [],
};