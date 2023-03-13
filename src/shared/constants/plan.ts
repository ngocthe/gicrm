import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const PLAN_NAME = {
  FREE: 1,
  LITE: 2,
  BASIC: 3,
  STANDARD: 4,
  PREMIUM: 5,
  ADVANCED: 6,
};
export const MAX_VALUE_PLANS = 1_000_000_000;
export const UNLIMITED = null;
export const NOT_UNLIMITED = 1;
export const MAX_NUMBER_STAFF = 1000;
export const MAX_NUMBER_STORE = 10;
export const MAX_NUMBER_PHOTO = 2000;
export const MAX_NUMBER_CUSTOMER = 40000;

export const SUPPORT_PLANS = {
  NONE: 1,
  CHAT: 2,
  EMAIL: 3,
  CHAT_EMAIL: 4,
};

export const planNameData = [
  {
    value: PLAN_NAME.FREE,
    label: "plans_free",
  },
  {
    value: PLAN_NAME.LITE,
    label: "plans_lite",
  },
  {
    value: PLAN_NAME.BASIC,
    label: "plans_basic",
  },
  {
    value: PLAN_NAME.STANDARD,
    label: "plans_standard",
  },
  {
    value: PLAN_NAME.PREMIUM,
    label: "plans_premium",
  },
  {
    value: PLAN_NAME.ADVANCED,
    label: "plans_advanced",
  },
];

export const optionPlan = {
  //TODO
  YEARLY: 1,
  MONTHLY: 2,
};

export const durationOptions = [
  {
    value: 3,
    label: "3",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 12,
    label: "12",
  },
];

export const maxImagePlanType = {
  STORE: 1,
  GALLERY: 2,
};

export const HAVE_JOB_OFFER = 1;
export const NOT_JOB_OFFER = 0;
