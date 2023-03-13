import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie(persistKeys.ACCESS_TOKEN).value;

  const notAuthPages = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/health-check",
    "/404",
    "/403",
  ];
  if (notAuthPages.includes(to.path) && !token) {
    return;
  }

  const redirect = useCookie(persistKeys.REDIRECT);
  if (!token) {
    redirect.value = to.fullPath;
    return navigateTo("/login");
  }

  if (notAuthPages.includes(to.path) && token) {
    return navigateTo("/");
  }
});
