import CourseRequest from "~/../../src/shared/requests/front/course";
import { Course, Store } from "~/../../src/front/models";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import moment from "moment";
import { customTrimValue } from "~/../../src/shared/utils";
import { useRoute, useRouter } from "#imports";
import {
  messageError,
  noReserveBooking,
} from "~/../../src/shared/utils/notification";
import CategoryRequest from "~/../../src/shared/requests/CategoryRequest";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { RESERVATION_TYPE } from "~/../../src/shared/constants/reservation";
import { i18n } from "~/../../src/shared/plugins/i18n";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { useMeStore } from "~/../../src/shared/stores/me";
import { REMIND_EMAIL } from "~/../../src/shared/constants/booking";

const { t } = i18n.global;

export const getDataBooking = async (
  formData,
  formDataProp,
  paramStore,
  store,
  storeProp,
  paramCourse,
  arrCourses,
  courses,
  arrSeats,
  chooseCourse,
  courseFilterDateTimeSelect,
  categoriesSeat,
  minTime,
  timeRanger,
  timeout,
  _formRef,
  categoryList,
  staffList,
  isBackScreen,
  arrIdMenuProp,
  staffListProp,
  categoryListProp
) => {
  const route = useRoute();
  const router = useRouter();
  const meStore = useMeStore();
  if (isBackScreen.value) {
    if (storeProp.value?.model_has_type?.type_id === RESTAURANT) {
      //SET data when back screen
      courses.value = arrCourses.value;
      store.value = storeProp.value;
      categoriesSeat.value = arrSeats.value;
    }
    if (storeProp.value?.model_has_type?.type_id === SALON) {
      //SET data when back screen
      courses.value = arrCourses.value;
      store.value = storeProp.value;
      staffList.value = staffListProp.value;
      categoryList.value = categoryListProp.value;
    }
  } else {
    formData.order_first_name = meStore?.info?.first_name;
    formData.order_last_name = meStore?.info?.last_name;
    formData.order_email = meStore?.info?.email;
    formData.order_phone_number = meStore?.info?.phone_number;
    formData.remind = REMIND_EMAIL;
    if (paramCourse) {
      try {
        chooseCourse.value = (
          await CourseRequest.show<Course>(paramCourse, true)
        )?.data;

        store.value = (
          await StoreRequest.show<Store>(chooseCourse.value.store_id)
        )?.data;

        courses.value = (
          await CourseRequest.getAllCourseByStore<Course[]>(
            store.value.id,
            true
          )
        )?.data;

        // formData.course_id = paramCourse;
      } catch (e) {
        if (e?.response?.status === STATUS_CODE.AUTHENTICATION) {
          await router.push({ name: "login" });
        } else {
          await router.push("/404");
        }
      }
    } else if (paramStore) {
      try {
        courses.value = (
          await CourseRequest.getAllCourseByStore<Course[]>(paramStore, true)
        )?.data;

        store.value = (await StoreRequest.show<Store>(paramStore))?.data;
      } catch (e: any) {
        if (e?.response?.status === STATUS_CODE.AUTHENTICATION) {
          await router.push({ name: "login" });
        } else {
          await router.push("/404");
        }
      }
    }
  }

  if (
    store.value.id &&
    !isBackScreen.value &&
    store.value?.model_has_type?.type_id === SALON
  ) {
    categoryList.value = (
      await CategoryRequest.getAllCategoryByStore(store.value.id)
    )?.data;
  }
  if (
    route.query?.date_booking &&
    moment(route.query?.date_booking, "YYYYMMDD").isValid()
  ) {
    const currentDay = moment(
      moment(route.query?.date_booking, "YYYYMMDD")
    ).weekday();
    if (
      moment(route.query?.date_booking, "YYYYMMDD").format("YYYYMMDD") >=
        moment().format("YYYYMMDD") &&
      store.value?.opening_times.some((item) => item.day_of_week === currentDay)
    ) {
      formData.dateSelect = moment(
        route.query?.date_booking,
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
    } else {
      formData.dateSelect = "";
    }
  }

  // check default menu
  if (
    route.query?.menu_id &&
    categoryList.value.length &&
    store.value.model_has_type?.type_id === SALON
  ) {
    const check = categoryList.value.some((category) =>
      category.menus.some((menu) => menu.id === +route.query?.menu_id)
    );
    if (check && !isBackScreen.value) {
      arrIdMenuProp.value = [+route.query?.menu_id];
    }
  }
};

export const setDataWhenBackScreen = (
  formDataProp,
  formData,
  categorySeatProp,
  chooseCourse,
  courses,
  chooseStaff,
  staffList,
  arrIdMenuProp,
  typeStore
) => {
  if (formDataProp.value) {
    formData.order_time = formDataProp.value.order_time;
    formData.order_first_name = formDataProp.value.order_first_name;
    formData.order_last_name = formDataProp.value.order_last_name;
    formData.order_email = formDataProp.value.order_email;
    formData.order_phone_number = formDataProp.value.order_phone_number;
    formData.order_memo = formDataProp.value.order_memo;
    formData.cancel_policy = formDataProp.value.cancel_policy;
    formData.payment_type = formDataProp.value.payment_type;
    formData.coupon_code = formDataProp.value.coupon_code;
    formData.note = formDataProp.value.note;
    formData.remind = formDataProp.value.remind;
    if (formData.order_time) {
      const timeArr = formData.order_time?.split(" ");
      formData.dateSelect = timeArr[0];
      formData.timeSelect = timeArr[1];
    }
    switch (typeStore.value) {
      case RESTAURANT:
        formData.number_adult = formDataProp.value.number_adult;
        formData.number_children = formDataProp.value.number_children;
        formData.course_id = formDataProp.value.course_id;
        formData.seat_type_id = categorySeatProp.value || null;
        chooseCourse.value = courses.value.find(
          (item) => item.id === formData.course_id
        );
        break;
      case SALON:
        formData.course_id = formDataProp.value.course_id;
        formData.staff_id = formDataProp.value.staff_id || null;
        chooseCourse.value = courses.value.find(
          (item) => item.id === formData.course_id
        );
        chooseStaff.value = staffList.value.find(
          (item) => item.id === formData.staff_id
        );
        arrIdMenuProp.value = formDataProp.value.arrMenuSelected.map(
          (item) => item.id
        );
    }
  }
};

export const customerBookingRestaurant = async (
  isInvalidTime,
  formData,
  form,
  categoriesSeat,
  store,
  courses,
  chooseCourse,
  userId,
  total,
  bookingSource,
  emits,
  typeStore,
  messInvalidCoupon,
  couponSelected,
  disabledButton?: boolean
) => {
  isInvalidTime.value = !(formData.dateSelect && formData.timeSelect);
  formData.order_time = `${formData.dateSelect} ${formData.timeSelect}`.trim();
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid && !isInvalidTime.value) {
      if (disabledButton) {
        return true;
      }
      let isSelect = true;
      if (!formData.seat_type_id) {
        isSelect = false;
        formData.seat_type_id = categoriesSeat.value?.[0]?.id;
      }
      const data = {
        form: {
          ...customTrimValue(formData),
          store_id: store.value.id,
          booking_user_id: userId,
          status: chooseCourse.value.payment_type,
          source: bookingSource,
          price_adult: chooseCourse.value?.price || 0,
          price_children: chooseCourse.value?.price_children || 0,
          typeStore: typeStore,
        },
        course: chooseCourse.value,
        store: store.value,
        coupon: couponSelected.value,
        amount: total.value,
        arrCourses: courses.value,
        arrSeats: categoriesSeat.value,
        isSelectSeat: isSelect,
      };

      emits("confirmBooking", data);
    }
  });
};

