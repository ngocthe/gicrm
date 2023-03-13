// import { persistKeys } from "./../constants/persist-key";
// import { useCookie, useFetch, useRouter, useRuntimeConfig } from "nuxt/app";
// import { FetchOptions } from "ohmyfetch";
// import { messageError } from "~/../../src/shared/utils/notification";
// import { ref, watch } from "vue";
// import STATUS_CODE from "../constants/statusCodeResponse";
// import { useMeStore } from "~/../../src/shared/stores/me";
//
// import {
//   IResponseData,
//   IResponseError,
//   ServerValidation,
// } from "./../requests/types";
//
// export default async function useFetchApi<T>(
//   url: string,
//   options?: FetchOptions,
//   key?: boolean
// ) {
//   const config = useRuntimeConfig();
//   const router = useRouter();
//   const token = useCookie(persistKeys.ACCESS_TOKEN);
//   const errors = ref<ServerValidation>({});
//
//   const { data, error, refresh, execute } = await useFetch<
//     IResponseData<T>,
//     IResponseError
//   >(url, {
//     baseURL: config.public.apiUrl,
//     ...options,
//     immediate: false,
//     retry: 1,
//     key: key ? url : undefined,
//     async onResponse({ response }) {
//       return response._data;
//     },
//     async onResponseError({ response }) {
//       if (response.status === STATUS_CODE.AUTHENTICATION) {
//         const ignoreUrl = [
//           "/reset-password",
//           "/forgot-password",
//           "/store-forgot-password",
//         ];
//         const arr: boolean[] = ignoreUrl.map((item) =>
//           response.url.includes(item)
//         );
//         if (!arr.includes(true)) {
//           const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
//           cookieToken.value = null;
//           useMeStore().$reset();
//           await router.push("/login");
//         }
//       }
//
//       if (response.status === STATUS_CODE.AUTHORIZATION) {
//         await router.push("/403");
//       }
//
//       if (response.status === STATUS_CODE.SERVER_ERROR) {
//         // eslint-disable-next-line
//         // @ts-ignore
//         messageError("errors.internal_serve");
//       }
//     },
//     async onRequest({ options }) {
//       if (token.value) {
//         const headers: HeadersInit = {
//           Accept: "application/json",
//           ...(options?.headers || {}),
//           ...(token && { Authorization: `Bearer ${token.value}` }),
//         };
//         options.headers = new Headers(headers);
//       } else {
//         const headers: HeadersInit = {
//           Accept: "application/json",
//           ...(options?.headers || {}),
//         };
//         options.headers = new Headers(headers);
//       }
//     },
//     async onRequestError({ error }) {
//       if (!navigator.onLine) {
//         messageError("errors.network");
//       }
//     },
//   });
//
//   watch(error, () => {
//     // @ts-ignore
//     if (error.value?.data?.errors) {
//       // @ts-ignore
//       for (const key in error.value.data.errors) {
//         // @ts-ignore
//         errors.value[key] = error.value.data.errors[key].join(", ");
//       }
//     }
//   });
//
//   return {
//     data,
//     error,
//     errors, // ServerValidation
//     refresh,
//     execute,
//   };
// }
