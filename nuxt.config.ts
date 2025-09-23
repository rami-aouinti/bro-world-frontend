// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      adminApiBaseUrl:
        process.env.NUXT_PUBLIC_ADMIN_API_BASE_URL ||
        process.env.ADMIN_API_BASE_URL ||
        'http://localhost:3001'
    }
  }
})
