<template>
  <div v-loading="!isMounted" class="booking-form">
    <div
      v-if="
        isBookingTentative &&
        !isBookingCanceled &&
        !isBookingVisited &&
        isCustomerCreateBooking
      "
      class="notice d-flex justify-content-between align-items-center mb-24"
    >
      <!--STATUS Waiting-->
      <div v-if="isBookingWaiting" class="text">
        <p>{{ $t("store.reservation_tentative") }}</p>
        <p>{{ $t("store.reservation_send_mail") }}</p>
      </div>
      <!--END: STATUS Waiting-->
      <div v-else class="text">
        <p>
          {{
            $t("store.email_sent_user", {
              field: bookingDetail.order_email,
            })
          }}
        </p>
      </div>
      <div v-if="isBookingWaiting" class="button">
        <ButtonBlue
          :loading="isLoadingApprove"
          :name="$t('store.confirm_reservation')"
          @on-click="handleReservationConfirm"
        />
      </div>
    </div>
    <el-form
      ref="_formRef"
      label-width="160px"
      label-position="left"
      :model="formData"
      :rules="rules"
      class="form-data"
      :hide-required-asterisk="true"
    >
      <div class="left">
        <el-form-item :label="$t('date_of_visit')" class="form-item-time">
          <ClientOnly v-if="!bookingDetail">
            <el-form-item class="flex-1 w-100">
              <div class="d-flex w-100 group-time-select">
                <el-date-picker
                  ref="_refDatePicker"
                  v-model="formData.dateSelect"
                  type="date"
                  placeholder="YYYY年MM月DD日"
                  :editable="false"
                  class="flex-2"
                  value-format="YYYY-MM-DD"
                  format="YYYY年MM月DD日"
                  :disabled-date="disabledDate"
                  :clearable="false"
                  @change="handleChangeDate"
                />
                <el-select
                  v-model="formData.timeSelect"
                  class="flex-1"
                  placeholder="08:00"
                  @change="handleChangeTimeSelect"
                >
                  <el-option
                    v-for="(time, key) in timeRanger"
                    :key="key"
                    :label="time"
                    :value="time"
                    :disabled="time < minTime"
                  />
                </el-select>
              </div>
            </el-form-item>
          </ClientOnly>
          <div v-else class="height-40">
            {{
              moment(bookingDetail.order_time).format("YYYY年MM月DD日 HH:mm:ss")
            }}
          </div>
          <p v-if="isInvalidTime && !bookingDetail" class="error-validate">
            {{
              $t("validate.required.field", {
                field: $t("reservation_date_Time"),
              })
            }}
          </p>
          <p
            v-if="errorsForm['order_time']?.[0] && isErrorOrderTime"
            class="error-validate"
          >
            {{ errorsForm["order_time"]?.[0] }}
          </p>
        </el-form-item>
        <!--Number: RESTAURANT-->
        <div-inline
          v-if="PEOPLE_STORE_BOOKING.includes(typeStore)"
          :label="'number_reservation'"
          :is-required="!bookingDetail"
        >
          <template #form-item>
            <el-row class="member-row flex-1 align-items-start">
              <el-col :span="12" class="member align-items-center">
                <div class="member-label">
                  {{ $t("adult") }}
                </div>
                <el-form-item
                  v-if="!bookingDetail"
                  prop="number_adult"
                  required
                  :error="errorsForm['number_adult']?.[0]"
                  class="input-number-member"
                >
                  <InputNumber
                    v-model="formData.number_adult"
                    :max="ADULT_MAX"
                    :placeholder="$t('one_people')"
                    :readonly="isLoadingCategoriesSeat"
                    @input="handleChangeNumberAdult"
                    @focusout="handleFocusOutNumberAdult"
                  />
                </el-form-item>
                <div v-else class="member-label">
                  {{ priceDisplay(bookingDetail.detail.number_adult)
                  }}{{ $t("man") }}
                </div>
              </el-col>
              <el-col
                v-if="
                  (bookingDetail && bookingDetail.detail?.number_children) ||
                  !bookingDetail
                "
                :span="12"
                class="member align-items-center"
              >
                <div class="member-label">
                  {{ $t("child") }}
                </div>
                <el-form-item
                  v-if="!bookingDetail"
                  prop="number_children"
                  :error="errorsForm['number_children']?.[0]"
                  class="input-number-member"
                >
                  <InputNumber
                    v-model="formData.number_children"
                    :max="CHILD_MAX"
                    :placeholder="$t('one_people')"
                    :disabled="
                      chooseCourse &&
                      chooseCourse.accepted_children === ACCEPTED_CHILDREN.NONE
                    "
                    @input="handleChangeNumberChildren"
                  />
                </el-form-item>
                <div v-else class="member-label">
                  {{ priceDisplay(bookingDetail.detail.number_children || 0)
                  }}{{ $t("man") }}
                </div>
              </el-col>
            </el-row>
          </template>
        </div-inline>
        <!--End Number-->
        <!--Course: RESTAURANT, SALON-->
        <el-form-item
          v-if="
            COURSE_STORE_BOOKING.includes(typeStore) &&
            ((bookingDetail && bookingDetail.detail.course) || !bookingDetail)
          "
          :label="$t('course')"
          :required="!bookingDetail && typeStore !== SALON"
          class="div-inline"
        >
          <el-form-item
            v-if="!bookingDetail"
            prop="course_id"
            class="flex-1"
            :error="errorsForm['course_id']?.[0]"
          >
            <ClientOnly>
              <el-select
                v-model="formData.course_id"
                :teleported="false"
                :clearable="typeStore === SALON"
                placeholder=" "
                @change="handleChangeCourse"
              >
                <el-option
                  v-for="item in courseFilterDateTimeSelect"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </ClientOnly>
          </el-form-item>
          <div v-else class="line-height-20 text-long-elise-2">
            {{ bookingDetail.detail.course?.name || "" }}
          </div>
        </el-form-item>
        <!--End Course-->
        <!--COUPON: type store = restaurant|event-->
        <el-form-item
          v-if="
            COUPON_STORE_BOOKING.includes(typeStore) &&
            ((bookingDetail && bookingDetail.coupon_name) || !bookingDetail)
          "
          :label="$t('coupon_code')"
          prop="coupon_code"
          :error="errorsForm['coupon_code']?.[0]"
        >
          <el-input
            v-model="formData.coupon_code"
            v-input-trim
            :readonly="isLoadingCheckCoupon"
            :maxlength="MAX_LENGTH_COUPON_CODE"
            :placeholder="$t('placeholder.enter_coupon_code')"
            :disabled="bookingDetail"
            @focusout="handleFocusOutCoupon"
          />
        </el-form-item>
        <!--END COUPON-->
        <!--DETAIL type user cancel-->
        <el-form-item
          v-if="bookingDetail"
          :label="$t('store.reservation_status')"
        >
          <ClientOnly>
            <el-select :model-value="bookingDetail.status" disabled>
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
        <el-form-item v-if="bookingDetail" :label="$t('reservation_type')">
          <ClientOnly>
            <el-select
              :model-value="bookingDetail.type_course"
              disabled
              placeholder=" "
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
          <el-form-item
            prop="staff_id"
            class="flex-1"
            :error="errorsForm['staff_id']?.[0] || errorStaff"
          >
            <ClientOnly>
              <el-select
                v-if="!bookingDetail"
                v-model="formData.staff_id"
                v-loading="isLoadingStaff"
                :teleported="false"
                :clearable="true"
                @change="handleChangeStaff"
              >
                <el-option
                  v-for="item in staffList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-else
                :model-value="bookingDetail?.detail?.staff_id"
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
          :error="errorSeat"
        >
          <ClientOnly>
            <el-select
              v-if="!bookingDetail"
              v-model="formData.seat_type_id"
              v-loading="isLoadingCategoriesSeat"
              :teleported="false"
            >
              <el-option
                v-for="item in categoriesSeat"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-else
              :model-value="bookingDetail?.detail?.seat_type_id"
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
            (!bookingDetail ||
              (bookingDetail && bookingDetail.detail?.menu_details?.length))
          "
          :label="$t('additional_menu_selection')"
        >
          <MenuBooking
            v-if="!bookingDetail"
            class="w-100"
            :category-list="categoryList"
            :arr-id-menu-prop="arrIdMenuActive"
            :is-loading="isLoadingStaff"
            @change-menu="handleChangeMenu"
          />
          <MenuBooking
            v-else
            class="w-100"
            :category-list="arrCategorySelected"
            :arr-id-menu-prop="arrIdMenuActive"
            :is-loading="isLoadingStaff"
            :disabled="true"
            @change-menu="handleChangeMenu"
          />
        </el-form-item>
        <!--END MENU-->
        <el-form-item v-if="bookingDetail" :label="$t('author')">
          <ClientOnly>
            <el-select :model-value="bookingDetail?.type_user_create" disabled>
              <el-option
                v-for="(item, key) in DATA_USER_BOOKING_FILTER"
                :key="+key"
                :value="+key"
                :label="item"
              />
            </el-select>
          </ClientOnly>
        </el-form-item>
        <el-form-item
          v-if="bookingDetail && bookingDetail?.remind"
          :label="$t('remind')"
        >
          <ClientOnly>
            <el-select :model-value="bookingDetail?.remind" disabled>
              <el-option
                v-for="item in dataRemind"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              />
            </el-select>
          </ClientOnly>
        </el-form-item>
        <el-form-item v-if="bookingDetail" :label="$t('payment_method')">
          <ClientOnly>
            <el-select :model-value="bookingDetail?.payment_type" disabled>
              <el-option
                v-for="item in PaymentMethod"
                :key="item.value"
                :value="item.value"
                :label="item.label"
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
            :required="!bookingDetail"
          >
            <div class="d-flex name w-100 height-40 align-items-center">
              <el-form-item
                v-if="!bookingDetail"
                prop="order_first_name"
                class="first-name"
                required
              >
                <el-input
                  v-model="formData.order_first_name"
                  placeholder=" "
                  :maxlength="MAX_LENGTH_FIRST_NAME"
                  clearable
                  @focusout="handleFocusOutCoupon"
                />
              </el-form-item>
              <p v-else class="flex-1 text-long-elise-2 line-height-20">
                {{ bookingDetail.order_first_name }}
              </p>
              <el-form-item
                v-if="!bookingDetail"
                :required="!bookingDetail"
                prop="order_last_name"
                class="last-name"
              >
                <el-input
                  v-model="formData.order_last_name"
                  placeholder=" "
                  :maxlength="MAX_LENGTH_LAST_NAME"
                  clearable
                  @focusout="handleFocusOutCoupon"
                />
              </el-form-item>
              <p v-else class="flex-1 text-long-elise-2 line-height-20">
                {{ bookingDetail.order_last_name }}
              </p>
            </div>
          </el-form-item>
        </div>
        <el-form-item :label="$t('email_address')">
          <el-form-item
            v-if="!bookingDetail"
            prop="order_email"
            class="flex-1"
            :error="errorsForm['order_email']?.[0]"
          >
            <InputText v-model="formData.order_email" placeholder=" " />
          </el-form-item>
          <p v-else class="text-long-elise-2 height-40">
            {{ bookingDetail.order_email }}
          </p>
        </el-form-item>
        <el-form-item :label="$t('phone_number')" :required="!bookingDetail">
          <el-form-item
            v-if="!bookingDetail"
            required
            prop="order_phone_number"
            class="flex-1"
            :error="errorsForm['order_phone_number']?.[0]"
          >
            <input-phone
              v-model="formData.order_phone_number"
              @focusout="handleFocusOutCoupon"
            />
          </el-form-item>
          <p v-else class="height-40">{{ bookingDetail.order_phone_number }}</p>
        </el-form-item>
        <el-form-item
          :label="$t('memo')"
          prop="order_memo"
          :error="errorsForm['order_memo']?.[0]"
        >
          <el-input
            v-model="formData.order_memo"
            :rows="4"
            type="textarea"
            :disabled="isBookingCanceled"
            :maxlength="MAX_LENGTH_TEXTAREA"
          />
        </el-form-item>
        <el-form-item v-if="isBookingCanceled" :label="$t('front.cause')">
          <el-input
            :model-value="bookingDetail?.cancel?.reason"
            :disabled="isBookingCanceled"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="isBookingCanceled" :label="$t('memo_cancel')">
          <el-input
            :model-value="bookingDetail?.cancel?.memo"
            :rows="3"
            type="textarea"
            :disabled="isBookingCanceled"
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
                    number: formData.number_adult || 0,
                  })
                }}
              </div>
              <div class="price">
                {{ priceDisplay(priceAdult) }}{{ $t("yen") }}
              </div>
            </div>
            <div
              v-if="
                (bookingDetail && bookingDetail.detail?.number_children) ||
                !bookingDetail
              "
              class="amount-item child"
            >
              <div class="title">
                {{
                  $t("one_child", {
                    number: formData.number_children || 0,
                  })
                }}
              </div>
              <div class="price">
                {{ priceDisplay(priceChildren) }}{{ $t("yen") }}
              </div>
            </div>
            <div
              v-if="
                (bookingDetail && bookingDetail?.coupon_name) || couponSelected
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
            <div
              v-if="bookingDetail && isPaymentContactless"
              class="amount-item"
            >
              <div class="title">
                {{ $t("booking.incurred_amount") }}
              </div>
              <div
                v-if="
                  isBookingCompleted &&
                  (isStatusPaymentWaiting || isCustomerUnPaid)
                "
                class="price custom-input"
              >
                <input-price v-model="formData.incurred_amount" />
                {{ $t("yen") }}
              </div>
              <div v-else class="price">
                <div>
                  {{ priceDisplay(bookingDetail.incurred_amount || 0)
                  }}{{ $t("yen") }}
                </div>
              </div>
            </div>
          </div>
          <div class="amount-item total">
            <div class="title font-weight-500">{{ $t("total") }}</div>
            <div class="price">{{ priceDisplay(total) }}{{ $t("yen") }}</div>
          </div>
        </template>
        <template v-if="typeStore === SALON">
          <div class="amount">
            <div v-if="chooseCourse?.name" class="amount-item">
              <div class="title">{{ chooseCourse?.name }}</div>
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
            <div v-if="chooseStaff?.name" class="amount-item">
              <div class="title">{{ chooseStaff?.name }}</div>
              <div v-if="bookingDetail && bookingDetail.detail" class="price">
                {{
                  bookingDetail.detail?.request_staff === 0
                    ? 0
                    : priceDisplay(chooseStaff?.fee || 0)
                }}{{ $t("yen") }}
              </div>
              <div v-else class="price">
                {{ priceDisplay(chooseStaff?.fee || 0) }}{{ $t("yen") }}
              </div>
            </div>
            <div
              v-if="bookingDetail && isPaymentContactless"
              class="amount-item"
            >
              <div class="title">
                {{ $t("booking.incurred_amount") }}
              </div>
              <div
                v-if="
                  isBookingCompleted &&
                  (isStatusPaymentWaiting || isCustomerUnPaid)
                "
                class="price custom-input"
              >
                <input-price v-model="formData.incurred_amount" />
                {{ $t("yen") }}
              </div>
              <div v-else class="price">
                <div>
                  {{ priceDisplay(bookingDetail.incurred_amount || 0)
                  }}{{ $t("yen") }}
                </div>
              </div>
            </div>
          </div>
          <div class="amount-item total">
            <div class="title font-weight-500">{{ $t("total") }}</div>
            <div class="price">
              {{
                bookingDetail
                  ? priceDisplay(bookingDetail.amount + totalChange)
                  : priceDisplay(totalPriceSalon)
              }}{{ $t("yen") }}
            </div>
          </div>
        </template>
        <div v-if="route.params?.id" class="mt-20">
          <div class="d-flex justify-content-end status-invoice">
            <el-form-item
              :label="$t('payment_status')"
              label-width="160px"
              :error="errorsForm['status_payment']?.[0]"
            >
              <ClientOnly>
                <el-select
                  v-if="!isBookingWaiting && !isBookingCanceled"
                  v-model="formData.status_payment"
                  :disabled="
                    bookingDetail &&
                    ([
                      PAYMENT_STATUS_BOOKING.PAID,
                      PAYMENT_STATUS_BOOKING.REFUND,
                    ].includes(bookingDetail.status_payment) ||
                      (isCustomerUnPaid &&
                        isPaymentContactless &&
                        isBookingCompleted))
                  "
                >
                  <el-option
                    v-for="status in paymentStatusBookingOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
                <el-select
                  v-else
                  :model-value="formData.status_payment"
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
            <el-form-item label-width="160px" :label="$t('transition_number')">
              <div
                class="text-link text-underline cursor-pointer form-item-time height-40 flex-"
                @click="redirectInvoice"
              >
                {{ bookingDetail?.invoice?.id }}
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import priceDisplay from "~/../../src/shared/utils/price";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import MenuBooking from "~/../../src/front/components/pages/booking/MenuBooking.vue";
import {
  ACCEPTED_CHILDREN,
  ADULT_MAX,
  BOOKING_CREATE_BY_USER,
  CHILD_MAX,
  DATA_CANCEL_FILTER,
  DATA_USER_BOOKING_FILTER,
  RESERVATION_STATUS,
  RESERVATION_TYPE,
  reservationStatusOptions,
  reservationTypeOptions,
} from "~/../../src/shared/constants/reservation";
import InputNumber from "~/../../src/shared/components/input/InputNumber.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonBlue from "~/../../src/shared/components/button/ButtonBlue.vue";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";

