<template>
  <div v-loading="loading" class="container-event">
    <el-form
      ref="_refForm"
      :model="formEvent"
      :rules="formRuleEvent"
      class="left"
      label-width="160px"
      label-position="left"
    >
      <el-form-item :label="$t('event')" prop="name" :error="getError('name')">
        <input-text
          v-model="formEvent.name"
          :maxlength="MAX_LENGTH_EVENT_NAME"
        ></input-text>
      </el-form-item>
      <el-form-item
        class="company"
        :label="$t('company')"
        :error="getError('description')"
      >
        <input-text
          v-model="formEvent.description"
          :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
          type="textarea"
          :rows="3"
        ></input-text>
      </el-form-item>
      <el-form-item :label="$t('image')" class="image">
        <InputFile
          v-loading="loadingImage"
          :data="image_ids"
          :limit="limitImage"
          :placeholder="$t('store.placeholder_category_description')"
          @handle-remove-image="handleRemoveImage"
          @handle-change-image="handleImageChange"
        />
        <ImageTextDescription />
      </el-form-item>
      <el-form-item
        :label="$t('number_of_people')"
        :error="getError('number_seats')"
      >
        <input-number-text
          v-model="formEvent.number_seats"
          :min="MIN_SEAT_EVENT"
          :max="MAX_SEAT_EVENT"
        ></input-number-text>
        <div class="text-">{{ $t("seat_menu") }}</div>
      </el-form-item>
      <el-form-item
        prop="price"
        :label="$t('booking.fee')"
        :error="getError('price')"
      >
        <input-price v-model="formEvent.price" :max-price="MAX_FEE_EVENT" />
        <el-space size="10px"
          ><div>{{ $t("yen") }}</div>
          <div>({{ $t("tax_include") }})</div>
        </el-space>
      </el-form-item>
      <el-form-item
        prop="end_time"
        class="group-date"
        :label="$t('valid_period')"
      >
        <client-only>
          <el-date-picker
            v-model="formEvent.start_date"
            type="date"
            :placeholder="$t('start_date')"
            :editable="false"
            class="flex-2"
            value-format="YYYY-MM-DD"
            format="YYYY年MM月DD日"
            :disabled-date="disabledDateStart"
          >
          </el-date-picker>
        </client-only>
        <client-only>
          <el-date-picker
            v-model="formEvent.end_date"
            type="date"
            :placeholder="$t('end_date')"
            :editable="false"
            class="flex-2"
            value-format="YYYY-MM-DD"
            format="YYYY年MM月DD日"
            :disabled-date="disabledDateEnd"
          >
          </el-date-picker>
        </client-only>
      </el-form-item>
      <el-form-item :label="$t('front.business_hour')">
        <TimeRanger
          v-model:start-time="formEvent.opening_time"
          v-model:end-time="formEvent.closing_time"
        />
      </el-form-item>
      <el-form-item :label="$t('place')">
        <input-text v-model="formEvent.place"></input-text>
      </el-form-item>
      <el-form-item
        prop="online_link"
        :label="$t('online_link')"
        :error="getError('online_link')"
      >
        <input-text
          v-model="formEvent.online_link"
          class="input-link"
        ></input-text>
        <ButtonLightBlue
          :loading="loadingZoom"
          :name="$t('zoom_meeting_automatic_issue')"
          class="zoom-button"
          @click="generateLinkHandle()"
        ></ButtonLightBlue>
      </el-form-item>
      <el-form-item prop="reservation_type" :label="$t('reservation_type')">
        <el-radio-group
          v-for="item in reservationTypeOptions"
          :key="item.value"
          v-model="formEvent.reservation_type"
        >
          <el-radio :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('posting_status')">
        <el-checkbox
          v-model="formEvent.published"
          :label="$t('publish')"
          :true-label="STATUS_TYPE.PUBLIC"
          :false-label="STATUS_TYPE.PRIVATE"
        ></el-checkbox>
      </el-form-item>
      <el-form-item v-if="props.update" :label="$t('created_at')">
        <input-date
          v-model="formEvent.created_at"
          :is-disable="true"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        ></input-date>
      </el-form-item>
      <el-form-item v-if="props.update" :label="$t('updated_at')">
        <input-date
          v-model="formEvent.updated_at"
          :is-disable="true"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY-MM-DD HH:mm"
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
    <ConfirmPlan
      :dialog-visible="isShowModalPlanConfirm"
      @handle-close="handleCloseModalPlan"
      @handle-confirm="handleConfirmModalPlan"
    />
  </div>
