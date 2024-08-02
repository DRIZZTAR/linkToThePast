/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {

			inter: ['Inter', 'sans-serif'], // Add Inter font family
		},
		extend: {
			fontSize: {
				'10xl': '10rem',
				'11xl': '11rem',
				'12xl': '12rem',
				'13xl': '13rem',
			},
			animation: {
				'horizontal-scroll': 'horizontal-scroll linear 32s infinite ',
				'horizontal-scroll-2':
					'horizontal-scroll-2 linear 32s infinite ',
			},
			keyframes: {
				'horizontal-scroll': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				},
				'horizontal-scroll-2': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' },
				},
			},
		},
	},
	plugins: [],
};