import moment from "moment";
import { useMeStore } from "~/../../src/shared/stores/me";
import { CategorySeat, Course } from "~/../../src/store/models";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import CourseRequest from "~/../../src/shared/requests/CourseRequest";
import { bookingRules } from "~/../../src/store/validates/booking";
import { FormInstance } from "element-plus";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { useRoute, useRouter } from "#imports";
import {
  PAYMENT_STATUS_BOOKING,
  PAYMENT_TYPE,
  paymentStatusBookingOptions,
} from "~/../../src/shared/constants";
import {
  createSuccess,
  messageError,
  messageSuccess,
  noReserveBooking,
  toastApproveBooking,
  updateError,
  updateSuccess,
  messageWarning,
} from "~/../../src/shared/utils/notification";
import { BookingDetail } from "~/../../src/store/models/reservation";
import {
  getCurrentTimeBooking,
  getTimeArray,
  totalPriceBooking,
  wrapArrayMenu,
  formatValuePrice,
} from "~/../../src/shared/utils";
import { useReservation } from "~/../../src/store/store/useReservation";
import { Appearance } from "~/../../src/store/constants";
import {
  COURSE_STORE_BOOKING,
  MENU_STORE_BOOKING,
  PEOPLE_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  STAFF_STORE_BOOKING,
  COUPON_STORE_BOOKING,
} from "~/../../src/shared/constants/typeStore";
import { Menu, MenuCategory } from "~/../../src/front/models";
import CategoryRequest from "~/../../src/shared/requests/CategoryRequest";
import { StaffInterface } from "~/../../src/shared/models";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { CouponInterface } from "~/src/shared/models";
import { MAX_LENGTH_COUPON_CODE } from "~/../../src/shared/utils/validate";
import { roundPrice } from "~/../../src/shared/utils";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { dataRemind } from "~/../../src/shared/constants/booking";
import { PaymentMethod } from "~/../../src/shared/constants";

