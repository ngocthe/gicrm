import { reactive } from "vue";
import { i18n } from "../../shared/plugins/i18n";
import {
  RESERVATION_TYPE,
  STATUS_TYPE,
} from "~/../../src/shared/constants/reservation";
import {
  MAX_LENGTH_EVENT_NAME,
  WEBSITE_URL,
} from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

const eventRules = () => {
  const formEvent = reactive({
    name: null,
    description: null,
    image_id: null,
    number_seats: null,
    price: 0,
    start_date: null,
    end_date: null,
    opening_time: "08:00",
    closing_time: "17:00",
    reservation_type: RESERVATION_TYPE.TENTATIVE,
    place: null,
    online_link: null,
    published: STATUS_TYPE.PUBLIC,
  });
  const formRuleEvent = reactive({
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("event"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EVENT_NAME,
        message: t("validate.format.field", {
          max: MAX_LENGTH_EVENT_NAME,
          field: t("event"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("event"),
        }),
      },
    ],
    price: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("booking.fee"),
        }),
        trigger: "blur",
      },
    ],
    online_link: [
      {
        pattern: WEBSITE_URL,
        message: t("validate.format.field", { field: t("online_link") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("online_link"),
        }),
      },
    ],
  });

  return {
    formEvent,
    formRuleEvent,
  };
};

export default eventRules;