export const customerBookingSalon = async (
  isInvalidTime,
  formData,
  form,
  store,
  courses,
  chooseCourse,
  chooseStaff,
  categoryList,
  staffList,
  arrMenuIdSelected,
  userId,
  total,
  bookingSource,
  emits,
  typeStore,
  disabledButton?: boolean
) => {
  isInvalidTime.value = !(formData.dateSelect && formData.timeSelect);
  formData.order_time = `${formData.dateSelect} ${formData.timeSelect}`.trim();
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid && !isInvalidTime.value && !disabledButton) {
      const arrMenuItemSelected = [];
      categoryList.value.forEach((category) => {
        category.menus.forEach((menu) => {
          arrMenuIdSelected.value.includes(menu.id) &&
            arrMenuItemSelected.push(menu);
        });
      });
      if (staffList.value.length === 0) {
        return true;
      }
      if (!formData.course_id && !arrMenuItemSelected.length) {
        messageError(t("choose_course_menu"));
        return false;
      }

      const isSelect = true;
      const data = {
        form: {
          ...customTrimValue(formData),
          store_id: store.value.id,
          booking_user_id: userId,
          status: RESERVATION_TYPE.INSTANT,
          source: bookingSource,
          arrMenuSelected: arrMenuItemSelected,
          typeStore: typeStore,
        },
        chooseStaff: chooseStaff.value,
        course: chooseCourse.value,
        store: store.value,
        amount: total.value,
        arrCourses: courses.value,
        arrStaff: staffList.value,
        arrCategory: categoryList.value,
        isSelectSeat: isSelect,
      };

      emits("confirmBooking", data);
    }
  });
};