const { t } = i18n.global;
const meStore = useMeStore();
const router = useRouter();
const route = useRoute();

const { rules } = bookingRules();
const _formRef = ref();
const courses = ref<Course[]>([]);
const categoriesSeat = ref<CategorySeat[]>([]);
const timeout = ref();
const noData = ref(t("no_data"));
const errorsForm = ref({});
const chooseCourse = ref(null);
const minTime = ref("");
const isInvalidTime = ref(false);
const isLoadingCategoriesSeat = ref(false);
const isLoadingBooking = ref(false);
const bookingDetail = ref<BookingDetail | null>(null);
const isLoadingApprove = ref(false);
const isLoadingSave = ref(false);
const isLoadingVisited = ref(false);
const isMounted = ref(false);
const timeRanger = ref([]);
const courseFilterDateTimeSelect = ref<Course[]>([]);
const isErrorOrderTime = ref(false);
const reservationStore = useReservation();
const categoryList = ref<MenuCategory[]>([]);
const staffList = ref<StaffInterface[]>([]);
const arrIdMenuActive = ref([]);
const arrMenuActive = ref<Menu[]>([]);
const isLoadingStaff = ref(false);
const chooseStaff = ref<StaffInterface | null>(null);
const arrCategorySelected = ref([]);
const isLoadingRefund = ref(false);
//coupon
const formCheckCoupon = reactive({
  coupon_code: "",
  course_id: 0,
  order_first_name: "",
  order_last_name: "",
  date_select: "",
  time_select: "",
  order_phone_number: "",
});
const couponSelected = ref<CouponInterface | null>(null);
const isLoadingCheckCoupon = ref(false);
const errorSeat = ref("");
const errorCoupon = ref("");
const disabledButton = ref(false);
const errorStaff = ref("");

