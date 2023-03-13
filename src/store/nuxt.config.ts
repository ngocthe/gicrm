import { CommonConfig } from "~/../../nuxt.config";

export default defineNuxtConfig({
  ...CommonConfig,
  plugins: [...CommonConfig.plugins, "../shared/plugins/chart.ts"],
  ssr: false,
});
