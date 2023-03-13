export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const WEBSITE_FORMAT =
  /[-a-zA-Z0-9@:%._\+~#=]{1,63}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const WEBSITE_URL =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&/=]*)/;
export const IMAGE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const IMAGE_TYPE_LINE = ["image/jpeg", "image/png", "image/jpg"];
export const REGEX_COUPON_CODE = /^[a-z0-9_\-]+$/i;
export const FURIGANA = /(^([ァ-ン・ヴ\s]|ー)+)$/;
export const SPECIAL_PASSWORD = /(^([a-zA-Z\d@#$%&?!])+)$/;
export const FORMAT_PASSWORD =
  /(^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&?!])(?=.*[a-zA-Z@#$%&?!]).{6,20}|(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}|(?=.*\d)(?=.*[A-Z])(?=.*[@#$%&?!])(?=.*[A-Z@#$%&?!]).{6,20}|(?=.*\d)(?=.*[a-z])(?=.*[@#$%&?!])(?=.*[a-z@#$%&?!]).{6,20}$)/;
export const FORMAT_NUMBER = /^[0-9]*$/;
export const MAX_LENGTH_EMAIL = 255;
export const MAX_LENGTH_PASSWORD = 20;
export const MIN_LENGTH_PASSWORD = 6;
export const MAX_LENGTH_DEFAULT = 255;
export const MAX_LENGTH_FIRST_NAME = 100;
export const MAX_LENGTH_LAST_NAME = 100;
export const MAX_LENGTH_REASON = 100;
export const MAX_LENGTH_NAME = 200;
export const MAX_LENGTH_STORE_NAME = 100;
export const MAX_LENGTH_EVENT_NAME = 100;
export const MIN_LENGTH_PHONE_NUMBER = 10;
export const MAX_LENGTH_PHONE_NUMBER = 11;
export const MAX_LENGTH_TEXTAREA = 500;
export const MAX_LENGTH_TEXTAREA_MESSAGE_SMS = 600;
export const MAX_LENGTH_TEXTAREA_MESSAGE_MAIL = 5000;
export const MAX_LENGTH_TEXTAREA_MESSAGE_LINE = 5000;
export const MAX_LENGTH_DEFAULT_TEXTAREA = 1000;
export const MAX_LENGTH_DESCRIPTION = 1000;
export const MIN_LENGTH_POSTAL_CODE = 7;
export const MAX_LENGTH_POSTAL_CODE = 7;
export const MAX_LENGTH_CODE_BANNER = 3;
export const MAX_INDEX_CODE_BANNER = 100;
export const MAX_LENGTH_STORE_CODE = 3;
export const MAX_LENGTH_MENU_IMAGE = 1;
export const MAX_LENGTH_COURSE_IMAGE = 1;
export const MAX_SIZE_FILE = 5; // TODO
export const MIN_SIZE_FILE = 0.15; // TODO
export const MAX_NUMBER_OFF_ITEM = 10000; // TODO
export const MAX_DAY_SUBMIT = 8; // TODO
export const MAX_LENGTH_SMS_CODE = 4;
export const MIN_LENGTH_SMS_CODE = 4;
export const MAX_WORK_YEAR = 99;
export const MIN_WORK_YEAR = 0;
export const MAX_FEE = 1000000;
export const MAX_RESERVATION = 1000000000000;
export const MAX_PRICE = 1000000;
export const MAX_LENGTH_TAG = 255;
export const MAX_MINUTE = 59; // TODO
export const MAX_HOUR = 24; // TODO
export const MAX_LENGTH_MENU_NAME = 100;
export const MAX_LENGTH_MENU_DESCRIPTION = 500;
export const MAX_LENGTH_COURSE_NAME = 100;
export const MAX_LENGTH_COURSE_ITEM = 1000;
export const MAX_LENGTH_COURSE_DESCRIPTION = 500;
export const MAX_LENGTH_CATEGORY_NAME = 100;
export const MAX_LENGTH_CATEGORY_DESCRIPTION = 500;
export const MAX_LENGTH_COUPON_CODE = 8;
export const MIN_LENGTH_COUPON_CODE = 8;
export const MAX_LENGTH_NAME_COUPON = 100;
export const MAX_PEOPLE_USE_COUPON = 99999999;
export const MIN_SEAT_EVENT = 1;
export const MAX_SEAT_EVENT = 99999999;
export const MAX_FEE_EVENT = 1000000000;
export const MAX_LENGTH_CONTENT_REVIEW = 1000;
export const MAX_LENGTH_NAME_REVIEW = 255;
export const MAX_LENGTH_SHOW_TEXT = 100; // TODO
export const DEFAULT_LENGTH_MEETING = 45;
export const MAX_LENGTH_PASSWORD_HOT_PEPPER = 40;
export const MAX_LENGTH_PASSWORD_HOT_PEPPER_BEAUTY = 40;
export const MAX_LENGTH_SUMMARY = 5000;
export const MAX_LENGTH_REVIEW_STAFF = 5;
export const MIN_LENGTH_REVIEW_STAFF = 0;
export const MIN_PRICE_COURSE = 1;
export const MIN_PRICE_MENU = 1;

export const MAX_LENGTH_PASSWORD_TABELOG = 40;
export const MAX_LENGTH_PASSWORD_GURUNAVI = 40;
export const MAX_LENGTH_BANNER_ADS = 30;
export const DEFAULT_LENGTH_BANNER = 5;
