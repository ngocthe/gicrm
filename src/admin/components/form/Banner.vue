<template>
  <div v-loading="isLoadingDetail">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="bannerAdsRules"
      class="form-banner"
      require-asterisk-position="right"
    >
      <div-inline :label="'display'">
        <template #form-item>
          <el-form-item prop="display" :error="errorData.status?.[0]">
            <el-checkbox
              v-model="display"
              @change="getOptionsBannerIndex"
            ></el-checkbox>
          </el-form-item>
        </template>
      </div-inline>

      <div-inline :label="'industry'" :is-required="true">
        <template #form-item>
          <client-only>
            <el-form-item prop="store_type" :error="errorData.store_type?.[0]">
              <el-select
                v-model="formData.store_type"
                class="input--item"
                :placeholder="$t('placeholder.select_industry')"
                @change="getOptionsBannerIndex"
              >
                <el-option
                  :value="TYPE_PORTAL"
                  :label="$t('title_screen.portal')"
                ></el-option>
                <el-option
                  v-for="item in filterDataTypeStore"
                  :key="item.id"
                  :label="$t(item.name)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </client-only>
        </template>
      </div-inline>

      <div-inline :label="'banner_name'" :is-required="true">
        <template #form-item>
          <el-form-item prop="name" :error="errorData.name?.[0]">
            <input-text
              v-model="formData.name"
              :placeholder="$t('banner_name')"
              class="input--item"
            />
          </el-form-item>
        </template>
      </div-inline>

      <div-inline :label="'display_position'" :is-required="true">
        <template #form-item>
          <client-only>
            <el-form-item prop="position" :error="errorData.position?.[0]">
              <el-select
                v-model="formData.position"
                class="input--item"
                :placeholder="$t('placeholder.position_selection')"
                @change="changeFormatImageUpload"
              >
                <el-option
                  v-for="item in positionBannerOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></el-option>
              </el-select>
            </el-form-item>
          </client-only>
        </template>
      </div-inline>

      <div-inline
        :label="'display_period'"
        :is-required="true"
        :label-class="true"
      >
        <template #form-item>
          <div class="w-100 date-time">
            <div-block>
              <template #form-item>
                <client-only>
                  <el-form-item
                    class="form-item"
                    prop="start_time"
                    :error="errorData.start_time?.[0]"
                  >
                    <el-date-picker
                      v-model="formData.start_time"
                      type="date"
                      :disabled-date="disabledDate"
                      :placeholder="$t('placeholder.birthday')"
                      format="YYYY年MM月DD日"
                      value-format="YYYY-MM-DD"
                      width="565px"
                      clearable
                      @change="checkValueDate"
                    />
                  </el-form-item>
                </client-only>
              </template>
            </div-block>
            <div-block>
              <template #form-item>
                <client-only>
                  <el-form-item
                    class="form-item"
                    prop="end_time"
                    :error="errorData.end_time?.[0]"
                  >
                    <el-date-picker
                      v-model="formData.end_time"
                      type="date"
                      :disabled-date="disabledDate"
                      :placeholder="$t('placeholder.birthday')"
                      format="YYYY年MM月DD日"
                      value-format="YYYY-MM-DD"
                      width="565px"
                      clearable
                      @change="checkValueDate"
                    />
                  </el-form-item>
                </client-only>
              </template>
            </div-block>
          </div>
        </template>
      </div-inline>

      <div-inline
        :label="'file_selection'"
        class="align-items-center mt-10"
        :is-required="true"
      >
        <template #form-item>
          <el-form-item
            class="file_selection"
            prop="image_id"
            :error="errorData.image_ids?.[0]"
          >
            <input-file-banner
              v-loading="loadingImage"
              :is-avatar="true"
              :width="'567px'"
              :height="heightImageUpload"
              :limit="limit"
              :data="image_ids"
              @handle-remove-image="handleRemove"
              @handle-change-image="handleImageChange"
            />
          </el-form-item>
        </template>
      </div-inline>

      <div-inline label="URL">
        <template #form-item>
          <el-form-item prop="url" :error="errorData.url?.[0]">
            <input-text
              v-model="formData.url"
              class="input--item"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              :placeholder="$t('placeholder.url')"
            />
          </el-form-item>
        </template>
      </div-inline>

      <div-inline :label="'display_order'" :is-required="true">
        <template #form-item>
          <client-only>
            <el-form-item prop="index" :error="errorData.index?.[0]">
              <el-select
                v-model="formData.index"
                class="input--item"
                :placeholder="$t('placeholder.display_order')"
              >
                <el-option
                  v-for="item in displayOrderOptions"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </client-only>
        </template>
      </div-inline>

      <div-inline :label="'remark'">
        <template #form-item>
          <el-input
            v-model="formData.note"
            v-input-trim
            :rows="4"
            type="textarea"
            :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
            :placeholder="$t('placeholder.enter_remarks')"
          />
        </template>
      </div-inline>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeMount,
  toRefs,
  computed,
  onMounted,
  watch,
} from "vue";
import { dataTypeStore } from "~/../../src/shared/constants/category.ts";
import {
  positionBannerOptions,
  POSITION,
} from "~/../../src/shared/constants/positionBanner";
import bannerAdsRules from "../../validates/bannerAds";
import { i18n } from "~/../../src/shared/plugins/i18n";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputFileBanner from "~/../../src/shared/components/input/FileBanner.vue";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import DivBlock from "~/../../src/shared/components/DivBlock.vue";
import { BannerAds } from "~/../../src/shared/types/bannerAds";
import BannerAdsRequest from "~/../../src/shared/requests/BannerAdsRequest";
import { STATUS_TYPE } from "~/../../src/shared/constants/status";
import { FormInstance } from "element-plus";
import {
  createError,
  createSuccess,
  deleteError,
  updateError,
  updateSuccess,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import { useRouter } from "#app";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import { DataFile } from "~/../../src/shared/models";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import moment from "moment/moment";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { TYPE_PORTAL } from "~/../../src/shared/constants/category";
import { MAX_LENGTH_DEFAULT_TEXTAREA } from "~/../../src/shared/utils/validate";

const { t } = i18n.global;
const formRef = ref(null);
const image_ids = ref([]);
const limit = ref(1);
const loadingImage = ref(false);
const errorData = ref({});
const isLoadingDetail = ref(false);
const isLoadingAction = ref(false);
const router = useRouter();
const id_image = ref("");
const displayOrderOptions = ref([]);
const display = ref(true);
const bannerData = ref<BannerAds>(null);
const heightImageUpload = ref("189px");
const formData = reactive({
  status: STATUS_TYPE.ENABLE,
  store_type: TYPE_PORTAL,
  name: null,
  position: POSITION.TOP,
  start_time: "",
  end_time: "",
  image: null,
  url: null,
  note: null,
  index: null,
  image_id: null,
});

interface Prop {
  id?: number;
}

const props = defineProps<Prop>();
const { id } = toRefs(props);

const handleRemove = async (file, fileList) => {
  image_ids.value = fileList;
  if (file.id) {
    formData.image_id = null;
  }
};

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const handleImageChange = async (file, fileList) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.image_id = data.id;
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    image_ids.value = [];
  } finally {
    loadingImage.value = false;
  }
};

