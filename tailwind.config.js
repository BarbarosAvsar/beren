/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lego: {
                    red: '#D93838',
                    blue: '#005F9A',
                    yellow: '#FFCF00',
                    green: '#279A2F',
                    white: '#FFFFFF',
                    black: '#1B1B1B',
                    grey: '#9C9C9C',
                }
            },
            fontFamily: {
                sans: ['Fredoka', 'sans-serif'],
                display: ['Bangers', 'cursive'],
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'spin-slow': 'spin 10s linear infinite',
            },
        },
    },
    plugins: [],
}
