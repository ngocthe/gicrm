<template>
  <div v-loading="isLoading" class="container-create-coupon">
    <el-form
      ref="_refForm"
      class="form-body"
      label-width="160px"
      label-position="left"
      :model="formCoupon"
      :rules="formCouponRules"
    >
      <el-form-item
        :error="getError('name')"
        prop="name"
        :label="$t('coupon_name')"
      >
        <input-text
          v-model="formCoupon.name"
          :maxlength="MAX_LENGTH_NAME_COUPON"
        ></input-text>
      </el-form-item>
      <el-form-item
        :error="getError('code')"
        prop="code"
        :label="$t('coupon_code')"
      >
        <input-text
          v-model="formCoupon.code"
          :maxlength="MAX_LENGTH_COUPON_CODE"
        ></input-text>
      </el-form-item>
      <el-form-item prop="description" :label="$t('terms_of_use')">
        <input-text
          v-model="formCoupon.description"
          height="80px"
          type="textarea"
          rows="3"
        ></input-text>
      </el-form-item>
      <div class="discount d-flex label-required">
        <div class="label-discount">{{ $t("discount") }}</div>
        <el-radio-group v-model="checkDiscount" @change="handleTypeDiscount">
          <el-radio :label="true">{{ $t("amount_to_yen") }}</el-radio>
          <el-radio :label="false">{{ $t("reservation_amount") }}</el-radio>
        </el-radio-group>
        <el-form-item
          v-if="checkDiscount"
          :error="getError('discount_money')"
          prop="discount_money"
        >
          <InputPrice
            v-model="formCoupon.discount_money"
            :max-price="MAX_PRICE"
          />
        </el-form-item>
        <el-form-item
          v-else
          :error="getError('discount_percent')"
          prop="discount_percent"
        >
          <InputNumberText
            v-model="formCoupon.discount_percent"
            :precision="PRECISION"
            :max="100"
            :accept-null="true"
          />
        </el-form-item>
        <div class="text-tax">({{ $t("tax_include") }})</div>
      </div>
      <div class="group-limit d-flex align-items-center">
        <el-form-item
          class="label-required"
          prop="quantity"
          :label="$t('total_number')"
          :error="getError('quantity')"
        >
          <div class="subject">
            <el-checkbox
              v-model="formCoupon.infinite_quantity"
              :label="$t('unlimited')"
              :false-label="false"
              :true-label="true"
              @click="handleCheckLimit"
            >
            </el-checkbox>
            <input-number-text
              v-if="!formCoupon.infinite_quantity"
              v-model="formCoupon.quantity"
              :max="MAX_PEOPLE_USE_COUPON"
            />
            <div v-if="!formCoupon.infinite_quantity">
              {{ $t("subject_coupon") }}
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="props.update" :label="$t('number_used')">
          <input-text
            v-model="formCoupon.number_used"
            class="number-used"
            disabled
          ></input-text>
          <div>
            {{ $t("subject_coupon") }}
          </div>
        </el-form-item>
      </div>
      <el-form-item
        class="label-required"
        prop="quantity_one_customer"
        :label="$t('store.usage_per_page')"
      >
        <div class="subject">
          <el-checkbox
            v-model="formCoupon.infinite_quantity_customer"
            :label="$t('unlimited')"
            :false-label="0"
            :true-label="1"
            @click="handleCheckLimitCustomer"
          >
          </el-checkbox>
          <input-number-text
            v-if="!formCoupon.infinite_quantity_customer"
            v-model="formCoupon.quantity_one_customer"
            :min="1"
          ></input-number-text>
          <div v-if="!formCoupon.infinite_quantity_customer">
            {{ $t("subject_coupon") }}
          </div>
        </div>
      </el-form-item>
      <el-form-item class="label-required" :label="$t('booking.date_expired')">
        <div class="group-date">
          <el-form-item class="flex-1" prop="start_date">
            <client-only>
              <el-date-picker
                v-model="formCoupon.start_date"
                :disabled-date="disabledDateStart"
                :placeholder="$t('placeholder.start_time_send')"
                :editable="false"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </client-only>
          </el-form-item>
          <el-form-item class="flex-1" prop="end_date">
            <client-only>
              <el-date-picker
                v-model="formCoupon.end_date"
                :disabled-date="disabledDateEnd"
                :placeholder="$t('placeholder.end_time_send')"
                :editable="false"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </client-only>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item prop="status" :label="$t('situation_coupon')">
        <el-radio-group v-model="formCoupon.status">
          <el-radio
            v-for="item in STATUS_COUPON_DATA"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="typeStore === RESTAURANT"
        prop="applicable_course"
        :label="$t('applicable_course')"
        class="applicable_course label-required"
        :error="getError('course_apply')"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formCoupon.apply_all"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll"
          ></el-checkbox>
        </div>
        <div v-if="!formCoupon.apply_all" class="list-courses">
          <div
            v-for="(item, index) in formCoupon.course_apply"
            class="select-courses"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="$t('placeholder.applicable_course')"
              >
                <el-option
                  v-for="course_name_item in courseName"
                  :key="course_name_item.id"
                  :value="course_name_item.id"
                  :label="course_name_item.name"
                  :disabled="
                    formCoupon.course_apply.some(
                      (course) =>
                        course.id === course_name_item.id &&
                        item.id !== course.id
                    )
                  "
                />
              </el-select>
            </client-only>
            <div
              class="delete-course"
              @click="deleteItem(index, 'course_apply')"
            >
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formCoupon.course_apply.length !== courseName.length"
            class="add-course"
            @click="addItem('course_apply')"
          >
            <IconAddTime />
            <span>{{ $t("button.add_course") }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-else
        :label="$t('applicable_event')"
        class="applicable_course label-required"
        :error="getError('event_apply')"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formCoupon.apply_all"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll"
          ></el-checkbox>
        </div>
        <div v-if="!formCoupon.apply_all" class="list-courses">
          <div
            v-for="(item, index) in formCoupon.event_apply"
            class="select-courses"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="$t('placeholder.applicable_event')"
              >
                <el-option
                  v-for="event_name_item in eventName"
                  :key="event_name_item.id"
                  :value="event_name_item.id"
                  :label="event_name_item.name"
                  :disabled="
                    formCoupon.event_apply.some(
                      (event) =>
                        event.id === event_name_item.id && item.id !== event.id
                    )
                  "
                />
              </el-select>
            </client-only>
            <div
              class="delete-course"
              @click="deleteItem(index, 'event_apply')"
            >
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formCoupon.event_apply.length !== eventName.length"
            class="add-course"
            @click="addItem('event_apply')"
          >
            <IconAddTime />
            <span>{{ $t("button.add_event") }}</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-if="props.update" :label="$t('created_at')">
        <input-date
          v-model="formCoupon.created_at"
          :is-disable="true"
          value-format="YYYY年MM月DD日 HH:mm"
          format="YYYY年MM月DD日 HH:mm"
        ></input-date>
      </el-form-item>
      <el-form-item v-if="props.update" :label="$t('updated_at')">
        <input-date
          v-model="formCoupon.updated_at"
          :is-disable="true"
          value-format="YYYY年MM月DD日 HH:mm"
          format="YYYY年MM月DD日 HH:mm"
        ></input-date>
      </el-form-item>
    </el-form>
    <ModalConfirm
      :dialog-visible="isShowModalConfirm"
      :title="$t('title_delete')"
      :name-cancel="$t('button.cancel')"
      :name-confirm="$t('button.confirm')"
      :loading="isLoadingAction"
      @handle-close="handleClose"
      @handle-confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import couponRules from "~/../../src/store/validates/coupon";
import CouponRequest from "~/../../src/shared/requests/CouponRequest";
import CourseRequest from "~/../../src/shared/requests/CourseRequest";
import {
  MAX_PRICE,
  MAX_PEOPLE_USE_COUPON,
} from "~/../../src/shared/utils/validate";
import { STATUS_COUPON_DATA } from "~/../../src/shared/constants/coupon.ts";
import {
  onMounted,
  ref,
  useRoute,
  useRouter,
} from "#imports";
import moment, { now } from "moment";
import { FormInstance } from "element-plus";
import { customTrimValue, formatValuePrice } from "~/../../src/shared/utils";
import {
  createError,
  createSuccess,
  deleteError,
  deleteSuccess,
  messageError,
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { MAX_LENGTH_NAME_COUPON } from "~/../../src/shared/utils/validate";
import { MAX_LENGTH_COUPON_CODE } from "~/../../src/shared/utils/validate";
import { nextTick, watch } from "vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  update: boolean;
}

interface Course {
  id: number;
  name: string;
}
interface Event {
  id: number;
  name: string;
}

const props = withDefaults(defineProps<Prop>(), {
  update: false,
});
const PRECISION = ref(2);
const _refForm = ref();
const { formCoupon, formCouponRules } = couponRules();
const checkDiscount = ref(true);
const courseName = ref([]);
const eventName = ref([]);
const isLoading = ref(false);
const isLoadingAction = ref(false);
const isShowModalConfirm = ref(false);
const route = useRoute();
const router = useRouter();
const errorsForm = ref({});
const allCourse = ref([]);
const allEvent = ref([]);
const typeStore = useMeStore().getTypeStore;

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const responseCoupon = ref();

const handleClickAll = () => {
  if (typeStore === RESTAURANT) {
    formCoupon.course_apply = [{}];
  } else {
    formCoupon.event_apply = [{}];
  }
};

const handleTypeDiscount = () => {
  formCoupon.discount_percent = null;
  formCoupon.discount_money = null;
};

const handleCheckLimit = () => {
  formCoupon.quantity = null;

  if (!formCoupon.infinite_quantity) {
    _refForm.value.clearValidate(["quantity"]);
  } else {
    formCoupon.quantity = null;
  }
};

watch(
  () => [formCoupon.quantity, formCoupon.infinite_quantity],
  async (value, value1) => {
    if (value1) {
      _refForm.value.clearValidate(["quantity_one_customer"]);
    } else if (Number(value) >= Number(formCoupon.quantity_one_customer)) {
      _refForm.value.clearValidate(["quantity_one_customer"]);
    }
  }
);

const handleCheckLimitCustomer = () => {
  if (!formCoupon.infinite_quantity_customer) {
    _refForm.value.clearValidate(["quantity_one_customer"]);
  } else {
    formCoupon.quantity_one_customer = null;
  }
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const deleteRecord = async () => {
  isShowModalConfirm.value = true;
};

const handleConfirm = async () => {
  try {
    isLoadingAction.value = true;
    await CouponRequest.delete(+route.params?.id);
    deleteSuccess();
  } catch (e) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-category" });
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
    await router.push({ name: "store-coupon" });
  }
};

const disabledDateStart = (time: Date) => {
  return (
    moment(time) < moment().subtract(1, "day") ||
    (formCoupon.end_date && moment(time) > moment(formCoupon.end_date))
  );
};

const disabledDateEnd = (time: Date) => {
  return (
    moment(time) < moment().subtract(1, "day") ||
    (formCoupon.start_date &&
      moment().subtract(1, "day") &&
      moment(time).isSameOrBefore(
        moment(formCoupon.start_date).subtract(1, "day")
      ))
  );
};

const addItem = (field: string) => {
  formCoupon[field].push([]);
};

const deleteItem = (index, field: string) => {
  formCoupon[field].splice(index, 1);
};

const formSubmit = ref();
const handleBeforeSubmit = () => {
  formSubmit.value = JSON.parse(JSON.stringify(formCoupon));

  if (typeStore === RESTAURANT) {
    delete formSubmit.value["event_apply"];
    const courseList: any[] = [];
    formCoupon.course_apply.forEach((item) => {
      if (item.id) {
        courseList.push(item.id);
      }
    });

    if (formCoupon.apply_all) {
      formSubmit.value.course_apply = allCourse.value;
    } else {
      if (courseList.length === allCourse.value.length) {
        formSubmit.value.apply_all = true;
      }
      formSubmit.value.course_apply = courseList.length ? courseList : null;
    }
  } else {
    delete formSubmit.value["course_apply"];
    const eventList: any[] = [];
    formCoupon.event_apply.forEach((item) => {
      if (item.id) {
        eventList.push(item.id);
      }
    });
    if (formCoupon.apply_all) {
      formSubmit.value.event_apply = allEvent.value;
    } else {
      if (eventList.length === allEvent.value.length) {
        formSubmit.value.apply_all = true;
      }
      formSubmit.value.event_apply = eventList.length ? eventList : null;
    }
  }

  //Delete param when update
  if (props.update) {
    delete formSubmit.value["updated_at"];
    delete formSubmit.value["created_at"];
    delete formSubmit.value["number_used"];
  }
};

const createOrUpdateCoupon = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        await handleBeforeSubmit();
        isLoadingAction.value = true;
        const price =
          formCoupon?.discount_money !== null
            ? +formatValuePrice(`${formCoupon?.discount_money}`)
            : null;
        if (isUpdate) {
          await CouponRequest.put(+route.params.id as number, {
            ...customTrimValue(formSubmit.value),
            discount_money: price,
          });
          updateSuccess();
        } else {
          await CouponRequest.post({
            ...formSubmit.value,
            discount_money: price,
          });
          createSuccess();
        }
        await router.push({ name: "store-coupon" });
      } catch (error: any) {
        if (error.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = error.data.errors;
          if (isUpdate) {
            updateError();
          } else createError();
        }
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-coupon" });
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

defineExpose({
  createOrUpdateCoupon,
  _refForm,
  isLoadingAction,
  deleteRecord,
});

const getDataResponse = async () => {
  try {
    isLoading.value = true;
    if (route.params?.id) {
      responseCoupon.value = (
        await CouponRequest.show(+route.params?.id as number)
      )?.data;
    }

    if (responseCoupon.value) {
      if (typeStore === RESTAURANT) {
        formCoupon.course_apply = responseCoupon.value.courses.map((item) => ({
          id: item.id,
          name: item.name,
        }));
      } else {
        formCoupon.event_apply = responseCoupon.value.events.map((item) => ({
          id: item.id,
          name: item.name,
        }));
      }

      checkDiscount.value = responseCoupon.value.discount_money !== null;
      formCoupon.discount_money =
        responseCoupon.value.discount_money ||
        responseCoupon.value.discount_money === 0
          ? priceDisplay(responseCoupon.value.discount_money)
          : null;
      formCoupon.discount_percent = responseCoupon.value.discount_percent;
      formCoupon.apply_all = !!responseCoupon.value.apply_all;
      formCoupon.description = responseCoupon.value.description;
      formCoupon.end_date = responseCoupon.value.end_date;
      formCoupon.start_date = responseCoupon.value.start_date;
      formCoupon.infinite_quantity = !!responseCoupon.value.infinite_quantity;
      formCoupon.quantity = responseCoupon.value.quantity;
      formCoupon.name = responseCoupon.value.name;
      formCoupon.code = responseCoupon.value.code;
      formCoupon.status = responseCoupon.value.status;
      formCoupon.created_at = responseCoupon.value.created_at;
      formCoupon.updated_at = responseCoupon.value.updated_at;
      formCoupon.number_used = responseCoupon.value.number_used;
      formCoupon.quantity_one_customer =
        responseCoupon.value.quantity_one_customer;
      formCoupon.infinite_quantity_customer = responseCoupon.value
        .quantity_one_customer
        ? 0
        : 1;
    }
  } catch (_) {
    await router.push({ name: "store-coupon" });
  } finally {
    isLoading.value = false;
  }
};

const getDataCourse = async () => {
  const response = (await CourseRequest.list())?.data.data;
  response.forEach((item: Course) => {
    courseName.value.push({ name: item.name, id: item.id });
    allCourse.value.push(item.id);
  });
};

const getDataEvent = async () => {
  const response = (await EventRequest.list())?.data.data;
  response.forEach((item: Event) => {
    eventName.value.push({ name: item.name, id: item.id });
    allEvent.value.push(item.id);
  });
};

onMounted(async () => {
  isLoading.value = true;
  if (typeStore === RESTAURANT) {
    await getDataCourse();
  } else await getDataEvent();
  await getDataResponse();

  isLoading.value = false;
});
</script>
<style lang="scss" scoped>
@import "~/../../src/store/assets/scss/variables.scss";

.container-create-coupon {
  width: 780px;

  .form-body {
    width: 100%;

    .discount {
      margin-bottom: 10px;

      .label-discount {
        width: 160px;
      }

      :deep(.el-radio-group) {
        margin-right: 12px;
        align-items: flex-start;
        height: 40px;

        .el-radio {
          height: 100%;
        }
      }

      :deep(.el-input) {
        width: 160px;
      }

      :deep(.el-form-item) {
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }

      .text-tax {
        margin-left: 10px;
        margin-top: 7px;
      }
    }

    .subject {
      display: flex;
      gap: 12px;

      .el-checkbox {
        height: 40px;
      }

      div {
        height: 40px;
        line-height: 40px;
      }
    }

    .group-date {
      width: 100%;
      display: flex;
      gap: 12px;
    }

    .group-limit {
      height: 40px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 15px;

      :deep(.number-used) {
        width: 118px;
        margin-right: 12px;
      }

      :deep(.el-form-item) {
        .el-form-item__label {
          align-items: center;
          height: 40px;
        }
      }
    }

    .applicable_course {
      :deep(.el-form-item__content) {
        .quantity-customer {
          width: 100%;
        }

        display: block;
      }

      .check-all {
        margin-bottom: 10px;
      }

      .list-courses {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .select-courses {
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          cursor: pointer;
          margin-top: 12px;
          color: $red-100;
          align-items: center;

          .el-select {
            width: calc(100% - 75px);
          }

          .delete-course {
            display: flex;
            cursor: pointer;
            gap: 10px;
            margin-top: 5px;

            span {
              margin-top: -8px;
            }
          }
        }

        .add-course {
          cursor: pointer;
          margin-top: 12px;
          display: flex;
          gap: 10px;
          color: $menuBg;

          span {
            margin-top: -7px;
          }
        }
      }
    }
  }
}

:deep(.el-date-editor) {
  width: 100%;
  height: 40px;
}

:deep(.el-radio-group) {
  .el-radio:nth-child(1) {
    width: 98px;
    margin-right: 0;
  }
}

:deep(.el-form-item__error){
  white-space: nowrap;
}

:deep(.el-select) {
  .el-input {
    height: 40px;
  }
}

:deep(.label-required) {
  .label-discount::after,
  .el-form-item__label::after {
    content: "*";
    color: var(--el-color-danger);
    margin-left: 4px;
  }
}
</style>
