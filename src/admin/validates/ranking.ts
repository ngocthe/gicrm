import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const rankingRules = {
  daily_booking: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("tentative_reservations"),
      }),
      trigger: "blur",
    },
  ],
  daily_access: [
    {
      required: true,
      message: t("validate.required.field", { field: t("access_count") }),
      trigger: "blur",
    },
  ],

  weekly_booking: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("tentative_reservations"),
      }),
      trigger: "blur",
    },
  ],
  weekly_access: [
    {
      required: true,
      message: t("validate.required.field", { field: t("access_count") }),
      trigger: "blur",
    },
  ],

  monthly_booking: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("tentative_reservations"),
      }),
      trigger: "blur",
    },
  ],
  monthly_access: [
    {
      required: true,
      message: t("validate.required.field", { field: t("access_count") }),
      trigger: "blur",
    },
  ],
};

export default rankingRules;
