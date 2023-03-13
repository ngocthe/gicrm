import { i18n } from "../../shared/plugins/i18n";
import { UnwrapNestedRefs } from "vue";
import { ACCEPTED_CHILDREN } from "~/../../src/shared/constants/reservation";
import {
  MIN_PRICE_COURSE,
  MIN_PRICE_MENU,
} from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

export const validateConfirmPassword = (
  formData: { [key: string]: string },
  mess = t("errors.password")
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (value !== formData.password) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validateConfirmStartEndTime = (
  formData,
  mess = t("validate.required.field", {
    field: t("store.reception_time"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (!formData.start_time || !formData.end_time) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validateConfirmPrice = (
  formData,
  mess = t("validate.required.field", {
    field: t("unit_price"),
  }),
  messMin = t("validate.min.field", {
    min: MIN_PRICE_MENU,
    field: t("unit_price"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (!formData.price_status && !formData.price && formData.price !== 0) {
      callback(new Error(mess));
    } else if (
      !formData.price_status &&
      Number(formData.price) < MIN_PRICE_MENU
    ) {
      callback(new Error(messMin));
    }
    callback();
  };
};

export const validateConfirmEmail = (
  formData: UnwrapNestedRefs<{
    email: string;
  }>,
  mess = t("errors.email_confirm")
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (value !== formData.email) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validateDateBooking = (
  formData,
  mess = t("errors.select_date")
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (!formData.date_booking && (formData.min_time || formData.max_time)) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validatePriceChildrenCourse = (
  formData,
  mess = t("validate.required.field", {
    field: t("price_children"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (
      formData.accepted_children === ACCEPTED_CHILDREN.HAVE &&
      formData.price_children !== 0 &&
      !formData.price_children
    ) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validatePriceCourse = (
  formData,
  mess = t("validate.min.field", {
    min: MIN_PRICE_COURSE,
    field: t("unit_price"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (!formData.price || Number(formData.price) < MIN_PRICE_COURSE) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validateQuantityCoupon = (
  formData,
  mess = t("validate.required.field", { field: t("total_number") })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback) => {
    if (!formData.infinite_quantity && !formData.quantity) {
      callback(new Error(mess));
    }
    callback();
  };
};

export const validateQuantityCouponCustomer = (
  formData: any,
  mess = t("validate.required.field", {
    field: t("errors.enough_usage_per_page"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: string, callback: any) => {
    if (
      !formData.infinite_quantity_customer &&
      !formData.quantity_one_customer
    ) {
      callback(
        new Error(
          t("validate.required.field", {
            field: t("store.usage_per_page"),
          })
        )
      );
      return;
    }

    if (
      (!formData.infinite_quantity && formData.infinite_quantity_customer) ||
      (!formData.infinite_quantity &&
        formData.quantity &&
        !formData.infinite_quantity_customer &&
        formData.quantity < formData.quantity_one_customer)
    ) {
      callback(new Error(t("errors.enough_usage_per_page")));
    }
    callback();
  };
};

export const validateRequiredFeeAmount = (
  formData: any,
  type: string,
  mess = t("validate.required.field", {
    field: t("total_per_person"),
  })
) => {
  return (rule: [{ [key: string]: string }], value: number, callback) => {
    if (
      (type === "fee_restaurant_range_1_fee" &&
        !formData.fee_restaurant_range_1_fee) ||
      (type === "fee_restaurant_range_1_fee" &&
        !formData.fee_restaurant_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_restaurant_range_2_fee" &&
        !formData.fee_restaurant_range_2_fee) ||
      (type === "fee_restaurant_range_2_fee" &&
        !formData.fee_restaurant_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_restaurant_range_3_fee" &&
        !formData.fee_restaurant_range_3_fee) ||
      (type === "fee_restaurant_range_3_fee" &&
        !formData.fee_restaurant_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_restaurant_range_4_fee" &&
        !formData.fee_restaurant_range_4_fee) ||
      (type === "fee_restaurant_range_4_fee" &&
        !formData.fee_restaurant_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_restaurant_range_5_fee" &&
        !formData.fee_restaurant_range_5_fee) ||
      (type === "fee_restaurant_range_5_fee" &&
        !formData.fee_restaurant_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_salon_range_1_fee" && !formData.fee_salon_range_1_fee) ||
      (type === "fee_salon_range_1_fee" && !formData.fee_salon_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_salon_range_2_fee" && !formData.fee_salon_range_2_fee) ||
      (type === "fee_salon_range_2_fee" && !formData.fee_salon_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_salon_range_3_fee" && !formData.fee_salon_range_3_fee) ||
      (type === "fee_salon_range_3_fee" && !formData.fee_salon_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_salon_range_4_fee" && !formData.fee_salon_range_4_fee) ||
      (type === "fee_salon_range_4_fee" && !formData.fee_salon_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_salon_range_5_fee" && !formData.fee_salon_range_5_fee) ||
      (type === "fee_salon_range_5_fee" && !formData.fee_salon_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_medical_range_1_fee" && !formData.fee_medical_range_1_fee) ||
      (type === "fee_medical_range_1_fee" && !formData.fee_medical_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_medical_range_2_fee" && !formData.fee_medical_range_2_fee) ||
      (type === "fee_medical_range_2_fee" && !formData.fee_medical_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_medical_range_3_fee" && !formData.fee_medical_range_3_fee) ||
      (type === "fee_medical_range_3_fee" && !formData.fee_medical_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_medical_range_4_fee" && !formData.fee_medical_range_4_fee) ||
      (type === "fee_medical_range_4_fee" && !formData.fee_medical_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_medical_range_5_fee" && !formData.fee_medical_range_5_fee) ||
      (type === "fee_medical_range_5_fee" && !formData.fee_medical_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_school_range_1_fee" && !formData.fee_school_range_1_fee) ||
      (type === "fee_school_range_1_fee" && !formData.fee_school_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_school_range_2_fee" && !formData.fee_school_range_2_fee) ||
      (type === "fee_school_range_2_fee" && !formData.fee_school_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_school_range_3_fee" && !formData.fee_school_range_3_fee) ||
      (type === "fee_school_range_3_fee" && !formData.fee_school_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_school_range_4_fee" && !formData.fee_school_range_4_fee) ||
      (type === "fee_school_range_4_fee" && !formData.fee_school_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_school_range_5_fee" && !formData.fee_school_range_5_fee) ||
      (type === "fee_school_range_5_fee" && !formData.fee_school_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_consultation_range_1_fee" && !formData.fee_consultation_range_1_fee) ||
      (type === "fee_consultation_range_1_fee" && !formData.fee_consultation_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_consultation_range_2_fee" && !formData.fee_consultation_range_2_fee) ||
      (type === "fee_consultation_range_2_fee" && !formData.fee_consultation_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_consultation_range_3_fee" && !formData.fee_consultation_range_3_fee) ||
      (type === "fee_consultation_range_3_fee" && !formData.fee_consultation_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_consultation_range_4_fee" && !formData.fee_consultation_range_4_fee) ||
      (type === "fee_consultation_range_4_fee" && !formData.fee_consultation_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_consultation_range_5_fee" && !formData.fee_consultation_range_5_fee) ||
      (type === "fee_consultation_range_5_fee" && !formData.fee_consultation_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_events_range_1_fee" && !formData.fee_events_range_1_fee) ||
      (type === "fee_events_range_1_fee" && !formData.fee_events_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_events_range_2_fee" && !formData.fee_events_range_2_fee) ||
      (type === "fee_events_range_2_fee" && !formData.fee_events_range_2_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_events_range_3_fee" && !formData.fee_events_range_3_fee) ||
      (type === "fee_events_range_3_fee" && !formData.fee_events_range_3_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_events_range_4_fee" && !formData.fee_events_range_4_fee) ||
      (type === "fee_events_range_4_fee" && !formData.fee_events_range_4_amount)
    ) {
      callback(new Error(mess));
    }

    if (
      (type === "fee_events_range_5_fee" && !formData.fee_events_range_5_fee) ||
      (type === "fee_events_range_5_fee" && !formData.fee_events_range_5_amount)
    ) {
      callback(new Error(mess));
    }

    callback();
  };
};
