import { WEBSITE_FORMAT } from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

const gurunaviRules = {
  url: [
    {
      pattern: WEBSITE_FORMAT,
      message: t("validate.format.field", { field: t("store.login_link") }),
      trigger: "blur",
    },
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.login_link"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("store.login_link") }),
    },
  ],
  account: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.user_id"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("store.user_id"),
      }),
    },
  ],
  password: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("password"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("password") }),
    },
  ],
};

export default gurunaviRules;