const formData = reactive({
  order_time: "",
  number_adult: 1,
  number_children: 0,
  course_id: null,
  seat_type_id: null,
  order_first_name: "",
  order_last_name: "",
  order_email: "",
  order_phone_number: "",
  order_memo: "",
  dateSelect: "",
  timeSelect: "",
  status_payment: null,
  staff_id: null,
  coupon_code: "",
  incurred_amount: 0,
  invoice: {},
});

const disabledDate = (time: Date) => {
  const weekDayNumber = moment(time).weekday();
  const isValidDate =
    moment(time).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD") ||
    (chooseCourse.value &&
      !chooseCourse.value?.day_works?.includes(weekDayNumber)) ||
    !meStore.getOpeningTimeStore?.some(
      (item) => item.day_of_week === weekDayNumber
    ) ||
    meStore.getClosingTimeStore?.some(
      (item) => item.day_off === moment(time).format("YYYY-MM-DD")
    ) ||
    moment(time).isAfter(moment().add(2, "months"));

  if (!isValidDate && !formData.dateSelect) {
    formData.dateSelect = moment(time).format("YYYY-MM-DD");
  }
  return isValidDate;
};

const handleChangeDate = async () => {
  minTime.value = "";
  isInvalidTime.value = false;
  formData.timeSelect = "";
  timeRanger.value = [];
  formData.course_id = null;
  chooseCourse.value = null;
  isErrorOrderTime.value = false;
  errorSeat.value = "";

  // get array time
  getTimeDateSelected(formData.dateSelect);

  if (
    moment(formData.dateSelect).format("YYYY/MM/DD") ===
    moment().format("YYYY/MM/DD")
  ) {
    minTime.value = getCurrentTimeBooking();
  }

  if (formData.dateSelect && formData.timeSelect) {
    await getStaffBooking();
  }
  await handleFocusOutCoupon();
};

