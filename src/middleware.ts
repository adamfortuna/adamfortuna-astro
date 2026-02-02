// Polyfill MessageChannel for React SSR on Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  // @ts-ignore
  globalThis.MessageChannel = class MessageChannel {
    port1: any;
    port2: any;

    constructor() {
      this.port1 = {
        postMessage: (data: any) => {
          queueMicrotask(() => {
            if (this.port2.onmessage) {
              this.port2.onmessage({ data });
            }
          });
        },
        onmessage: null,
        start: () => {},
        close: () => {},
      };
      this.port2 = {
        postMessage: (data: any) => {
          queueMicrotask(() => {
            if (this.port1.onmessage) {
              this.port1.onmessage({ data });
            }
          });
        },
        onmessage: null,
        start: () => {},
        close: () => {},
      };
    }
  };
}

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  return next();
});
