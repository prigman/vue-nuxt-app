import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
	css: ['~/assets/main.css'],
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
})