const handleChangeTimeSelect = async () => {
  if (formData.timeSelect) {
    formData.course_id = null;
    chooseCourse.value = null;
    isErrorOrderTime.value = false;
    isInvalidTime.value = false;
    errorSeat.value = "";
  }
  if (formData.dateSelect && formData.timeSelect) {
    await getStaffBooking();
  }
  await handleFocusOutCoupon();
};

const handleChangeCourse = async () => {
  chooseCourse.value = courses.value.find(
    (item) => item.id === formData.course_id
  );

  if (!chooseCourse.value) {
    chooseCourse.value = null;
  }

  if (chooseCourse.value?.accepted_children === ACCEPTED_CHILDREN.NONE) {
    formData.number_children = 0;
  }

  await getStaffBooking();
  await handleFocusOutCoupon();
};

const handleChangeStaff = () => {
  chooseStaff.value = staffList.value.find(
    (item) => item.id === formData.staff_id
  );
};

const handleChangeMenu = async (value) => {
  arrMenuActive.value = [];
  arrIdMenuActive.value = JSON.parse(JSON.stringify(value));
  categoryList.value.forEach((category) => {
    category.menus.forEach((menu) => {
      value.includes(menu.id) && arrMenuActive.value.push(menu);
    });
  });
  await getStaffBooking();
};

const getStaffBooking = async () => {
  if (typeStore.value !== SALON || bookingDetail.value) return false;

  formData.staff_id = null;
  chooseStaff.value = null;
  try {
    isLoadingStaff.value = true;
    const obj = {
      all: true,
      store_id: meStore.info?.store?.id,
      course_id: chooseCourse.value?.id || null,
      order_time: `${formData.dateSelect} ${formData.timeSelect}`.trim(),
    };
    const paramObj = new URLSearchParams(obj).toString();
    const paramMenu = arrIdMenuActive.value
      .map((item) => `menu_ids[]=${item}`)
      .join("&");
    const paramsUrl = `${paramObj}&${paramMenu}`;
    staffList.value = [];
    const dataResponse = (
      await BookingRequest.getStaffBooking<StaffInterface[]>(paramsUrl)
    )?.data;
    staffList.value = dataResponse;
    errorStaff.value = "";
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      errorStaff.value = error?.response?._data?.message;
    }
  } finally {
    isLoadingStaff.value = false;
  }
};

const handleReservationConfirm = async () => {
  isLoadingApprove.value = true;
  const response = (
    await BookingRequest.approveBooking<BookingDetail>(+route.params?.id)
  ).data;
  bookingDetail.value = response;
  formData.status_payment = bookingDetail.value.status_payment;
  toastApproveBooking();
  await meStore.updateTotalWaiting();
  isLoadingApprove.value = false;
};

