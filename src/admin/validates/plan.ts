import { i18n } from "../../shared/plugins/i18n";
import { reactive } from "vue";
import { NOT_UNLIMITED } from "~/../../src/shared/constants/plan";
import { validateRequiredFeeAmount } from "~/../../src/shared/validate/common";

const { t } = i18n.global;

const formPlanRules = () => {
  const formData = reactive({
    name: null,
    initial_cost: 0,
    duration: 0,
    monthly_cost_annual: 0,
    year_time_payment: 0,
    monthly_cost: 0,
    card_payment_fee: 0,
    card_payment_service_fee: 0,
    monthly_booking: null,
    number_staff: 0,
    number_store_top_photo: 0,
    number_photo: 0,
    number_customer: 0,
    number_registered_customers: 0,
    job_offer: 0,
    advertisement: 0,
    support_plans: [],
    support: [],
    zoom_fee: 0,
    line_fee: 0,
    external_site_monthly_fee: 0,
    submission_agency_monthly_fee: 0,
    sms_under_100: 0,
    sms_under_300: 0,
    sms_under_500: 0,
    sms_under_1000: 0,
    sms_above_1000: 0,
    custom_billing_monthly_fee: 0,
    initial_support_monthly_fee: 0,
    customer_attraction_fee: 0,
    fee_restaurant_empty_booking: 0,
    fee_restaurant_store_booking: 0,
    fee_restaurant_range_1_amount: 0,
    fee_restaurant_range_1_fee: 0,
    fee_restaurant_range_2_amount: 0,
    fee_restaurant_range_2_fee: 0,
    fee_restaurant_range_3_amount: 0,
    fee_restaurant_range_3_fee: 0,
    fee_restaurant_range_4_amount: 0,
    fee_restaurant_range_4_fee: 0,
    fee_restaurant_range_5_amount: 0,
    fee_restaurant_range_5_fee: 0,
    fee_salon_empty_booking: 0,
    fee_salon_store_booking: 0,
    fee_salon_range_1_fee: 0,
    fee_salon_range_1_amount: 0,
    fee_salon_range_2_fee: 0,
    fee_salon_range_2_amount: 0,
    fee_salon_range_3_fee: 0,
    fee_salon_range_3_amount: 0,
    fee_salon_range_4_fee: 0,
    fee_salon_range_4_amount: 0,
    fee_salon_range_5_fee: 0,
    fee_salon_range_5_amount: 0,
    fee_medical_empty_booking: 0,
    fee_medical_store_booking: 0,
    fee_medical_range_1_amount: 0,
    fee_medical_range_1_fee: 0,
    fee_medical_range_2_amount: 0,
    fee_medical_range_2_fee: 0,
    fee_medical_range_3_amount: 0,
    fee_medical_range_3_fee: 0,
    fee_medical_range_4_amount: 0,
    fee_medical_range_4_fee: 0,
    fee_medical_range_5_amount: 0,
    fee_medical_range_5_fee: 0,
    fee_school_empty_booking: 0,
    fee_school_store_booking: 0,
    fee_school_range_1_fee: 0,
    fee_school_range_1_amount: 0,
    fee_school_range_2_fee: 0,
    fee_school_range_2_amount: 0,
    fee_school_range_3_fee: 0,
    fee_school_range_3_amount: 0,
    fee_school_range_4_fee: 0,
    fee_school_range_4_amount: 0,
    fee_school_range_5_fee: 0,
    fee_school_range_5_amount: 0,
    fee_consultation_empty_booking: 0,
    fee_consultation_store_booking: 0,
    fee_consultation_range_1_amount: 0,
    fee_consultation_range_1_fee: 0,
    fee_consultation_range_2_amount: 0,
    fee_consultation_range_2_fee: 0,
    fee_consultation_range_3_amount: 0,
    fee_consultation_range_3_fee: 0,
    fee_consultation_range_4_amount: 0,
    fee_consultation_range_4_fee: 0,
    fee_consultation_range_5_amount: 0,
    fee_consultation_range_5_fee: 0,
    fee_events_empty_booking: 0,
    fee_events_store_booking: 0,
    fee_events_range_1_fee: 0,
    fee_events_range_1_amount: 0,
    fee_events_range_2_fee: 0,
    fee_events_range_2_amount: 0,
    fee_events_range_3_fee: 0,
    fee_events_range_3_amount: 0,
    fee_events_range_4_fee: 0,
    fee_events_range_4_amount: 0,
    fee_events_range_5_fee: 0,
    fee_events_range_5_amount: 0,
    price_plan_unlimited: NOT_UNLIMITED,
  });

  const planRules = {
    fee_salon_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    fee_salon_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_restaurant_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_restaurant_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    fee_medical_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_medical_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    fee_school_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_school_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    fee_consultation_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_consultation_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    fee_events_empty_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reserved_seats_only"),
        }),
        trigger: "blur",
      },
    ],
    fee_events_store_booking: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.reservation_store_reception"),
        }),
        trigger: "blur",
      },
    ],
    duration: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.contract_period"),
        }),
        trigger: "blur",
      },
    ],
    initial_cost: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.initial_cost"),
        }),
        trigger: "blur",
      },
    ],
    year_time_payment: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.year_time_payment"),
        }),
        trigger: "blur",
      },
    ],
    card_payment_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.credit_card"),
        }),
        trigger: "blur",
      },
    ],
    number_staff: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.number_registered_staff_members"),
        }),
        trigger: "blur",
      },
    ],
    number_store_top_photo: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.number_photos_register_store"),
        }),
        trigger: "blur",
      },
    ],
    number_photo: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.photo_gallery"),
        }),
        trigger: "blur",
      },
    ],
    job_offer: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.job_offer"),
        }),
        trigger: "blur",
      },
    ],
    advertisement: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.advertisement"),
        }),
        trigger: "blur",
      },
    ],
    support_plans: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.support"),
        }),
        trigger: "blur",
      },
    ],
    monthly_cost_annual: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.annual_payment"),
        }),
        trigger: "blur",
      },
    ],
    monthly_cost: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.monthly_payment"),
        }),
        trigger: "blur",
      },
    ],
    number_customer: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.number_registered_customers"),
        }),
        trigger: "blur",
      },
    ],
    zoom_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.zoom_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    line_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.line_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    external_site_monthly_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.external_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    initial_support_monthly_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.initial_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    customer_attraction_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.customer_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    submission_agency_monthly_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.submission_monthly_fee"),
        }),
        trigger: "blur",
      },
    ],
    sms_under_100: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("SMS_under_100"),
        }),
        trigger: "blur",
      },
    ],
    sms_under_300: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("SMS_under_300"),
        }),
        trigger: "blur",
      },
    ],
    sms_under_500: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("SMS_under_500"),
        }),
        trigger: "blur",
      },
    ],
    sms_under_1000: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("SMS_under_1000"),
        }),
        trigger: "blur",
      },
    ],
    sms_above_1000: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("SMS_above_1000"),
        }),
        trigger: "blur",
      },
    ],
    custom_billing_monthly_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("admin.plans.custom_billing_monthly"),
        }),
        trigger: "blur",
      },
    ],
    fee_restaurant_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_restaurant_range_1_fee"
        ),
      },
    ],
    fee_restaurant_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_restaurant_range_2_fee"
        ),
      },
    ],
    fee_restaurant_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_restaurant_range_3_fee"
        ),
      },
    ],
    fee_restaurant_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_restaurant_range_4_fee"
        ),
      },
    ],
    fee_restaurant_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_restaurant_range_5_fee"
        ),
      },
    ],
    fee_salon_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(formData, "fee_salon_range_1_fee"),
      },
    ],
    fee_salon_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(formData, "fee_salon_range_2_fee"),
      },
    ],
    fee_salon_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(formData, "fee_salon_range_3_fee"),
      },
    ],
    fee_salon_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(formData, "fee_salon_range_4_fee"),
      },
    ],
    fee_salon_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(formData, "fee_salon_range_5_fee"),
      },
    ],
    fee_medical_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_medical_range_1_fee"
        ),
      },
    ],
    fee_medical_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_medical_range_2_fee"
        ),
      },
    ],
    fee_medical_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_medical_range_3_fee"
        ),
      },
    ],
    fee_medical_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_medical_range_4_fee"
        ),
      },
    ],
    fee_medical_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_medical_range_5_fee"
        ),
      },
    ],
    fee_school_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_school_range_1_fee"
        ),
      },
    ],
    fee_school_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_school_range_2_fee"
        ),
      },
    ],
    fee_school_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_school_range_3_fee"
        ),
      },
    ],
    fee_school_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_school_range_4_fee"
        ),
      },
    ],
    fee_school_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_school_range_5_fee"
        ),
      },
    ],
    fee_consultation_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_consultation_range_1_fee"
        ),
      },
    ],
    fee_consultation_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_consultation_range_2_fee"
        ),
      },
    ],
    fee_consultation_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_consultation_range_3_fee"
        ),
      },
    ],
    fee_consultation_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_consultation_range_4_fee"
        ),
      },
    ],
    fee_consultation_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_consultation_range_5_fee"
        ),
      },
    ],
    fee_events_range_1_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_events_range_1_fee"
        ),
      },
    ],
    fee_events_range_2_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_events_range_2_fee"
        ),
      },
    ],
    fee_events_range_3_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_events_range_3_fee"
        ),
      },
    ],
    fee_events_range_4_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_events_range_4_fee"
        ),
      },
    ],
    fee_events_range_5_fee: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("total_per_person"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateRequiredFeeAmount(
          formData,
          "fee_events_range_5_fee"
        ),
      },
    ],
  };

  return {
    formData,
    planRules,
  };
};

export default formPlanRules;