</template>
<script lang="ts" setup>
import InputFile from "~/../../src/shared/components/input/File.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import {
  reservationTypeOptions,
  STATUS_TYPE,
} from "~/../../src/shared/constants/reservation";
import {
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_EVENT_NAME,
  MIN_SEAT_EVENT,
  MAX_SEAT_EVENT,
  MAX_FEE_EVENT,
} from "~/../../src/shared/utils/validate";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import { onMounted, reactive, ref } from "vue";
import { DataFile } from "~/../../src/shared/models";

import eventRules from "~/../../src/store/validates/event";
import moment from "moment/moment";
import {
  createError,
  createSuccess,
  deleteError,
  deleteSuccess,
  messageError,
  updateError,
  updateSuccess,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import { useRouter } from "nuxt/app";
import { FormInstance } from "element-plus";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import { useRoute } from "#imports";
import { customTrimValue, formatValuePrice } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { DEFAULT_LENGTH_MEETING } from "~/../../src/shared/utils/validate";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import storeRequest from "~/../../src/shared/requests/StoreRequest";

interface Prop {
  update: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  update: false,
});
const _refForm = ref();
const { formEvent, formRuleEvent } = eventRules();
const image_ids = ref([]);
const limitImage = ref(useMeStore().getMaxImageByPlan);
const isLoadingAction = ref(false);
const loadingImage = ref(false);
const responseEvent = ref();
const loading = ref(false);
const loadingZoom = ref(false);

const isShowModalConfirm = ref(false);
const router = useRouter();
const route = useRoute();
const formSubmit = ref();
const errorsForm = ref({});
const isShowModalPlanConfirm = ref(false);
const lengthImageUpdate = ref(0);
const authStore = useAuthStore();
const storeData = useMeStore();

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const disabledDateStart = (time: Date) => {
  return formEvent.end_date && moment(time) > moment(formEvent.end_date);
};

const disabledDateEnd = (time: Date) => {
  return (
    formEvent.start_date &&
    moment(time).isSameOrBefore(moment(formEvent.start_date).subtract(1, "day"))
  );
};

const getMaxImage = async () => {
  const sizeImage = (await storeRequest.getMaxImage<any>(+storeData.getStoreId))
    .data;
  lengthImageUpdate.value = sizeImage.master;
};
const handleRemoveImage = async (file, fileList) => {
  formEvent.image_id = fileList;
  if (file.id) {
    const index = image_ids.value.indexOf(file.id);
    image_ids.value.splice(index, 1);
  }
};

const handleImageChange = async (file, fileList) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  if (image_ids.value.length - 1 >= lengthImageUpdate.value) {
    image_ids.value.pop();
    isShowModalPlanConfirm.value = true;
    return;
  }
  try {
    loadingImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formEvent.image_id = data.id;
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    image_ids.value = [];
  } finally {
    loadingImage.value = false;
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
    await EventRequest.delete(+route.params?.id);
    deleteSuccess();
  } catch (e) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-event" });
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
    await router.push({ name: "store-event" });
  }
};

const generateLinkHandle = async () => {
  try {
    const start_time = formEvent.start_date
      ? formEvent?.start_date + " " + formEvent.opening_time + ":00"
      : formEvent.opening_time + ":00";
    loadingZoom.value = true;
    const linkZoom = (
      await StoreRequest.generateZoomUrls({
        topic: formEvent.name,
        start_time: start_time,
        duration: DEFAULT_LENGTH_MEETING,
      })
    )?.data;
    formEvent.online_link = linkZoom;
  } catch (e) {
    messageError("errors.please_connect_zoom");
  } finally {
    loadingZoom.value = false;
  }
};

