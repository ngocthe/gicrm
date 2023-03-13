import { addressNotFound } from "~/../../src/shared/utils/notification";
import postalCodeRequest from "~/../../src/shared/requests/PostalCodeRequest";
import { PostalCode } from "~/../../src/shared/models";
import { MAX_LENGTH_POSTAL_CODE } from "~/../../src/shared/utils/validate";

export const searchAddressHelper = async (postal_code) => {
  try {
    if (postal_code && postal_code.length < MAX_LENGTH_POSTAL_CODE) {
      return { address: "", address_detail: "" };
    }

    const resAddress = (
      await postalCodeRequest.getAddress<PostalCode>({
        postal_code: postal_code,
      })
    ).data;
    if (!resAddress) {
      addressNotFound();
      return { address: "", address_detail: "" };
    }
    const address = `${resAddress?.pref || ""} ${
      resAddress?.city || ""
    }`.trim();
    const address_detail = resAddress?.town || "";
    return { address, address_detail };
  } catch (e) {
    addressNotFound();
    return { address: "", address_detail: "" };
  }
};

export const fullAddress = (address = "", addressDetail = "") => {
  const value = `${address || ""}` + " " + `${addressDetail || ""}`;
  return value.trim();
};
