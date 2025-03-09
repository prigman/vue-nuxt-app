import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
	css: ['~/assets/main.css', 'primeicons/primeicons.css'],
	vite: {
    plugins: [
      tailwindcss(),
    ],
  },
	runtimeConfig: {
		public: {
			api_key: process.env.API_KEY,
		},
  },
	modules: [
		'@primevue/nuxt-module'
	],
	primevue: {
		options: {
				ripple: true,
				inputVariant: 'filled',
				theme: {
						preset: Aura,
						options: {
								theme: false,
								prefix: 'p',
								darkModeSelector: false,
								cssLayer: false
						}
				}
		}
}
})