const handleBooking = async (form: FormInstance | undefined) => {
  errorsForm.value = {};
  isInvalidTime.value = !(formData.dateSelect && formData.timeSelect);
  formData.order_time = `${formData.dateSelect} ${formData.timeSelect}`.trim();
  if (!form) return;
  await form.validate(async (valid) => {
    if (disabledButton.value) {
      return true;
    }
    if (valid && !isInvalidTime.value) {
      switch (typeStore.value) {
        case RESTAURANT:
          break;
        case SALON:
          if (!formData.course_id && !arrIdMenuActive.value.length) {
            messageError(t("choose_course_menu"));
            return false;
          }
          break;
      }
      try {
        let data = {};
        switch (typeStore.value) {
          case RESTAURANT:
            if (!formData.seat_type_id) {
              formData.seat_type_id = categoriesSeat.value?.[0]?.id;
            }
            data = {
              ...formData,
              coupon_code: errorCoupon.value ? null : formData.coupon_code,
              store_id: meStore.info?.store?.id,
              booking_user_id: meStore.getUserId,
              status: chooseCourse.value.payment_type,
              amount: total.value,
              payment_type: PAYMENT_TYPE.CASH,
            };
            break;
          case SALON:
            if (staffList.value.length === 0) {
              return true;
            }
            data = {
              ...formData,
              store_id: meStore.info?.store?.id,
              booking_user_id: meStore.getUserId,
              status: chooseCourse.value?.payment_type || null,
              amount: totalPriceSalon.value,
              payment_type: PAYMENT_TYPE.CASH,
              menu_ids: arrIdMenuActive.value,
            };
            break;
        }

        isLoadingBooking.value = true;
        await BookingRequest.post(data);
        createSuccess();
        reservationStore.setAppearance(Appearance.list);
        await router.push({ name: "reservation" });
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
          if (errorsForm.value["order_time"]?.[0]) {
            isErrorOrderTime.value = true;
          }
        }
        if (e.response.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response?._data?.message);
        }
      } finally {
        isLoadingBooking.value = false;
      }
    }
  });
};

const handleFocusOutCoupon = async () => {
  if (meStore.getStoreType === SALON) {
    return true;
  }
  if (!formData.coupon_code) {
    errorCoupon.value = "";
    couponSelected.value = null;
  }
  if (
    formData.coupon_code &&
    formData.order_last_name &&
    formData.order_first_name &&
    formData.dateSelect &&
    formData.timeSelect &&
    formData.order_phone_number &&
    formData.course_id &&
    (formCheckCoupon.coupon_code !== formData.coupon_code ||
      formCheckCoupon.course_id !== formData.course_id ||
      formCheckCoupon.date_select !== formData.dateSelect ||
      formCheckCoupon.time_select !== formData.time_select ||
      formCheckCoupon.order_first_name !== formData.order_first_name ||
      formCheckCoupon.order_last_name !== formData.order_last_name ||
      formCheckCoupon.order_phone_number !== formData.order_phone_number)
  ) {
    couponSelected.value = null;
    formCheckCoupon.coupon_code = formData.coupon_code;
    formCheckCoupon.course_id = formData.course_id || 0;
    formCheckCoupon.order_phone_number = formData.order_phone_number;
    formCheckCoupon.order_first_name = formData.order_first_name;
    formCheckCoupon.order_last_name = formData.order_last_name;
    formCheckCoupon.date_select = formData.dateSelect;
    formCheckCoupon.time_select = formData.timeSelect;
    try {
      isLoadingCheckCoupon.value = true;
      const res = await BookingRequest.checkCouponCourse({
        coupon_code: formData.coupon_code,
        course_id: formData.course_id,
        store_id: meStore?.info?.store?.id,
        order_time: `${formData.dateSelect} ${formData.order_time}`,
        order_phone_number: formData.order_phone_number,
        order_first_name: formData.order_first_name,
        order_last_name: formData.order_last_name,
      });

      couponSelected.value = res.data.coupon;
      errorCoupon.value = "";
    } catch (e: any) {
      if (e.response.status === STATUS_CODE.BAD_REQUEST) {
        errorCoupon.value = e.response?._data?.message;
        messageWarning((errorCoupon.value = e.response?._data?.message));
      }
    } finally {
      isLoadingCheckCoupon.value = false;
    }
  }
};

const handleFocusOutNumberAdult = () => {
  if (!formData.number_adult) {
    formData.number_adult = 1;
  }
};

const handleUpdateBooking = async () => {
  try {
    errorsForm.value = {};
    isLoadingSave.value = true;
    bookingDetail.value = (
      await BookingRequest.put<BookingDetail>(+route.params?.id, {
        order_memo: formData.order_memo,
        status_payment: formData.status_payment,
        incurred_amount: Number(
          formatValuePrice(formData.incurred_amount || 0)
        ),
      })
    )?.data;
    updateSuccess();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorsForm.value = e.data.errors;
    } else if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      bookingDetail.value = (
        await BookingRequest.show<BookingDetail>(+route.params?.id as number)
      )?.data;
      formData.status_payment = bookingDetail.value.status_payment;
      messageError(e.response?._data?.message);
    } else {
      updateError();
    }
  } finally {
    isLoadingSave.value = false;
  }
};

const handleRefundBooking = async () => {
  try {
    isLoadingRefund.value = true;
    bookingDetail.value = (
      await BookingRequest.refundBooking<BookingDetail>(+route.params?.id, {
        incurred_amount: Number(
          formatValuePrice(formData.incurred_amount || 0)
        ),
      })
    )?.data;
    formData.status_payment = bookingDetail.value.status_payment;
    updateSuccess();
  } catch (error: any) {
    if (error.response.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error.response?._data.message);
    }
  } finally {
    isLoadingRefund.value = false;
  }
};

const handleVisitedBooking = async () => {
  try {
    errorsForm.value = {};
    isLoadingVisited.value = true;
    bookingDetail.value = (
      await BookingRequest.visitedBooking<BookingDetail>(+route.params?.id, {
        order_memo: formData.order_memo,
        status_payment: formData.status_payment,
      })
    )?.data;
    messageSuccess("success.visited_success");
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorsForm.value = e.data.errors;
    } else {
      messageError("errors.visited_error");
    }
  } finally {
    isLoadingVisited.value = false;
  }
};

