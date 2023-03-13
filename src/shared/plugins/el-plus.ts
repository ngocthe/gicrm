import Element from "element-plus";
import locale from "element-plus/lib/locale/lang/ja";
import { defineNuxtPlugin } from "#app";
import { ID_INJECTION_KEY } from "element-plus";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0,
  });
  vueApp.use(Element, {
    locale,
  });
});
