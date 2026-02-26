/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: '#003b6f',
                accent: '#2563eb',
                background: '#f9fafb',
                card: '#ffffff',
                textPrimary: '#111827',
                textMuted: '#6b7280',
                border: '#e5e7eb',
                success: '#16a34a',
                amber: '#f59e0b',
            },
        },
    },
    plugins: [],
};
