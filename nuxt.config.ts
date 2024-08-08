// import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  css: [
    '@/assets/main.scss',
    '@/assets/_variables.scss',
  ],

  routeRules: {
   
  },

  googleFonts: {
    families: {
      Roboto: true,
      Judson: true,
    }
  },

  compatibilityDate: '2024-08-08',
})