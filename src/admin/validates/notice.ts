import { i18n } from "../../shared/plugins/i18n";

const { t } = i18n.global;

const noticeRules = {
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
  body: [
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
  start_date: [
    {
      required: true,
      message: t("validate.required.field", { field: t("start_date") }),
      trigger: "blur",
    },
  ],
  due_date: [
    {
      required: true,
      message: t("validate.required.field", { field: t("end_date") }),
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: t("validate.required.field", { field: t("status") }),
      trigger: "blur",
    },
  ],
};

export default noticeRules;
