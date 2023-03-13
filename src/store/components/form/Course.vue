<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      :rules="formCourseRules"
      :model="formCourse"
      class="form-course"
    >
      <el-form-item :label="$t('store.publication_status')" prop="status">
        <el-radio-group v-model="formCourse.status" class="ml-4">
          <el-radio
            v-for="item in DATA_STATUS_TYPE"
            :key="item.id"
            :label="item.id"
            size="large"
            >{{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('store.course_name')"
        :error="errorData?.name?.[0]"
        prop="name"
      >
        <input-text
          v-model="formCourse.name"
          class="input-name"
          :maxlength="MAX_LENGTH_COURSE_NAME"
        />
      </el-form-item>
      <el-form-item :label="$t('front.course_content')" prop="contents">
        <el-input
          v-model="formCourse.contents"
          type="textarea"
          :rows="3"
          :maxlength="MAX_LENGTH_COURSE_DESCRIPTION"
        />
      </el-form-item>
      <el-form-item :label="$t('unit_price')" prop="price">
        <div class="custom-price">
          <input-price v-model="formCourse.price" :max-price="MAX_PRICE" />
          <span>({{ $t("tax_include") }})</span>
        </div>
      </el-form-item>
      <el-form-item
        v-if="store?.model_has_type?.type_id === RESTAURANT"
        :label="$t('accepted_children')"
        prop="accepted_children"
      >
        <el-radio-group
          v-model="formCourse.accepted_children"
          class="ml-4"
          @change="handleChange"
        >
          <el-radio
            v-for="item in DATA_ACCEPTED_CHILDREN"
            :key="item.id"
            :label="item.id"
            size="large"
            >{{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="store?.model_has_type?.type_id === RESTAURANT"
        ref="_refChildren"
        :label="$t('price_children')"
        prop="price_children"
      >
        <div class="custom-price">
          <input-price
            v-model="formCourse.price_children"
            :disabled="formCourse.accepted_children === ACCEPTED_CHILDREN.NONE"
            :max-price="MAX_PRICE"
          />
          <span>({{ $t("tax_include") }})</span>
        </div>
      </el-form-item>
      <el-form-item
        v-if="storeData.getTypeStore !== SALON"
        :label="$t('store.number_of_item')"
        prop="product_number"
      >
        <div class="custom-price">
          <input-number-text
            v-model="formCourse.product_number"
            :max="MAX_LENGTH_COURSE_ITEM"
          />
          <span>{{ $t("product") }} </span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('image')" prop="image">
        <input-file
          v-loading="loadingAvatar"
          :data="formCourse.image"
          :limit="limitImage"
          @handle-remove-image="handleRemove"
          @handle-change-image="handleImageChange"
        />
        <ImageTextDescription />
      </el-form-item>
      <el-form-item
        v-if="storeData.getTypeStore === RESTAURANT"
        :label="$t('course_type')"
        prop="course_type"
      >
        <el-radio-group v-model="formCourse.course_type" class="ml-4">
          <el-radio
            v-for="item in DATA_COURSE_TYPE"
            :key="item.id"
            :label="item.id"
            size="large"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('reservation_type')" prop="payment_type">
        <el-radio-group v-model="formCourse.payment_type" class="ml-4">
          <el-radio
            v-for="item in dataReservation"
            :key="item.value"
            :label="item.value"
            size="large"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
        <p v-if="store?.model_has_type?.type_id === SALON">
          {{ $t("note_add_menu_and_course") }}
        </p>
      </el-form-item>
      <el-form-item :label="$t('store.reception_day')" prop="day_works">
        <ClientOnly>
          <el-checkbox-group v-model="formCourse.day_works">
            <el-checkbox v-for="day in DATA_DAY" :key="day.id" :label="day.id">
              {{ day.name }}
            </el-checkbox>
          </el-checkbox-group>
        </ClientOnly>
      </el-form-item>
      <el-form-item :label="$t('store.reception_time')" prop="amStartEndTime">
        <client-only>
          <InputTimeRanger
            v-model:start-time="formCourse.start_time"
            v-model:end-time="formCourse.end_time"
          />
        </client-only>
      </el-form-item>

      <el-form-item :label="$t('store.stay_time')">
        <div class="stay-time">
          <ClientOnly>
            <el-select
              v-model="formCourse.hour"
              placeholder=" "
              :teleported="false"
              @change="handleChangeHour"
            >
              <el-option
                v-for="(timeValue, key) in dataHour"
                :key="key"
                :label="timeValue"
                :value="timeValue"
              />
            </el-select>
          </ClientOnly>
          <span class="text text-hour">{{ $t("hour") }}</span>
          <ClientOnly>
            <el-select
              v-model="formCourse.minute"
              placeholder=" "
              :teleported="false"
            >
              <el-option
                v-for="(timeValue, key) in dataMinute"
                :key="key"
                :disabled="disableMinute(timeValue)"
                :label="timeValue"
                :value="timeValue"
              />
            </el-select>
          </ClientOnly>
          <span class="text">{{ $t("minute") }}</span>
        </div>
      </el-form-item>

      <el-form-item :label="$t('store.number_reverse')">
        <div class="people-number">
          <input-number-text
            v-model="formCourse.min_capacity"
            :max="formCourse.max_capacity || MAX_PEOPLE"
          />
          <span class="text">{{ $t("man") }}</span>
          <div class="middle">～</div>
          <input-number-text
            v-model="formCourse.max_capacity"
            :min="formCourse.min_capacity"
            :max="MAX_PEOPLE"
          />
          <span class="text">{{ $t("man") }}</span>
        </div>
      </el-form-item>
      <el-form-item v-if="id" :label="$t('created_at')">
        <el-input
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCourse.created_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
      <el-form-item v-if="id" :label="$t('updated_at')">
        <el-input
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCourse.updated_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
      <el-form-item v-if="storeData.getTypeStore === SALON" label=" ">
        <div>{{ $t("store.explain_course_staff") }}</div>
      </el-form-item>
      <el-form-item
        v-if="storeData.getTypeStore === SALON"
        :label="$t('applicable_staff')"
        class="applicable_staff"
        :error="getError('staff')"
        prop="applicable_staff"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formCourse.apply_all_staff"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll"
          />
        </div>
        <div v-if="!formCourse.apply_all_staff" class="list-staff">
          <div
            v-for="(item, index) in formCourse.staff_ids"
            :key="index"
            class="select-staff"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="$t('placeholder.applicable_staff')"
              >
                <el-option
                  v-for="staff in dataStaff"
                  :key="staff.id"
                  :value="staff.id"
                  :label="staff.name"
                  :disabled="disabledStaff(staff.id, item.id)"
                />
              </el-select>
            </client-only>
            <div class="delete-staff" @click="deleteItem(index)">
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formCourse.staff_ids.length < dataStaff.length"
            class="add-staff"
            @click="addItem"
          >
            <IconAddTime />
            <span>{{ $t("applicable_staff") }}</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <ConfirmPlan
      :dialog-visible="isShowModalPlanConfirm"
      @handle-close="handleCloseModalPlan"
      @handle-confirm="handleConfirmModalPlan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, watch } from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import courseRules from "../../validates/course";
import { formatDate } from "../../../shared/utils/format";
import {
  MAX_LENGTH_COURSE_ITEM,
  MAX_PRICE,
  MAX_MINUTE,
  MAX_HOUR,
  MAX_LENGTH_COURSE_NAME,
  MAX_LENGTH_COURSE_DESCRIPTION,
} from "../../../shared/utils/validate";
import {
  DATA_STATUS_TYPE,
  reservationTypeOptions,
  DATA_DAY,
  DATA_ACCEPTED_CHILDREN,
  ACCEPTED_CHILDREN,
  DATA_COURSE_TYPE,
  COURSE_TYPE,
} from "../../../shared/constants/reservation";
import fileRequest from "../../../shared/requests/FileRequest";
import MODEL_TYPE from "../../../shared/constants/modelType";
import CourseRequest from "../../../shared/requests/CourseRequest";
import InputText from "../../../shared/components/input/InputText";
import InputNumberText from "../../../shared/components/input/InputNumberText";
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import moment from "moment";
import { Course, StoreStepActive } from "~/../../src/store/models";
import InputTimeRanger from "../../../shared/components/input/TimeRanger.vue";
import InputFile from "../../../shared/components/input/File";
import InputPrice from "../../../shared/components/input/Price.vue";
import { MAX_PEOPLE } from "~/../../src/shared/constants";
import {
  updateSuccess,
  updateError,
  createError,
  createSuccess,
  uploadImageError,
  messageError,
} from "~/../../src/shared/utils/notification";
import { formatValuePrice } from "~/../../src/shared/utils/price";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import { getHourAllDay, getMinuteAllDay } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import { StaffInterface } from "~/../../src/shared/models";
import StaffRequest from "~/../../src/shared/requests/StaffRequest";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  id?: number;
}

const dataReservation = reservationTypeOptions.filter((item) => {
  if (item.value) {
    return item;
  }
});

const _refChildren = ref(null);
const authStore = useAuthStore();
const storeData = useMeStore();
const store = storeData.info?.store;
const props = defineProps<Prop>();
const loadingAvatar = ref(false);
const { id } = toRefs(props);
const limitImage = ref(storeData.getMaxImageByPlan || 1);
const emits = defineEmits(["changeLoadingData"]);
const router = useRouter();
const formRef = ref(null);
const errorData = ref({});
const { formCourse, formCourseRules } = courseRules();
const dataHour = ref<number[]>([]);
const dataMinute = ref<number[]>([]);
dataHour.value = getHourAllDay();
dataMinute.value = getMinuteAllDay;
const loading = ref(false);
const image_ids = ref([]);
const isShowModalPlanConfirm = ref(false);
const dataStaff = ref<StaffInterface[]>([]);
const lengthImageUpdate = ref(0);

const disabledStaff = (id: number, itemId: number) => {
  return formCourse.staff_ids.some(
    (staffItem: StaffInterface) =>
      staffItem.id === id && itemId !== staffItem.id
  );
};

const getError = (field: string) => {
  return errorData.value?.[field]?.[0];
};

const handleClickAll = (value: boolean) => {
  formCourse.staff_ids = [{}];
};

const deleteItem = (index: number) => {
  formCourse.staff_ids.splice(index, 1);
};

const addItem = () => {
  formCourse.staff_ids.push([]);
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const getDataStaff = async () => {
  dataStaff.value = (
    await StaffRequest.list<StaffInterface[]>({ all: true })
  )?.data;
};

const handleChange = () => {
  if (formCourse.accepted_children === ACCEPTED_CHILDREN.NONE) {
    _refChildren.value.clearValidate();
    formCourse.price_children = null;
  }
};

const handleRemove = async (file, fileList) => {
  formCourse.image = fileList;
  if (file.id) {
    const index = image_ids.value.indexOf(file.id);
    image_ids.value.splice(index, 1);
    if (!id.value) {
      // try {
      //   await fileRequest.delete(file.id);
      // } catch (error) {
      //   removeImageError();
      // }
    }
  }
};

const handleImageChange = async (file: any, fileList: []) => {
  formCourse.image = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  body.append("model_type", MODEL_TYPE.COURSE);
  if (lengthImageUpdate.value <= image_ids.value.length) {
    formCourse.image.pop();
    isShowModalPlanConfirm.value = true;
    return;
  }
  try {
    loadingAvatar.value = true;
    const data = await fileRequest.post(body);
    image_ids.value.push(data.data.id);
    const index = fileList.findIndex((item) => item.uid === file.uid);
    fileList[index].id = data.data.id;
  } catch (error) {
    uploadImageError();
    formCourse.image.pop();
  } finally {
    loadingAvatar.value = false;
  }
};

const createCourse = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        const body = getBody();
        await CourseRequest.post(body);
        await getStepSetting();
        await router.push("/store/course");
        createSuccess();
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        if (error.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = error?.data?.errors;
          createError();
        } else if (error.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          createError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

const getBody = () => {
  let stay_time = 0;
  if (formCourse.hour) {
    stay_time += formCourse.hour * 60;
  }
  if (formCourse.minute) {
    stay_time += formCourse.minute;
  }
  return {
    store_id: formCourse.store_id,
    name: formCourse.name,
    price: +formatValuePrice(formCourse.price),
    price_children:
      formCourse.accepted_children === ACCEPTED_CHILDREN.HAVE
        ? +formatValuePrice(formCourse.price_children)
        : null,
    contents: formCourse.contents,
    min_capacity: formCourse.min_capacity,
    max_capacity: formCourse.max_capacity,
    product_number: formCourse.product_number,
    image_ids: image_ids.value,
    start_time:
      formCourse.start_time === "24:00" ? "23:59" : formCourse.start_time,
    end_time: formCourse.end_time === "24:00" ? "23:59" : formCourse.end_time,
    day_works: formCourse.day_works,
    payment_type: formCourse.payment_type,
    stay_time: stay_time === 0 ? null : stay_time,
    status: formCourse.status,
    accepted_children: formCourse.accepted_children,
    staff_ids: getStaff(),
    course_type: formCourse.course_type,
  };
};
//TODO id

const getStaff = () => {
  const array: number[] = [];
  if (formCourse.apply_all_staff) {
    dataStaff.value.forEach((item: StaffInterface) => {
      if (item.id) {
        array.push(item.id);
      }
    });
  } else {
    formCourse.staff_ids.map((item: StaffInterface) => {
      if (item.id) {
        array.push(item.id);
      }
    });
  }
  return array;
};
const detailCourse = async () => {
  try {
    loading.value = true;
    const data = (await CourseRequest.show(id.value)).data as Course;
    formCourse.created_at = data?.created_at;
    formCourse.updated_at = data.updated_at;
    formCourse.status = data.status;
    formCourse.payment_type = data.payment_type;
    formCourse.start_time =
      data.start_time === "23:59:00" ? "24:00" : getTime(data.start_time);
    formCourse.end_time =
      data.end_time === "23:59:00" ? "24:00" : getTime(data.end_time);
    formCourse.contents = data.contents;
    formCourse.max_capacity = data.max_capacity;
    formCourse.min_capacity = data.min_capacity;
    formCourse.name = data.name;
    formCourse.store_id = data.store_id;
    formCourse.product_number = data.product_number;
    formCourse.price = priceDisplay(data.price);
    formCourse.price_children = priceDisplay(data.price_children);
    formCourse.day_works = data.day_works;
    formCourse.accepted_children = data.accepted_children;
    const { imageGet, dataImage } = changeDataImage(data.model_has_file);
    const { hour, minute } = getHour(data.stay_time);
    lengthImageUpdate.value += data.model_has_file.length;
    formCourse.hour = hour;
    formCourse.minute = minute;
    formCourse.image = imageGet;
    formCourse.course_type = data.course_type;
    image_ids.value = dataImage;
    formCourse.apply_all_staff = checkAllStaff(data.staffs);
    formCourse.staff_ids = !formCourse.apply_all_staff
      ? data.staffs?.map((item: StaffInterface) => {
          return {
            id: item.staff_id,
          };
        }) || []
      : [];
  } catch (_) {
    await router.push({ name: "store-course" });
  } finally {
    loading.value = false;
  }
};

const checkAllStaff = (value: StaffInterface[] = []) => {
  if (dataStaff.value && dataStaff.value.length === value.length) {
    dataStaff.value.forEach((item: StaffInterface) => {
      if (
        !value.includes((itemStaff: any) => {
          return itemStaff.staff_id === item.id;
        })
      ) {
        return false;
      }
    });
    return true;
  }
  return false;
};

const getTime = (time: string) => {
  if (!time) {
    return "";
  }
  const date = moment().format("YYYY-MM-DD");
  return moment(date + " " + time).format("HH:mm");
};

const getHour = (value: number) => {
  let minute = null;
  let hour = null;
  if (!value) {
    return { hour, minute };
  }
  hour = Math.floor(value / 60) ? Math.floor(value / 60) : null;
  minute = value - Number(hour) * 60 ? value - Number(hour) * 60 : null;
  return { hour, minute };
};

const changeDataImage = (image = []) => {
  const imageGet = [];
  const dataImage = [];
  if (image.length !== 0) {
    for (const obj of image) {
      if (obj.file) {
        imageGet.push(obj.file);
        dataImage.push(obj.file.id);
      }
    }
  }
  return { imageGet, dataImage };
};

const editCourse = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        const body = getBody();
        await CourseRequest.put(id.value, body);
        await getStepSetting();
        updateSuccess();
        await router.push("/store/course");
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-course" });
        } else if (error.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = error?.data?.errors;
          updateError();
        } else if (error.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          updateError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

const getMaxImage = async () => {
  const sizeImage = (await StoreRequest.getMaxImage<any>(+store.id)).data;
  lengthImageUpdate.value = sizeImage.master;
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
};

defineExpose({
  editCourse,
  createCourse,
  getStepSetting,
  formRef,
});

onBeforeMount(async () => {
  loading.value = true;
  await getMaxImage();
  if (storeData.getTypeStore === SALON) {
    await getDataStaff();
  }
  if (id?.value) {
    await detailCourse();
  }
  loading.value = false;
});

const handleChangeHour = (value) => {
  if (value === MAX_HOUR && formCourse.minute) {
    formCourse.minute = 0;
  }
};

const disableMinute = (value) => {
  return value > 0 && formCourse.hour === MAX_HOUR;
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-course) {
  width: 780px;
  padding-bottom: 30px;

  .el-form-item {
    .el-form-item__label {
      width: 200px;
      justify-content: flex-start;
    }

    .people-number {
      width: 100%;
      display: flex;
      align-items: center;

      .el-input-number {
        width: 228px;
      }

      .text {
        margin-left: 16px;
        width: 50px;
      }

      .middle {
        margin: 0 22px;
      }
    }

    .image-description {
      width: 100%;
      margin-top: 10px;
      line-height: 20px;

      .text-link {
        color: $blue-50;
        cursor: pointer;
        text-decoration: underline;
      }
    }

    .el-form-item__content {
      .input-name,
      .el-textarea {
        width: 100%;
      }

      .stay-time {
        width: 100%;
        display: flex;
        align-items: center;

        .el-select {
          width: 228px;

          .el-input {
            width: 228px;
          }
        }

        .text {
          margin-left: 8px;
          width: 30px;
        }

        .text-hour {
          margin-right: 32px;
          width: 60px;
        }
      }

      .el-date-editor {
        height: 40px;
      }

      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .date-picker {
        width: 100%;

        .el-input {
          width: 100%;
        }
      }

      .el-textarea {
        min-height: 80px;

        .el-textarea__inner {
          min-height: 80px !important;
        }
      }

      .custom-price {
        display: flex;

        .el-input {
          width: 229px;
          margin-right: 16px;
        }
      }
    }
  }

  .applicable_staff {
    align-items: flex-start;

    :deep(.el-form-item__content) {
      .quantity-customer {
        width: 100%;
      }

      display: block;
    }

    .check-all {
      margin-bottom: 5px;
    }

    .list-staff {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .select-staff {
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

        .delete-staff {
          display: flex;
          cursor: pointer;
          gap: 10px;
          margin-top: 5px;
          align-items: center;
        }
      }

      .add-staff {
        cursor: pointer;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 6px;
        color: $menuBg;
      }
    }
  }
}
</style>
