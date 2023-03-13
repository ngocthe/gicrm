import { i18n } from "../plugins/i18n";
const { t } = i18n.global;

export const SALON = 1;
export const RESTAURANT = 2;
export const MEDIAL_CARE = 3;
export const CLASSROOM = 4;
export const CONSULTATION = 5;
export const EVENT = 6;
export const TYPE_PORTAL = 66;

export default {
  SALON: 1,
  RESTAURANT: 2,
  MEDIAL_CARE: 3,
  CLASSROOM: 4,
  CONSULTATION: 5,
  EVENT: 6,
  COOKING_ID: 1,
  DRINK_ID: 2,
  LUNCH_ID: 3,
  OPTION_FILTER_CATEGORY: {
    1: [],
    2: [
      {
        id: 1,
        name: t("cooking"),
      },
      {
        id: 2,
        name: t("drink"),
      },
      {
        id: 3,
        name: t("lunch"),
      },
    ],
  },
  DATA_PARENT_CATEGORY: {
    1: t("cooking"),
    2: t("drink"),
    3: t("lunch"),
  },
};

export const dataTypeStore = [
  {
    id: SALON,
    name: t("beauty_salon"),
  },
  {
    id: RESTAURANT,
    name: t("restaurant"),
  },
  {
    id: MEDIAL_CARE,
    name: t("medial_care"),
  },
  {
    id: CLASSROOM,
    name: t("classroom"),
  },
  {
    id: CONSULTATION,
    name: t("consultation"),
  },
  {
    id: EVENT,
    name: t("event"),
  },
];
