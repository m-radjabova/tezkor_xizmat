import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'

const siteUrl = process.env.VITE_SITE_URL || 'https://budgetplanner.com'
const appRoutes = [
  '/login',
  '/register',
  '/dashboard',
  '/analytics',
  '/categories',
  '/transactions',
  '/income',
  '/expenses',
  '/budgets',
  '/savings-goals',
  '/recurring-transactions',
  '/debts',
  '/notes',
  '/notifications',
  '/settings',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['report.png', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Budget Planner',
        short_name: 'BudgetPlanner',
        description:
          'Track expenses, manage budgets, monitor savings goals and improve your personal finances with Budget Planner.',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Sitemap({
      hostname: siteUrl,
      dynamicRoutes: appRoutes,
      changefreq: 'weekly',
      priority: {
        '*': 0.8,
        '/': 1,
        '/dashboard': 0.9,
      },
      readable: true,
      generateRobotsTxt: true,
      robots: [{ userAgent: '*', allow: '/' }],
    }),
  ],
})
