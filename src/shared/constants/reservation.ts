import { i18n } from "../plugins/i18n";

const { t } = i18n.global;

export const ADULT_MAX = 999_999_999;
export const CHILD_MAX = 999_999_999;

export const RESERVATION_STATUS = {
  COMPLETED: 1,
  WAITING: 2,
  CANCEL: 3,
  VISITED: 4,
};

export const reservationStatusOptions = [
  {
    label: "booking.waiting",
    value: RESERVATION_STATUS.WAITING,
  },
  {
    label: "booking.fixed",
    value: RESERVATION_STATUS.COMPLETED,
  },
  {
    label: "booking.cancel",
    value: RESERVATION_STATUS.CANCEL,
  },
  {
    label: "booking.visited",
    value: RESERVATION_STATUS.VISITED,
  },
];

export const RESERVATION_TYPE = {
  INSTANT: 1,
  TENTATIVE: 2,
};

export const reservationTypeOptions = [
  {
    label: t("tentative_reservation"),
    value: RESERVATION_TYPE.TENTATIVE,
  },
  {
    label: t("instant_reservation"),
    value: RESERVATION_TYPE.INSTANT,
  },
];

export const DATA_RESERVATION_TYPE = {
  1: t("instant_reservation"),
  2: t("tentative_reservation"),
};

export const STATUS_TYPE = {
  PUBLIC: 1,
  PRIVATE: 0,
};

export const DATA_STATUS_TYPE = [
  {
    id: STATUS_TYPE.PUBLIC,
    name: t("publish"),
  },
  {
    id: STATUS_TYPE.PRIVATE,
    name: t("private"),
  },
];

export const DATA_DAY = [
  {
    id: 0,
    name: t("sunday"),
  },
  {
    id: 1,
    name: t("monday"),
  },
  {
    id: 2,
    name: t("tuesday"),
  },
  {
    id: 3,
    name: t("wednesday"),
  },
  {
    id: 4,
    name: t("thursday"),
  },
  {
    id: 5,
    name: t("friday"),
  },
  {
    id: 6,
    name: t("saturday"),
  },
  {
    id: 7,
    name: t("holiday"),
  },
];

export const DATA_DAY_FILTER = {
  0: t("sunday"),
  1: t("monday"),
  2: t("tuesday"),
  3: t("wednesday"),
  4: t("thursday"),
  5: t("friday"),
  6: t("saturday"),
  7: t("holiday"),
};

export const DAYS_PICKER = [
  t("monday"),
  t("tuesday"),
  t("wednesday"),
  t("thursday"),
  t("friday"),
  t("saturday"),
  t("sunday"),
];

export const DATA_DAY_WORKING = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const WORKING_DAYS = [
  {
    label: `${t("monday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.MONDAY,
  },
  {
    label: `${t("tuesday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.TUESDAY,
  },
  {
    label: `${t("wednesday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.WEDNESDAY,
  },
  {
    label: `${t("thursday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.THURSDAY,
  },
  {
    label: `${t("friday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.FRIDAY,
  },
  {
    label: `${t("saturday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.SATURDAY,
  },
  {
    label: `${t("sunday")}${t("day_of_week")}`,
    value: DATA_DAY_WORKING.SUNDAY,
  },
];

export const ACCEPTED_CHILDREN = {
  HAVE: 1,
  NONE: 2,
};

export const COURSE_TYPE = {
  ONLY_SEAT: 1,
  GENERALLY: 2,
};

export const DATA_COURSE_TYPE = [
  {
    id: COURSE_TYPE.ONLY_SEAT,
    label: t("course_only_seat"),
  },
  {
    id: COURSE_TYPE.GENERALLY,
    label: t("course_generally"),
  },
];

export const DATA_ACCEPTED_CHILDREN = [
  {
    id: ACCEPTED_CHILDREN.HAVE,
    name: t("have"),
  },
  {
    id: ACCEPTED_CHILDREN.NONE,
    name: t("no"),
  },
];

export const BOOKING_CANCEL_BY_STORE = 1;
export const BOOKING_CANCEL_BY_USER = 2;
export const BOOKING_CANCEL_BY_USER_REQUEST_STORE = 3;

export const BOOKING_CREATE_BY_STORE = 1;
export const BOOKING_CREATE_BY_USER = 2;

export const DATA_CANCEL_FILTER = {
  [BOOKING_CANCEL_BY_USER_REQUEST_STORE]: t("user_request_store_cancel"),
  [BOOKING_CANCEL_BY_STORE]: t("store_cancel"),
  [BOOKING_CANCEL_BY_USER]: t("user_cancel"),
};

export const DATA_USER_BOOKING_FILTER = {
  [BOOKING_CREATE_BY_STORE]: t("store_cancel"),
  [BOOKING_CREATE_BY_USER]: t("user_cancel"),
};

export const BOOKING_SOURCE = {
  LINE: 1,
  GOOGLE: 2,
  HOTPEPPER: 3,
  GURUNAVI: 4,
  EATING: 5,
  WEB: 6,
};
