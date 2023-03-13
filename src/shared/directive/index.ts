import { defineNuxtPlugin } from "#app";
import { vInputTrim } from "~/../../src/shared/directive/input-trim";
import { ClickOutside } from "element-plus";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive("input-trim", vInputTrim);
  vueApp.directive("click-outside", ClickOutside);
});
