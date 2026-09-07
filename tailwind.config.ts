import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        trust: {
          safe: "#10B981", // Emerald green
          uncertain: "#F59E0B", // Amber yellow
          spam: "#EF4444", // Rose red
          urgent: "#8B5CF6", // Purple/Indigo pulse
        },
        slate: {
          850: "#151e2e",
          950: "#0b0f17",
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ring-pulse': 'ringPulse 2s ease-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        ringPulse: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8', boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)' },
          '70%': { transform: 'scale(1.15)', opacity: '0', boxShadow: '0 0 0 25px rgba(139, 92, 246, 0)' },
          '100%': { transform: 'scale(0.95)', opacity: '0', boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