const getTimeDateSelected = (date: string) => {
  const dayOfWeekSelected = moment(date).weekday();

  meStore.getOpeningTimeStore?.forEach((item) => {
    if (item.day_of_week === dayOfWeekSelected) {
      timeRanger.value = timeRanger.value
        .concat(getTimeArray(item.start, item.end, 15, "minutes"))
        .sort();
    }
  });
};

const handleChangeNumberAdult = () => {
  nextTick(() => {
    if (!formData.number_adult) {
      formData.number_adult = 0;
    }
  });
};

const handleChangeNumberChildren = () => {
  nextTick(() => {
    if (!formData.number_adult) {
      formData.number_children = 0;
    }
  });
};

const priceAdult = computed(() => {
  if (bookingDetail.value) {
    return (
      (bookingDetail.value.detail.price_adult || 0) *
      (bookingDetail.value.detail.number_adult || 0)
    );
  }
  return (chooseCourse.value?.price || 0) * (formData.number_adult || 0);
});

const priceChildren = computed(() => {
  if (bookingDetail.value) {
    return (
      (bookingDetail.value.detail.price_children || 0) *
      (bookingDetail.value.detail.number_children || 0)
    );
  }
  return (
    (chooseCourse.value?.price_children || 0) * (formData.number_children || 0)
  );
});

const totalChange = computed(() => {
  if (bookingDetail.value) {
    return (
      formatValuePrice(formData.incurred_amount || 0) -
      bookingDetail.value.incurred_amount
    );
  }
  return 0;
});

const total = computed((): number => {
  if (!bookingDetail.value) {
    const totalValue =
      priceAdult.value + priceChildren.value - (couponPrice.value || 0);
    return totalValue <= 0 ? 0 : totalValue;
  }
  return bookingDetail.value.amount + totalChange.value <= 0
    ? 0
    : bookingDetail.value.amount + totalChange.value;
});

const totalPriceSalon = computed(() => {
  const data = {
    arrMenu: arrMenuActive.value,
    staff_fee: chooseStaff.value?.fee || 0,
    course_price: chooseCourse.value?.price || 0,
  };
  if (bookingDetail.value && bookingDetail.value.detail?.request_staff === 0) {
    data.staff_fee = 0;
  }
  return totalPriceBooking(SALON, data);
});

const isBookingTentative = computed(() => {
  return (
    bookingDetail.value &&
    bookingDetail.value.type_course === RESERVATION_TYPE.TENTATIVE
  );
});

const isBookingWaiting = computed(() => {
  return bookingDetail.value?.status === RESERVATION_STATUS.WAITING;
});

const isBookingCanceled = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.CANCEL
);

const isBookingCompleted = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.COMPLETED
);

const isBookingVisited = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.VISITED
);

const isCustomerCreateBooking = computed(
  () => bookingDetail.value?.type_user_create === BOOKING_CREATE_BY_USER
);

const isCustomerPaid = computed(
  () => bookingDetail.value?.status_payment === PAYMENT_STATUS_BOOKING.PAID
);

const isCustomerUnPaid = computed(
  () => bookingDetail.value?.status_payment === PAYMENT_STATUS_BOOKING.UNPAID
);

const isStatusPaymentWaiting = computed(() => {
  return bookingDetail.value?.status_payment === PAYMENT_STATUS_BOOKING.WAITING;
});

const isPaymentCard = computed(
  () => bookingDetail.value?.payment_type === PAYMENT_TYPE.CARD
);

const isPaymentContactless = computed(() => {
  return bookingDetail.value?.payment_type === PAYMENT_TYPE.CONTACTLESS;
});

const typeStore = computed(() => meStore.typeStore);

const couponPrice = computed(() => {
  if (bookingDetail.value) {
    return bookingDetail.value.amount_discount;
  } else if (couponSelected.value) {
    if (couponSelected.value.discount_money) {
      return couponSelected.value.discount_money;
    } else if (couponSelected.value.discount_percent) {
      return roundPrice(
        ((priceAdult.value + priceChildren.value) *
          couponSelected.value.discount_percent) /
          100
      );
    }
  }
  return 0;
});

const filterCourse = (dateSelect, timeSelect) => {
  const weekDayNumber = moment(dateSelect).weekday();
  return courses.value.filter(
    (item) =>
      item.day_works.includes(weekDayNumber) &&
      moment(timeSelect, "HH:mm").isBetween(
        moment(item.start_time, "HH:mm:ss"),
        moment(item.end_time, "HH:mm:ss"),
        "seconds",
        "[]"
      )
  );
};

watch(
  () => [formData.dateSelect, formData.timeSelect],
  ([dateSelect, timeSelect]) => {
    //Clear validate after reset data order_time
    timeout.value = setTimeout(() => {
      _formRef.value?.clearValidate(["course_id"]);
      _formRef.value?.clearValidate(["order_time"]);
      isInvalidTime.value = false;
    }, 50);
    courseFilterDateTimeSelect.value = filterCourse(dateSelect, timeSelect);
  }
);

