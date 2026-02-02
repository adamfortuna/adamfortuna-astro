// @ts-check
// Cloudflare Pages configuration

import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// MessageChannel polyfill for React SSR on Cloudflare Workers
const messageChannelPolyfill = `
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = { postMessage: (d) => queueMicrotask(() => this.port2.onmessage?.({ data: d })), onmessage: null };
      this.port2 = { postMessage: (d) => queueMicrotask(() => this.port1.onmessage?.({ data: d })), onmessage: null };
    }
  };
}
`;

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          banner: messageChannelPolyfill,
        },
      },
    },
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
