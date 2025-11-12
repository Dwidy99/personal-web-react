// Central export file for all service modules
// Makes importing services cleaner throughout the app

export * from "./userService";
export * from "./postService";

// Default axios instance
export { default as Api } from "./Api";