const disabledDate = (time: Date) => {
  return moment(time) < moment().subtract(1, "days");
};

const checkValueDate = async () => {
  await getOptionsBannerIndex();

  if (formData.start_time > formData.end_time) {
    return (formData.start_time = formData.end_time);
  }
};

const changeFormatImageUpload = async (value: null) => {
  await getOptionsBannerIndex();

  if (formData.position === POSITION.TOP) {
    return (heightImageUpload.value = "189px");
  }

  if (formData.position === POSITION.CENTER) {
    return (heightImageUpload.value = "315px");
  }
};

const createBanner = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        const body = {
          status:
            display.value === true ? STATUS_TYPE.ENABLE : STATUS_TYPE.DISABLE,
          store_type: formData.store_type,
          name: formData.name,
          position: formData.position,
          start_time: formData.start_time,
          end_time: formData.end_time,
          url: formData.url,
          index: formData.index,
          note: formData.note,
          image_id: formData.image_id,
        };
        await BannerAdsRequest.post(body);
        createSuccess();
        await router.push("/banner-ads");
      } catch (error) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        createError();
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const detailBanner = async () => {
  try {
    isLoadingDetail.value = true;
    bannerData.value = (await BannerAdsRequest.show(id.value))
      .data as BannerAds;

    display.value = bannerData.value.status === STATUS_TYPE.ENABLE;
    formData.store_type = bannerData.value.store_type;
    formData.name = bannerData.value.name;
    formData.index = bannerData.value.index;
    formData.position = bannerData.value.position;
    formData.start_time = bannerData.value.start_time;
    formData.end_time = bannerData.value.end_time;
    formData.image = bannerData.value.image;
    formData.url = bannerData.value.url;
    formData.note = bannerData.value.note;
    image_ids.value = bannerData.value.image ? [bannerData.value.image] : [];
    formData.image_id = bannerData.value.image?.id;
    changeFormatImageUpload();
  } catch (e) {
    return e;
  } finally {
    isLoadingDetail.value = false;
  }
};

