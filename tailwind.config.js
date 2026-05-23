/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./assets/js/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Plus Jakarta Sans", "sans-serif"],
                display: ["Playfair Display", "serif"]
            },
            colors: {
                brand: {
                    accent: "#5EA1FF",
                    cyan: "#61F5FF",
                    violet: "#A78BFA",
                    gold: "#F5C977"
                }
            }
        }
    }
};
