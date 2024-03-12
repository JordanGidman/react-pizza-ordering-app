/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // This colors object needs to go in the extends so that we have access to all tailwinds original colors as well as whichever we choose to add
            colors: {
                pizza: '#000',
            },
            height: {
                screen: '100dvh',
            },
        },
        fontFamily: {
            sans: 'Roboto Mono, monospace',
        },
    },
    plugins: [],
}