const updateBanner = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        const body = {
          status:
            display.value === true ? STATUS_TYPE.ENABLE : STATUS_TYPE.DISABLE,
          store_type: formData.store_type,
          name: formData.name,
          position: formData.position,
          start_time: formData.start_time,
          end_time: formData.end_time,
          url: formData.url,
          note: formData.note,
          index: formData.index,
          image_id: formData.image_id,
        };
        await BannerAdsRequest.put(id.value, body);
        updateSuccess();
        await router.push("/banner-ads");
      } catch (error) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        updateError();
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const getOptionsBannerIndex = async () => {
  const params = {
    status: display.value === true ? STATUS_TYPE.ENABLE : STATUS_TYPE.DISABLE,
    position: formData.position,
    store_type: formData.store_type,
    start_date: moment(formData.start_time).format("YYYY-MM-DD"),
    end_date: moment(formData.end_time).format("YYYY-MM-DD"),
  };

  const dataIndexBanner = await BannerAdsRequest.getBannerIndex(params);

  if (dataIndexBanner.data.length && id.value) {
    displayOrderOptions.value = dataIndexBanner.data;
  } else if (dataIndexBanner.data.length) {
    displayOrderOptions.value = dataIndexBanner.data;
    const maxlength = dataIndexBanner.data.length - 1;
    displayOrderOptions.value.push(dataIndexBanner.data[maxlength] + 1);
  } else {
    displayOrderOptions.value = [1];
  }

  const indexBanner = formData.index;
  if (indexBanner && !displayOrderOptions.value.includes(indexBanner)) {
    formData.index = null;
  }
};

onBeforeMount(() => {
  if (id.value) {
    detailBanner();
  } else {
    formData.start_time = moment().format("YYYY-MM-DD");
    formData.end_time = moment().format("YYYY-MM-DD");
    getOptionsBannerIndex();
  }
});

defineExpose({
  createBanner,
  updateBanner,
  formRef,
  isLoadingAction,
  isLoadingDetail,
});
</script>

<style lang="scss" scoped>
:deep(.form-banner) {
  width: 725px;
  padding-bottom: 20px;

  .div-inline {
    margin-bottom: 0;

    .label-text {
      font-size: 14px;
    }
  }

  .date-time {
    display: flex;
    gap: 12px;

    .el-form-item {
      margin-bottom: 12px;
    }

    .div-block {
      width: 277px;
    }
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 20px;

    .el-form-item__content {
      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }
    }
  }
}

:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
  height: 40px;
}
</style>
