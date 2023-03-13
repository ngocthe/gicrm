import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const STATUS_RECRUITMENT = {
  ENABLE: 1,
  INVALID: 0,
};

export const STATUS_RECRUITMENT_DATA = [
  {
    label: t("enable"),
    value: STATUS_RECRUITMENT.ENABLE,
  },
  {
    label: t("disable"),
    value: STATUS_RECRUITMENT.INVALID,
  },
];
