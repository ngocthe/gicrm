import { i18n } from "~/../../src/shared/plugins/i18n";
import { STATUS } from "~/../../src/shared/constants/seen";

const { t } = i18n.global;

export const STATUS_TYPE = {
  DISABLE: 0,
  ENABLE: 1,
};

export const IS_REPLY_REVIEW = 2;

export const statusReviewOption = [
  {
    value: STATUS.NOT_SEEN,
    label: t("not_seen"),
  },
  {
    value: STATUS.IS_SEEN,
    label: t("no_reply"),
  },
  {
    value: IS_REPLY_REVIEW,
    label: t("reply_review"),
  },
];

export const typeStatusOptions = [
  {
    value: STATUS_TYPE.DISABLE,
    label: t("disable"),
  },
  {
    value: STATUS_TYPE.ENABLE,
    label: t("enable"),
  },
];

export const displayOptions = [
  {
    value: STATUS_TYPE.DISABLE,
    label: t("display"),
  },
  {
    value: STATUS_TYPE.ENABLE,
    label: t("no_displayed"),
  },
];

export const STATUS_STORE = {
  STORE_STATUS_PENDING: 0,
  STORE_STATUS_APPROVE: 1,
  STORE_STATUS_SETTING: 2,
  STORE_STATUS_SETTING_DONE: 3,
  STORE_STATUS_REJECT: 4,
};

export const StatusStoreOptions = [
  {
    value: STATUS_STORE.STORE_STATUS_PENDING,
    label: t("pending"),
  },
  {
    value: STATUS_STORE.STORE_STATUS_APPROVE,
    label: t("approved"),
  },
  {
    value: STATUS_STORE.STORE_STATUS_SETTING,
    label: t("setting"),
  },
  {
    value: STATUS_STORE.STORE_STATUS_SETTING_DONE,
    label: t("setting_done"),
  },
  {
    value: STATUS_STORE.STORE_STATUS_REJECT,
    label: t("reject"),
  },
];

export const STATUS_PLACE = {
  PLACE_EMPTY: 1,
  NOT_PLACE_EMPTY: 2,
  NOT_RECEIVE_BOOKING: 3,
  HOLIDAY: 4,
};
