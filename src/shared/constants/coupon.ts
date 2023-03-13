import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const STATUS_COUPON = {
  ENABLE: 1,
  INVALID: 0,
};

export const STATUS_COUPON_DATA = [
  {
    label: t("enable"),
    value: STATUS_COUPON.ENABLE,
  },
  {
    label: t("disable"),
    value: STATUS_COUPON.INVALID,
  },
];
