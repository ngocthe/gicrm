import { i18n } from "../../shared/plugins/i18n";
import { WEBSITE_URL } from "~/../../src/shared/utils/validate";
const { t } = i18n.global;

const bannerAdsRules = {
  store_type: [
    {
      required: true,
      message: t("validate.required.field", { field: t("industry") }),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("banner_name") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("banner_name") }),
    },
  ],
  position: [
    {
      required: true,
      message: t("validate.required.field", { field: t("display_position") }),
      trigger: "blur",
    },
  ],
  start_time: [
    {
      required: true,
      message: t("validate.required.field", { field: t("display_period") }),
      trigger: "blur",
    },
  ],
  end_time: [
    {
      required: true,
      message: t("validate.required.field", { field: t("display_period") }),
      trigger: "blur",
    },
  ],
  image_id: [
    {
      required: true,
      message: t("validate.required.field", { field: t("file_selection") }),
      trigger: "blur",
    },
  ],
  index: [
    {
      required: true,
      message: t("validate.required.field", { field: t("display_order") }),
      trigger: "blur",
    },
  ],
  url: [
    {
      pattern: WEBSITE_URL,
      message: t("validate.format.field", { field: "URL" }),
      trigger: "blur",
    },
  ],
};

export default bannerAdsRules;
