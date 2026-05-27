import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serwistConfig: any = {
  precacheEntries: (self as unknown as WorkerGlobalScope).__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  // navigateFallback + denylist exist in serwist@9.5.11 runtime but the
  // bundler-resolved type file omits them — cast via `any` to work around it
  navigateFallback: "/",
  navigateFallbackDenylist: [/^\/api\//],
};

const serwist = new Serwist(serwistConfig);

serwist.addEventListeners();
