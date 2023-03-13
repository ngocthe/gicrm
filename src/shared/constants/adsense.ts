import {
  CLASSROOM,
  CONSULTATION,
  EVENT,
  MEDIAL_CARE,
  RESTAURANT,
  SALON,
} from "~/../../src/shared/constants/category";
import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;
export const PORTAL = 0;
export const PORTAL_SUBMIT = 66;
export const dataTypeStore = [
  {
    id: PORTAL,
    name: t("portal_site"),
  },
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
