import { FURIGANA } from "~/../../src/shared/utils/validate";

export const formatInput = (text: string) => {
  const cipherChars = [...text];
  for (let i = 0; i < cipherChars.length - 2; i++) {
    cipherChars[i] = "*";
  }
  text = cipherChars.join("");
  return text;
};

export const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(?!\..*)(\d)(?=(?:\d{4})+(?:\.|$))/g, "$1 ");
};

export const formatDateYearCard = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(?!\..*)(\d)(?=(?:\d{2})+(?:\.|$))/g, "$1/");
};

export const formatInputNumber = (value: string) => {
  return value.replace(/\D/g, "").replace(/(?!\..*)(\d)/g, "$1");
};

export const customTrimValue = (obj: object) => {
  for (const [k, v] of Object.entries(obj)) {
    if (Object(v) === v) customTrimValue(v);
    else if (typeof v === "string") obj[k] = v.trim();
  }
  return obj;
};

export const formatInputKatakana = (event, prop, _formRef) => {
  const regex = new RegExp(FURIGANA);
  if (regex.test(event.trim())) {
    _formRef.clearValidate(prop);
  }
};
