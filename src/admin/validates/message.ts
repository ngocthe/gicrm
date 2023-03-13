import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

const messageRules = {
  title: [
    {
      required: true,
      message: t("validate.required.field", { field: t("title_keyword") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("title_keyword") }),
    },
  ],
  content: [
    {
      required: true,
      message: t("validate.required.field", { field: t("content") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("content") }),
    },
  ],
  type: [
    {
      required: true,
      message: t("validate.required.field", { field: t("type") }),
      trigger: "blur",
    },
  ],
};

export default messageRules;
