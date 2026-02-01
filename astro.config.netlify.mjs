// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), react()],

  redirects: {
    '/feed': 'https://wp.adamfortuna.com/feed'
  },

  adapter: netlify({
    cacheOnDemandPages: true,
  })
});