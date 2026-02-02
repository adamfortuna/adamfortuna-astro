// @ts-check
// Cloudflare Pages configuration

import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), react()],

  redirects: {
    '/feed': 'https://wp.adamfortuna.com/feed'
  },

  output: 'server',
  
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    routes: {
      strategy: 'auto',
    },
    imageService: 'passthrough',
  }),
});
