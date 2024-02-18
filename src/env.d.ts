/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_RECAPTCHA_CLIENT_KEY: string;
    readonly RECAPTCHA_SECRET_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }