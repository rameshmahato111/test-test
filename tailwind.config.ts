import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			inter: ["var(--font-inter)"],
  			poppins: ["var(--font-poppins)"]
  		},
  		boxShadow: {
  			categoryShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  			searchShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  			searchSuggestionShadow: '0px 2px 16px 0px rgba(0, 0, 0, 0.15)',
  			cardShadow: '0px 1px 12px 0px rgba(0, 0, 0, 0.07)',
  			arrowShadow: '0px 1px 6.5px 0px rgba(0, 0, 0, 0.08)'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				'0': 'var(--primary-color-00)',
  				'50': 'var(--primary-color-50)',
  				'100': 'var(--primary-color-100)',
  				'200': 'var(--primary-color-200)',
  				'300': 'var(--primary-color-300)',
  				'400': 'var(--primary-color-400)',
  				'500': 'var(--primary-color-500)',
  				'600': 'var(--primary-color-600)',
  				'700': 'var(--primary-color-700)',
  				'800': 'var(--primary-color-800)',
  				'900': 'var(--primary-color-900)'
  			},
  			green: {
  				'0': 'var(--green-color-0)'
  			},
  			blue: {
  				'50': 'var(--blue-color-50)',
  				'100': 'var(--blue-color-100)',
  				'200': 'var(--blue-color-200)'
  			},
  			gray: {
  				'50': 'var(--gray-color-50)',
  				'100': 'var(--gray-color-100)',
  				'200': 'var(--gray-color-200)',
  				'300': 'var(--gray-color-300)',
  				'400': 'var(--gray-color-400)',
  				'500': 'var(--gray-color-500)',
  				'600': 'var(--gray-color-600)',
  				'700': 'var(--gray-color-700)',
  				'800': 'var(--gray-color-800)',
  				'900': 'var(--gray-color-900)'
  			},
  			yellow: {
  				'50': 'var(--yellow-color-50)'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")({ nocompatible: true })],
};
export default config;
