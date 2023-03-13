import { CommonConfig } from "../../nuxt.config";

export default defineNuxtConfig({
  ...CommonConfig,
  alias: {
    "@share": "",
  },
  plugins: [...CommonConfig.plugins, "../shared/plugins/chart.ts"],
  ssr: false,
});
