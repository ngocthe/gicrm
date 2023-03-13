import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const dataRate = [
  {
    value: 5,
    label: t("five"),
  },
  {
    value: 4,
    label: t("four"),
  },
  {
    value: 3,
    label: t("three"),
  },
  {
    value: 2,
    label: t("two"),
  },
  {
    value: 1,
    label: t("one"),
  },
];

export const textNoData = t("no_data");
export const textNoResult = t("no_result");