const handleAfterSubmit = () => {
  formSubmit.value = JSON.parse(JSON.stringify(formEvent));
  formSubmit.value.price = +formatValuePrice(formEvent.price);
};
const createOrUpdateEvent = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  if (!form) return;
  errorsForm.value = {};
  await form.validate(async (valid) => {
    if (valid) {
      try {
        await handleAfterSubmit();
        isLoadingAction.value = true;
        const params = {
          name: formSubmit.value.name,
          description: formSubmit.value.description,
          image_id: formSubmit.value.image_id,
          number_seats: formSubmit.value.number_seats,
          price: formSubmit.value.price,
          start_date: formSubmit.value.start_date,
          end_date: formSubmit.value.end_date,
          opening_time: formSubmit.value.opening_time,
          closing_time:
            formSubmit.value.closing_time === "24:00"
              ? "23:59"
              : formSubmit.value.closing_time,
          reservation_type: formSubmit.value.reservation_type,
          place: formSubmit.value.place,
          online_link: formSubmit.value.online_link,
          published: formSubmit.value.published,
        };

        if (isUpdate) {
          await EventRequest.put(+route.params.id as number, {
            ...customTrimValue(params),
          });
          updateSuccess();
        } else {
          await EventRequest.post(params);
          createSuccess();
        }
        await getStepSetting();
        await router.push({ name: "store-event" });
      } catch (e: any) {
        if (e.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
          if (isUpdate) {
            updateError();
          } else {
            createError();
          }
        } else if (e.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-event" });
        } else if (e.response?.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          if (isUpdate) {
            updateError();
          } else {
            createError();
          }
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(+storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
};

const getDataResponse = async () => {
  if (route.params?.id) {
    try {
      loading.value = true;
      responseEvent.value = (
        await EventRequest.show(+route.params?.id as number)
      )?.data;
      if (responseEvent.value) {
        formEvent.price = priceDisplay(responseEvent.value.price);
        formEvent.name = responseEvent.value.name;
        formEvent.description = responseEvent.value.description;
        formEvent.number_seats = responseEvent.value.number_seats;
        formEvent.start_date = responseEvent.value.start_date;
        formEvent.end_date = responseEvent.value.end_date;
        formEvent.opening_time = responseEvent.value.opening_time;
        formEvent.closing_time =
          responseEvent.value.closing_time === "23:59"
            ? "24:00"
            : responseEvent.value.closing_time;
        formEvent.reservation_type = responseEvent.value.reservation_type;
        formEvent.place = responseEvent.value.place;
        formEvent.online_link = responseEvent.value.online_link;
        formEvent.published = responseEvent.value.published;
        formEvent.updated_at = responseEvent.value.updated_at;
        formEvent.created_at = responseEvent.value.created_at;
        formEvent.image_id = responseEvent.value?.image?.id;
        if (responseEvent.value.image) {
          image_ids.value = [
            {
              url: responseEvent.value?.image?.url,
              id: responseEvent.value?.image?.id,
            },
          ];
        }
        lengthImageUpdate.value += image_ids.value.length;
      }
    } catch (_) {
      await router.push({ name: "store-event" });
    } finally {
      loading.value = false;
    }
  }
};

onMounted(async () => {
  loading.value = true;
  await getMaxImage();
  await getDataResponse();
  loading.value = false;
});

defineExpose({
  createOrUpdateEvent,
  deleteRecord,
  _refForm,
  isLoadingAction,
});
</script>

<style lang="scss" scoped>
.container-event {
  display: flex;

  .left {
    width: 50%;

    .company {
      height: 80px;

      :deep(.el-form-item__content) {
        display: block;
      }
    }

    .custom-upload {
      margin-bottom: 16px;
    }

    .custom-input-number,
    .custom-input-price {
      width: 230px;
      margin-right: 16px;
    }

    .group-date {
      :deep(.el-form-item__content) {
        gap: 20px;
      }
    }

    :deep(.input-link) {
      width: calc(100% - 172px);
      padding-right: 12px;
    }

    :deep(.zoom-button) {
      width: 172px;
    }
  }
}
:deep(.el-date-editor) {
  width: 100%;
  height: 40px;
}

:deep(.el-radio) {
  margin-right: 40px;
}
</style>