watch(
  () => [
    formData.course_id,
    formData.number_adult,
    formData.dateSelect,
    formData.timeSelect,
  ],
  async ([value1, value2, value3, value4]) => {
    if (typeStore.value === SALON) return false;
    //Clear validate
    if (value3 && value4) {
      timeout.value = setTimeout(() => {
        _formRef.value?.clearValidate(["order_time"]);
      }, 50);
    }
    if (value1 && value2 && value3 && value4 && meStore.info?.store?.id) {
      formData.order_time = `${value3} ${value4}`;
      try {
        isLoadingCategoriesSeat.value = true;
        formData.seat_type_id = null;
        categoriesSeat.value =
          (
            await BookingRequest.getCategoryBooking<CategorySeat[]>({
              store_id: meStore.info?.store?.id,
              course_id: value1,
              number_adult: value2,
              order_time: formData.order_time,
            })
          )?.data || [];
        errorSeat.value = "";
        disabledButton.value = false;
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.BAD_REQUEST) {
          errorSeat.value = e.response?._data?.message;
          disabledButton.value = true;
        }
        categoriesSeat.value = [];
      } finally {
        isLoadingCategoriesSeat.value = false;
      }
    }
  }
);

defineExpose({
  handleBooking,
  handleUpdateBooking,
  handleVisitedBooking,
  _formRef,
  isLoadingBooking,
  isLoadingCategoriesSeat,
  isBookingWaiting,
  bookingDetail,
  isLoadingSave,
  isLoadingApprove,
  isBookingCanceled,
  isLoadingVisited,
  isBookingCompleted,
  isBookingVisited,
  isCustomerCreateBooking,
  isCustomerPaid,
  isLoadingCheckCoupon,
  isCustomerUnPaid,
  isPaymentCard,
  isLoadingRefund,
  isStatusPaymentWaiting,
  isPaymentContactless,
  handleRefundBooking,
});

onMounted(async () => {
  try {
    if (meStore.info?.store?.id) {
      if (route.params?.id) {
        bookingDetail.value = (
          await BookingRequest.show<BookingDetail>(+route.params?.id as number)
        )?.data;
        formData.incurred_amount =
          priceDisplay(bookingDetail.value.incurred_amount) || 0;
        formData.seat_type_id = bookingDetail.value.detail?.seat_type_id;
        formData.status_payment = bookingDetail.value.status_payment;
        formData.number_adult = bookingDetail.value?.detail?.number_adult || 0;
        formData.number_children =
          bookingDetail.value?.detail?.number_children || 0;
        formData.order_memo = bookingDetail.value.order_memo;
        formData.coupon_code = bookingDetail.value.coupon_code || "";
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
      } else {
        if (COURSE_STORE_BOOKING.includes(typeStore.value)) {
          courses.value = (
            await CourseRequest.getAllCourseByStore<Course[]>(
              meStore.info?.store?.id
            )
          )?.data;
        }
        if (MENU_STORE_BOOKING.includes(typeStore.value)) {
          categoryList.value = (
            await CategoryRequest.getAllCategoryByStore<MenuCategory[]>(
              meStore.info?.store?.id
            )
          )?.data;
        }
      }
    }
  } catch (e) {
    await router.push({ name: "reservation" });
  } finally {
    isMounted.value = true;
  }
  //Set default timeSelect -> nextTick after have dateSelect
  getTimeDateSelected(formData.dateSelect);
  nextTick(async () => {
    if (formData.dateSelect === moment().format("YYYY-MM-DD")) {
      minTime.value = getCurrentTimeBooking();
      if (timeRanger.value.includes(getCurrentTimeBooking())) {
        formData.timeSelect = getCurrentTimeBooking();
      } else {
        formData.timeSelect = "";
      }
    } else {
      formData.timeSelect = timeRanger.value?.[0] ?? "";
    }

    if (STAFF_STORE_BOOKING.includes(typeStore.value)) {
      await getStaffBooking();
    }
  });
});

const redirectInvoice = () => {
  router.push(`/invoices/edit/${bookingDetail.value?.invoice?.id}`);
};
</script>

<style scoped lang="scss">
@use "~/../../src/store/assets/scss/variables.scss" as *;

.booking-form {
  .line-height-20 {
    line-height: 20px;
  }

  .height-40 {
    height: 40px;
    line-height: 40px;
  }

  :deep(.form-item-time) {
    .el-form-item__content {
      flex-direction: column;
      align-items: flex-start;
    }

    .group-time-select {
      gap: 12px;
    }
  }

  .group-order-time {
    gap: 12px;
  }

  .notice {
    padding: 24px;
    background-color: #ecf2fe;
    font-size: 16px;
    line-height: 24px;

    .el-button {
      background-color: #4256d0;
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
    gap: 96px;

    .left {
      width: 50%;

      .other-information {
        padding-bottom: 8px;
        border-bottom: 1px solid $gray-400;
        margin-bottom: 20px;
        font-size: 16px;
      }

      .full-name {
        .name {
          gap: 24px;

          & > div {
            flex: 1;
          }
        }
      }

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

          .input-number-member {
            .el-input {
              width: 135px;
            }
          }

          .member-label {
            max-width: 80px;
            min-width: 30px;
            width: 100%;
            padding-top: 10px;
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
        font-size: 16px;
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
        gap: 10px;

        .price {
          font-weight: 500;
          font-size: 16px;
          line-height: 26px;
          flex: 0 0 185px;
          text-align: right;
        }

        .custom-input {
          .custom-input-price {
            width: 100px;
          }
        }

        &.coupon {
          color: $red-100;
        }
      }

      .total {
        padding-top: 20px;
      }

      .status-invoice {
        :deep(.el-select) {
          .el-input {
            height: 40px;
          }
        }

        .el-form-item {
          flex-basis: 52%;

          .el-form-item__content {
            line-height: 40px;
            height: 40px;
          }
        }
      }
    }
  }
}
</style>
