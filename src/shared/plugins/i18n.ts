import { defineNuxtPlugin } from "nuxt/app";
import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import ja from "../locales/ja.json";

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ja",
  messages: {
    en,
    ja,
  },
});

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n);
});
