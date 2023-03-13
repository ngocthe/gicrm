<template>
  <ListScreenComponent v-loading="!bookingDetail">
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.booking_details") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.booking_details") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div class="booking-form">
        <el-form
          v-if="bookingDetail"
          ref="_formRef"
          label-width="160px"
          label-position="left"
          class="form-data"
        >
          <div class="left">
            <el-form-item
              :label="$t('date_of_visit')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-form-item class="flex-1">
                  <div class="d-flex w-100">
                    <el-date-picker
                      ref="_refDatePicker"
                      :model-value="bookingDetail.order_time"
                      type="date"
                      placeholder=""
                      :editable="false"
                      class="flex-2"
                      format="YYYY/MM/DD HH:mm:ss"
                      :disabled-date="disabledDate"
                      disabled
                    />
                  </div>
                </el-form-item>
              </ClientOnly>
            </el-form-item>
            <!--Store name-->
            <el-form-item
              :label="$t('admin.visitor_name')"
              class="align-items-center"
            >
              <el-form-item prop="order_email" class="flex-1">
                <InputText
                  :model-value="bookingDetail.store.name"
                  placeholder=""
                  disabled
                />
              </el-form-item>
            </el-form-item>
            <!--END store name-->
            <!--Number-->
            <div-inline
              v-if="PEOPLE_STORE_BOOKING.includes(typeStore)"
              :label="'number_reservation'"
            >
              <template #form-item>
                <el-row class="member-row flex-1 align-items-start">
                  <el-col :span="12" class="member align-items-center">
                    <div class="member-label">
                      {{ $t("adult") }}
                    </div>
                    <el-form-item prop="number_adult">
                      <el-input
                        class="input-number"
                        :model-value="bookingDetail.detail.number_adult"
                        :placeholder="$t('one_people')"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="bookingDetail.detail.number_children"
                    :span="12"
                    class="member align-items-center"
                  >
                    <div class="member-label">
                      {{ $t("child") }}
                    </div>
                    <el-form-item prop="number_children">
                      <el-input
                        class="input-number"
                        :model-value="bookingDetail.detail.number_children"
                        :placeholder="$t('one_people')"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-inline>
            <!--End Number-->
            <!--Course-->
            <el-form-item
              v-if="
                COURSE_STORE_BOOKING.includes(typeStore) &&
                bookingDetail?.detail?.course
              "
              :label="$t('course')"
              class="div-inline align-items-center"
            >
              <el-form-item prop="course_id" class="flex-1">
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail.detail.course_id"
                    placeholder=" "
                    disabled
                  >
                    <el-option
                      :label="bookingDetail?.detail?.course?.name"
                      :value="bookingDetail?.detail?.course_id"
                    />
                  </el-select>
                </ClientOnly>
              </el-form-item>
            </el-form-item>
            <!--End Course-->
            <!--COUPON: type store = restaurant|event-->
            <el-form-item
              v-if="
                COUPON_STORE_BOOKING.includes(typeStore) &&
                bookingDetail.coupon_code
              "
              :label="$t('coupon_code')"
            >
              <el-input
                :model-value="bookingDetail.coupon_code"
                :placeholder="$t('placeholder.enter_coupon_code')"
                disabled
              />
            </el-form-item>
            <!--END COUPON-->
            <!--DETAIL type user cancel-->
            <el-form-item
              :label="$t('store.reservation_status')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  :model-value="bookingDetail.status"
                  disabled
                  placeholder=""
                >
                  <el-option
                    v-for="item in reservationStatusOptions"
                    :key="item.value"
                    :label="`${$t(item.label)}${
                      isBookingCanceled
                        ? `（${
                            DATA_CANCEL_FILTER[
                              bookingDetail?.cancel?.type_user_cancel
                            ]
                          }）`
                        : ''
                    }`"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!--END DETAIL-->
            <!--RESERVATION_TYPE-->
            <el-form-item
              :label="$t('reservation_type')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  :model-value="bookingDetail.type_course"
                  placeholder=" "
                  disabled
                >
                  <el-option
                    v-for="item in reservationTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!--END RESERVATION_TYPE-->
            <!--STAFF: SALON-->
            <el-form-item
              v-if="STAFF_STORE_BOOKING.includes(typeStore)"
              :label="$t('staff_nomination')"
              class="div-inline"
            >
              <el-form-item prop="staff_id" class="flex-1">
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.detail?.staff_id"
                    placeholder=""
                    disabled
                  >
                    <el-option
                      :label="bookingDetail?.detail?.staff?.name"
                      :value="bookingDetail?.detail?.staff_id"
                    />
                  </el-select>
                </ClientOnly>
              </el-form-item>
            </el-form-item>
            <!--End STAFF-->
            <!--SEAT Booking: RESTAURANT-->
            <el-form-item
              v-if="SEAT_STORE_BOOKING.includes(typeStore)"
              :label="$t('seat_selection')"
              prop="seat_type_id"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  :model-value="bookingDetail?.detail?.seat_type_id"
                  placeholder=""
                  disabled
                >
                  <el-option
                    :label="bookingDetail?.detail?.category_seat?.name"
                    :value="bookingDetail?.detail?.category_seat?.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!--END SEAT Booking-->
            <!--Menu: SALON-->
            <el-form-item
              v-if="
                MENU_STORE_BOOKING.includes(typeStore) &&
                bookingDetail &&
                bookingDetail.detail.menu_details.length
              "
              :label="$t('additional_menu_selection')"
            >
              <MenuBooking
                class="w-100"
                :category-list="arrCategorySelected"
                :arr-id-menu-prop="arrIdMenuActive"
                :disabled="true"
              />
            </el-form-item>
            <!--END MENU-->
            <el-form-item :label="$t('author')" class="align-items-center">
              <ClientOnly>
                <el-select
                  :model-value="bookingDetail?.type_user_create"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="(item, key) in DATA_USER_BOOKING_FILTER"
                    :key="+key"
                    :value="+key"
                    :label="item"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <div class="other-information font-weight-500">
              {{ $t("other_information") }}
            </div>
            <div class="full-name">
              <el-form-item
                :label="$t('full_name_kanji')"
                class="align-items-center"
              >
                <div class="d-flex name w-100 items">
                  <el-form-item prop="order_first_name" class="first-name">
                    <el-input
                      :model-value="bookingDetail.order_first_name"
                      placeholder=""
                      disabled
                    />
                  </el-form-item>
                  <el-form-item prop="order_last_name" class="last-name">
                    <el-input
                      :model-value="bookingDetail.order_last_name"
                      placeholder=""
                      disabled
                    />
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
            <el-form-item
              :label="$t('email_address')"
              class="align-items-center"
            >
              <el-form-item prop="order_email" class="flex-1">
                <InputText
                  :model-value="bookingDetail.order_email"
                  placeholder=""
                  disabled
                />
              </el-form-item>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              class="align-items-center"
            >
              <el-form-item prop="order_phone_number" class="flex-1">
                <input-phone
                  :model-value="bookingDetail.order_phone_number"
                  disabled
                />
              </el-form-item>
            </el-form-item>
            <el-form-item :label="$t('memo')" prop="order_memo">
              <el-input
                :model-value="bookingDetail.order_memo"
                :rows="4"
                type="textarea"
                disabled
              />
            </el-form-item>
            <el-form-item v-if="isBookingCanceled" :label="$t('front.cause')">
              <el-input :model-value="bookingDetail?.cancel?.reason" disabled />
            </el-form-item>
            <el-form-item v-if="isBookingCanceled" :label="$t('memo_cancel')">
              <el-input
                :model-value="bookingDetail?.cancel?.memo"
                :rows="3"
                type="textarea"
                disabled
              />
            </el-form-item>
          </div>
          <div class="right">
            <div class="settlement-title font-weight-500">
              {{ $t("booking.settlement_amount") }}
            </div>
            <template v-if="typeStore === RESTAURANT">
              <div class="amount">
                <div class="amount-item">
                  <div class="title">
                    {{
                      $t("one_adult", {
                        number: bookingDetail.detail.number_adult || 0,
                      })
                    }}
                  </div>
                  <div class="price">
                    {{ priceDisplay(priceAdult) }}{{ $t("yen") }}
                  </div>
                </div>
                <div
                  v-if="bookingDetail.detail.number_children"
                  class="amount-item child"
                >
                  <div class="title">
                    {{
                      $t("one_child", {
                        number: bookingDetail.detail.number_children || 0,
                      })
                    }}
                  </div>
                  <div class="price">
                    {{ priceDisplay(priceChildren) }}{{ $t("yen") }}
                  </div>
                </div>
                <div v-if="bookingDetail.incurred_amount" class="amount-item">
                  <div class="title">{{ $t("booking.incurred_amount") }}</div>
                  <div class="price">
                    {{ priceDisplay(bookingDetail.incurred_amount || 0)
                    }}{{ $t("yen") }}
                  </div>
                </div>
                <div
                  v-if="
                    (bookingDetail && bookingDetail?.coupon_name) ||
                    couponSelected
                  "
                  class="amount-item coupon"
                >
                  <div class="title">
                    {{ bookingDetail?.coupon_name || couponSelected?.name }}
                  </div>
                  <div class="price">
                    -{{ priceDisplay(couponPrice) }}{{ $t("yen") }}
                  </div>
                </div>
              </div>
              <div class="amount-item total">
                <div class="title font-weight-500">{{ $t("total") }}</div>
                <div class="price">
                  {{ priceDisplay(total) }}{{ $t("yen") }}
                </div>
              </div>
            </template>
            <template v-if="typeStore === SALON">
              <div class="amount">
                <div v-if="chooseCourse?.name" class="amount-item">
                  <div class="title">
                    {{ chooseCourse?.name }}
                  </div>
                  <div class="price">
                    {{ priceDisplay(chooseCourse?.price || 0) }}{{ $t("yen") }}
                  </div>
                </div>
                <div
                  v-for="item in arrMenuActive"
                  :key="item.id"
                  class="amount-item"
                >
                  <div class="title">{{ item.name }}</div>
                  <div class="price">
                    {{ priceDisplay(item.price) }}{{ $t("yen") }}
                  </div>
                </div>
                <div v-if="chooseStaff" class="amount-item">
                  <div class="title">
                    {{ chooseStaff?.name }}
                  </div>
                  <div
                    v-if="bookingDetail && bookingDetail.detail"
                    class="price"
                  >
                    {{
                      bookingDetail.detail?.request_staff === 0
                        ? 0
                        : priceDisplay(chooseStaff?.fee || 0)
                    }}{{ $t("yen") }}
                  </div>
                </div>
              </div>
              <div v-if="bookingDetail.incurred_amount" class="amount-item">
                <div class="title">{{ $t("booking.incurred_amount") }}</div>
                <div class="price">
                  {{ priceDisplay(bookingDetail.incurred_amount || 0)
                  }}{{ $t("yen") }}
                </div>
              </div>
              <div class="amount-item total">
                <div class="title font-weight-500">{{ $t("total") }}</div>
                <div class="price">
                  {{ priceDisplay(bookingDetail.amount) }}{{ $t("yen") }}
                </div>
              </div>
            </template>
            <div class="d-flex justify-content-end status-invoice">
              <el-form-item
                :label="$t('payment_status')"
                label-width="160px"
                class="align-items-center"
              >
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail.status_payment"
                    placeholder=""
                    disabled
                  >
                    <el-option
                      v-for="status in paymentStatusBookingOptions"
                      :key="status.value"
                      :label="status.label"
                      :value="status.value"
                    />
                  </el-select>
                </ClientOnly>
              </el-form-item>
            </div>
            <div class="d-flex justify-content-end status-invoice">
              <el-form-item
                label-width="160px"
                :label="$t('transition_number')"
              >
                <div
                  v-if="bookingDetail?.invoice.id"
                  class="text-link text-underline cursor-pointer form-item-time height-40 flex-"
                  @click="redirectInvoice"
                >
                  {{ bookingDetail?.invoice?.id }}
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button" />
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import priceDisplay from "~/../../src/shared/utils/price";
import InputPhone from "~/../../src/shared/components/input/Phone";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import MenuBooking from "~/../../src/front/components/pages/booking/MenuBooking.vue";
import {
  DATA_CANCEL_FILTER,
  DATA_USER_BOOKING_FILTER,
  RESERVATION_STATUS,
  reservationStatusOptions,
  reservationTypeOptions,
} from "~/../../src/shared/constants/reservation";
import InputText from "~/../../src/shared/components/input/InputText.vue";

import moment from "moment";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { useRoute, useRouter } from "#imports";
import { paymentStatusBookingOptions } from "~/../../src/shared/constants";

import { BookingDetail } from "~/../../src/admin/models/reservation";
import {
  COURSE_STORE_BOOKING,
  MENU_STORE_BOOKING,
  PEOPLE_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  STAFF_STORE_BOOKING,
  COUPON_STORE_BOOKING,
} from "~/../../src/shared/constants/typeStore";
import { StaffInterface } from "~/../../src/shared/models";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { wrapArrayMenu, roundPrice } from "~/../../src/shared/utils";
import { Menu } from "~/../../src/front/models";

const route = useRoute();
const router = useRouter();

const _formRef = ref();
const chooseCourse = ref(null);
const bookingDetail = ref<BookingDetail>(null);
const isMounted = ref(false);
const chooseStaff = ref<StaffInterface>(null);
const arrCategorySelected = ref([]);
const arrIdMenuActive = ref([]);
const arrMenuActive = ref<Menu[]>([]);

const disabledDate = (time: Date) => {
  const weekDayNumber = moment(time).format("d");
  return (
    moment(time).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD") ||
    (chooseCourse.value &&
      !chooseCourse.value?.day_works?.includes(+weekDayNumber))
  );
};

const priceAdult = computed(() => {
  if (bookingDetail.value) {
    return (
      (bookingDetail.value.detail.price_adult || 0) *
      (bookingDetail.value.detail.number_adult || 0)
    );
  }
  return (
    (chooseCourse.value?.price || 0) *
    (bookingDetail.value.detail.number_adult || 0)
  );
});

const priceChildren = computed(() => {
  if (bookingDetail.value) {
    return (
      (bookingDetail.value.detail.price_children || 0) *
      (bookingDetail.value.detail.number_children || 0)
    );
  }
  return (
    (chooseCourse.value?.price_children || 0) *
    (bookingDetail.value.detail.number_children || 0)
  );
});

const total = computed(() => {
  return bookingDetail.value.amount <= 0 ? 0 : bookingDetail.value.amount;
});

const isBookingCanceled = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.CANCEL
);

const typeStore = computed(
  () => bookingDetail.value?.store?.model_has_type?.type_id
);

const couponPrice = computed(() => {
  if (bookingDetail.value) {
    return bookingDetail.value.amount_discount;
  }
  return 0;
});

onBeforeMount(async () => {
  try {
    if (route.params?.id) {
      bookingDetail.value = (
        await BookingRequest.show<BookingDetail>(+route.params?.id as number)
      )?.data;

      switch (typeStore.value) {
        case SALON:
          arrCategorySelected.value = wrapArrayMenu(
            bookingDetail.value.detail?.menu_details || []
          );

          bookingDetail.value.detail?.menu_details?.forEach((item) => {
            arrIdMenuActive.value.push(item.menu_id);
            arrMenuActive.value.push({
              ...item.menu,
              price: item.menu_price,
            });
          });

          chooseCourse.value = {
            ...bookingDetail.value.detail?.course,
            price: bookingDetail.value.detail.course_price,
          };

          chooseStaff.value = {
            ...bookingDetail.value.detail?.staff,
            fee: bookingDetail.value.detail.staff_fee,
          };
      }
    }
  } catch (e) {
    await router.push({ name: "reservations" });
  } finally {
    isMounted.value = true;
  }
});

const redirectInvoice = () => {
  router.push(`/invoices/detail/${bookingDetail.value?.invoice?.id}`);
};
</script>

<style scoped lang="scss">
@import "~/../../src/shared/assets/scss/variables.scss";

.booking-form {
  .line-height-20 {
    line-height: 20px;
  }

  :deep(.label-text) {
    font-size: 14px;
  }

  :deep(.input-number) {
    .el-input__wrapper {
      width: 115px;
    }
  }

  .div-inline {
    height: 40px;
  }

  :deep(.el-form-item__label) {
    padding-top: 5px;
  }

  .form-data {
    display: flex;
    gap: 85px;

    :deep(.el-select) {
      width: 100%;
    }

    :deep(.el-date-editor.el-input) {
      --el-date-editor-width: 100%;
      height: 40px;
    }

    :deep(.el-input) {
      height: 40px;
    }

    .left {
      width: 50%;

      .other-information {
        padding-bottom: 8px;
        border-bottom: 1px solid $gray-400;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .full-name {
        .name {
          gap: 24px;

          & > div {
            flex: 1;
          }
        }
      }

      :deep(.el-input-number__decrease),
      :deep(.el-input-number__increase) {
        height: 20px;
      }

      :deep(.member-row) {
        .member {
          display: flex;
          align-items: flex-start;

          .el-form-item {
            margin-bottom: 0;
          }

          .member-label {
            max-width: 80px;
            min-width: 30px;
            width: 100%;
            padding-top: 10px;
            font-size: 14px;
          }

          .el-form-item__content {
            margin-left: 0 !important;

            .el-input-number {
              width: 120px;
            }
          }
        }
      }
    }

    .right {
      width: 50%;

      .settlement-title {
        border-bottom: 1px solid $gray-300;
        padding-bottom: 8px;
        font-size: 14px;
      }

      .amount {
        padding: 22px 0;
        border-bottom: 1px solid $gray-300;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .amount-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        gap: 10px;

        .price {
          font-weight: 500;
          font-size: 16px;
          line-height: 26px;
          flex: 0 0 185px;
          text-align: right;
        }

        &.coupon {
          color: $red-100;
        }
      }

      .total {
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }
  }

  .status-invoice {
    :deep(.el-select) {
      .el-input {
        height: 40px;
      }
    }

    .el-form-item {
      flex-basis: 52%;

      :deep(.el-form-item__content) {
        line-height: 40px;
        height: 40px;
      }
    }
  }
}
</style>
