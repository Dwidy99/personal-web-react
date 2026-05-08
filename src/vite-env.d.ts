// / <reference types="vite/client" />

declare module "*.css";
declare module "*.css?inline";
declare module "*.scss";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";
declare module "*.ico";
declare module "*.woff";
declare module "*.woff2";
declare module "*.ttf";
declare module "*.eot";

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;

    // ✅ Built-in Vite environment flags
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
