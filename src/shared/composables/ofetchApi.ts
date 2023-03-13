import { persistKeys } from "./../constants/persist-key";
import { useCookie, useRouter, useRuntimeConfig } from "nuxt/app";
import { FetchOptions, $fetch } from "ohmyfetch";
import { messageError } from "~/../../src/shared/utils/notification";
import STATUS_CODE from "../constants/statusCodeResponse";
import { useMeStore } from "~/../../src/shared/stores/me";
import {
  IResponseData,
  IResponseError,
} from "~/../../src/shared/requests/types";

export default async function oFetchApi<T>(
  url: string,
  options?: FetchOptions
) {
  const config = useRuntimeConfig();
  const router = useRouter();
  const token = useCookie(persistKeys.ACCESS_TOKEN);
  // @ts-ignore
  return await $fetch<IResponseData<T>>(url, {
    baseURL: config.public.apiUrl,
    retry: 0,
    ...options,
    async onResponse({ response }) {
      return response._data;
    },
    async onResponseError({ response }) {
      if (response.status === STATUS_CODE.AUTHENTICATION) {
        const ignoreUrl = [
          "/reset-password",
          "/forgot-password",
          "/store-forgot-password",
        ];
        const arr: boolean[] = ignoreUrl.map((item) =>
          response.url.includes(item)
        );
        if (!arr.includes(true)) {
          const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
          cookieToken.value = null;
          useMeStore().$reset();
          await router.push("/login");
        }
      }

      if (response.status === STATUS_CODE.AUTHORIZATION) {
        await router.push("/403");
      }

      if (response.status === STATUS_CODE.SERVER_ERROR) {
        messageError("errors.internal_serve");
      }
    },
    async onRequest({ options }) {
      if (token.value) {
        const headers: HeadersInit = {
          Accept: "application/json",
          ...(options?.headers || {}),
          ...(token && { Authorization: `Bearer ${token.value}` }),
        };
        options.headers = new Headers(headers);
      } else {
        const headers: HeadersInit = {
          Accept: "application/json",
          ...(options?.headers || {}),
        };
        options.headers = new Headers(headers);
      }
    },
    async onRequestError({}) {
      if (!navigator.onLine) {
        messageError("errors.network");
      }
    },
  });
}
