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

// Identifies this deployment. Hashed asset filenames (/_astro/*.css, *.js)
// change whenever the CSS or JS changes, so HTML cached at the edge by a
// previous deploy would point at files the new deploy no longer serves —
// leaving pages unstyled. Mixing this into the edge cache key (see
// src/lib/edgeCache.ts) makes every deploy a cache miss.
// Cloudflare Pages sets CF_PAGES_COMMIT_SHA during the build; the timestamp
// keeps local builds unique too.
const BUILD_ID = process.env.CF_PAGES_COMMIT_SHA?.slice(0, 12) || Date.now().toString(36);

// https://astro.build/config
export default defineConfig({
  site: 'https://adamfortuna.com',

  vite: {
    plugins: [tailwindcss()],
    define: {
      __BUILD_ID__: JSON.stringify(BUILD_ID),
    },
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
