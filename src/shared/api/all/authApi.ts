import oFetchApi from "../../composables/ofetchApi";

export const forgotPasswordStoreApi = async (data: object) => {
  return oFetchApi("/auth/store-forgot-password", {
    method: "POST",
    body: data,
  });
};

export const forgotPasswordApi = async (data: object) => {
  return oFetchApi("/auth/forgot-password", {
    method: "POST",
    body: data,
  });
};

export const resetPasswordApi = (data: object) => {
  return oFetchApi("/auth/reset-password", {
    method: "POST",
    body: data,
  });
};

export const changePasswordApi = (data: object) => {
  return oFetchApi("/me/password", {
    method: "PUT",
    body: data,
  });
};

export const loginApi = (data: object) => {
  return oFetchApi("/auth/login", {
    method: "POST",
    body: data,
  });
};

export const getMe = <T>(): Promise<T> => {
  // @ts-ignore
  return oFetchApi<T>("/me", {
    method: "GET",
  });
};

export const registerMember = async (data: object) => {
  return await oFetchApi("/auth/register", {
    method: "POST",
    body: data,
  });
};
