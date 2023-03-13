import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;
export const BOOKING_SOURCE_LINE = 1;

export const BOOKING_SOURCE_GOOGLE = 2;

export const BOOKING_SOURCE_HOTPEPPER = 3;
export const BOOKING_SOURCE_HOTPEPPER_BEAUTY = 7;

export const BOOKING_SOURCE_GURUNAVI = 4;

export const BOOKING_SOURCE_EATING = 5;

export const BOOKING_SOURCE_WEB = 6;

export const BOOKING_MIN_PRICE_CONTACTLESS = 1;

export const REMIND_EMAIL = 1;
export const REMIND_PHONE = 2;
export const REMIND_LINE = 3;
export const dataRemind = [
  {
    id: REMIND_EMAIL,
    label: t("email_address"),
  },
  {
    id: REMIND_PHONE,
    label: t("admin.messages.sms"),
  },
  {
    id: REMIND_LINE,
    label: t("line"),
  },
];
