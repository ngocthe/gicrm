import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const REVENUE = {
  ALL: "",
  ONLINE: 1,
  CANCELLATION: 2,
  SUBSCRIPTION: 3,
};

export const REVENUE_MODE = {
  ALL: null,
  DAY: "day",
  WEEk: "week",
  MONTH: "month",
};

export const SALE_STATUS = [
  {
    value: REVENUE.ALL,
    label: t("all"),
  },
  {
    value: REVENUE.SUBSCRIPTION,
    label: t("subscription"),
  },
  {
    value: REVENUE.CANCELLATION,
    label: t("cancellation_fee"),
  },
  {
    value: REVENUE.ONLINE,
    label: t("online_payment"),
  },
];
