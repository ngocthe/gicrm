import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { persistKeys } from "./../../shared/constants/persist-key";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const redirect = useCookie(persistKeys.REDIRECT);
  const token = useCookie(persistKeys.ACCESS_TOKEN);
  if (!token.value) {
    redirect.value = to.fullPath;
    return navigateTo("/login");
  }
});
