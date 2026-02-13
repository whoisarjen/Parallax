import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    supabaseServiceKey: '',
    cronSecret: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/board/**': { ssr: false },
    '/my-boards': { ssr: false },
  },

  app: {
    head: {
      title: 'Parallax - Planning Poker',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Free, open-source planning poker for agile teams. No sign-up required.' },
        { property: 'og:title', content: 'Parallax - Planning Poker' },
        { property: 'og:description', content: 'Free, open-source planning poker for agile teams. Estimate stories in real-time with your team.' },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ],
    },
  },
})
