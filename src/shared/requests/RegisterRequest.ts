import oFetchApi from "~/../../src/shared/composables/ofetchApi";

export const getAddress = async (code: string) => {
  return oFetchApi("/common/postal?postal_code=" + code, {
    method: "GET",
  });
};

export const verifySms = async (data: object, id: number) => {
  return await oFetchApi(`/verifications/email-otp/${id}`, {
    method: "POST",
    body: data,
  });
};

export const resendVerify = async (data: object, id: number) => {
  return await oFetchApi(`/verifications/re-send/${id}`, {
    method: "POST",
    body: data,
  });
};
