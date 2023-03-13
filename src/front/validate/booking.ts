import { reactive } from "vue";
import {
  MAX_LENGTH_REASON,
  MAX_LENGTH_TEXTAREA,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
  REGEX_EMAIL,
  FORMAT_NUMBER,
} from "~/../../src/shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { BOOKING_SOURCE } from "~/../../src/shared/constants/reservation";
import { SALON } from "~/../../src/shared/constants/category";
import { useRoute } from "#imports";

const { t } = i18n.global;
export const validateBooking = () => {
  const route = useRoute();

  const formData = reactive({
    order_time: "",
    number_adult: null,
    number_children: null,
    course_id: null,
    seat_type_id: null,
    order_first_name: "",
    order_last_name: "",
    order_email: "",
    order_phone_number: "",
    order_memo: "",
    cancel_policy: "",
    note: "",
    payment_type: null,
    dateSelect: "",
    timeSelect: "",
    source: BOOKING_SOURCE.WEB,
    staff_id: null,
    coupon_code: "",
    remind: null,
  });

  const rules = reactive({
    number_adult: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("adult"),
        }),
        trigger: ["blur", "change"],
      },
    ],
    remind: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("remind"),
        }),
        trigger: "change",
      },
    ],
    number_children: [
      {
        pattern: FORMAT_NUMBER,
        message: t("validate.format.field", { field: t("child") }),
        trigger: "blur",
      },
    ],
    course_id: [
      {
        required: +route.query?.type_store !== SALON,
        message: t("validate.required.field", { field: t("course") }),
        trigger: "change",
      },
    ],
    order_first_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("full_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("full_name_kanji") }),
      },
    ],
    order_last_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("full_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("full_name_kanji") }),
      },
    ],
    order_email: [
      {
        required: true,
        message: t("validate.required.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EMAIL,
        message: t("validate.max.field", {
          field: t("email_address"),
          max: MAX_LENGTH_EMAIL,
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_EMAIL,
        message: t("validate.format.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("email_address") }),
      },
    ],
    order_phone_number: [
      {
        required: true,
        message: t("validate.required.field", { field: t("phone_number") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PHONE_NUMBER,
        message: t("validate.max.phone_number", {
          max: MAX_LENGTH_PHONE_NUMBER,
          min: MIN_LENGTH_PHONE_NUMBER,
          field: t("phone_number"),
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PHONE_NUMBER,
        message: t("validate.min.phone_number", {
          max: MAX_LENGTH_PHONE_NUMBER,
          min: MIN_LENGTH_PHONE_NUMBER,
          field: t("phone_number"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("phone_number") }),
      },
    ],
    payment_type: [
      {
        required: true,
        message: t("validate.required.field", { field: t("payment_method") }),
        trigger: "change",
      },
    ],
  });
  return {
    rules,
    formData,
  };
};

export const validateCancelBooking = {
  reason: [
    {
      required: true,
      message: t("validate.required.field", { field: t("front.cause") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_REASON,
      message: t("validate.max.field", {
        max: MAX_LENGTH_REASON,
        field: t("front.cause"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("front.cause") }),
    },
  ],
  memo: [
    {
      max: MAX_LENGTH_TEXTAREA,
      message: t("validate.max.field", {
        max: MAX_LENGTH_TEXTAREA,
        field: t("memo"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("memo") }),
    },
  ],
};
