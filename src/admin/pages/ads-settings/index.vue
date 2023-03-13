<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("title_screen.ads_settings") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.ads_settings") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" accordion>
          <div v-for="(item, index) in dataTypeStore">
            <el-collapse-item>
              <template #title>
                <div class="header-title" @click="openCollapse(item.id)">
                  {{ $t(item.name) }}
                </div>
              </template>
              <el-form
                ref="formRef"
                v-loading="isLoading[index]"
                require-asterisk-position="right"
                :model="formData[index]"
                class="form-settings"
                label-width="80px"
                label-position="left"
              >
                <div
                  v-for="(itemBanner, indexBanner) in formData[index].adsenses"
                  class="collapse-link d-flex align-items-center"
                >
                  <div class="collapse-link__label">
                    {{
                      $t("admin.ads_settings.label_setting", {
                        index: indexBanner + 1,
                      })
                    }}
                  </div>
                  <div class="collapse-link__content item-collapse">
                    <div>
                      <el-form-item
                        :error="formData[index].errorsForm[indexBanner].data"
                        label="URL"
                      >
                        <input-text
                          v-model="itemBanner.data"
                          :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                          type="textarea"
                          :row="6"
                          height="110px"
                          width="650px"
                          :placeholder="$t('admin.ads_settings.enter_ad_link')"
                          @blur="handleChange(item.id, indexBanner)"
                          @change="handleHref(item.id, indexBanner)"
                        />
                      </el-form-item>
                      <el-form-item :label="$t('display')">
                        <el-checkbox v-model="itemBanner.enable"></el-checkbox>
                      </el-form-item>
                    </div>
                    <div
                      class="delete-course"
                      @click="deleteBanner(index, indexBanner)"
                    >
                      <IconDeleteTime />
                      <span>{{ $t("button.delete") }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="
                    formData[item.id].adsenses.length < MAX_LENGTH_BANNER_ADS
                  "
                  class="add-course"
                  @click="addBanner(index)"
                >
                  <IconAddTime />
                  <span>{{ $t("button.add_banner") }}</span>
                </div>
              </el-form>
              <div class="group-button">
                <button-common
                  :loading="loading"
                  :name="$t('button.setting')"
                  background-color="#0071BC"
                  color="white"
                  width="68px"
                  @click="submitForm(formRef[item.id], index)"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { dataTypeStore } from "~/../../src/shared/constants/adsense";
import { messageSuccess } from "~/../../src/shared/utils/notification";
import { FormInstance } from "element-plus";
import {
  SALON,
  RESTAURANT,
  CLASSROOM,
  CONSULTATION,
  MEDIAL_CARE,
  EVENT,
} from "~/../../src/shared/constants/category";
import {
  MAX_LENGTH_BANNER_ADS,
  DEFAULT_LENGTH_BANNER,
  MAX_LENGTH_DEFAULT_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import AdsenseRequest from "~/../../src/shared/requests/AdsenseRequest";
import { updateError } from "~/../../src/shared/utils/notification";
import { PORTAL, PORTAL_SUBMIT } from "~/../../src/shared/constants/adsense";

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const activeNames = ref([]);
const loading = ref(false);
const isCollapseOpen = ref([false, false, false, false, false, false, false]);
const arrayDelete = ref([]);
const isLoading = ref([false, false, false, false, false, false, false]);
const formData = reactive([
  {
    adsenses: [],
    store_type: PORTAL,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: SALON,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: RESTAURANT,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: MEDIAL_CARE,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: CLASSROOM,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: CONSULTATION,
    errorsForm: [],
  },
  {
    adsenses: [],
    store_type: EVENT,
    errorsForm: [],
  },
]);
const curOpen = ref(PORTAL);
const validate = ref(false);

const openCollapse = (store_type: number) => {
  isCollapseOpen.value[store_type] = !isCollapseOpen.value[store_type];

  if (curOpen.value !== store_type) {
    isCollapseOpen.value[curOpen.value] = false;
    getDataResponse(store_type);
    clearData(curOpen.value);
  } else {
    if (isCollapseOpen.value[store_type] && !isLoading.value[store_type]) {
      getDataResponse(store_type);
    } else {
      clearData(curOpen.value);
    }
  }

  curOpen.value = store_type;
};

const addBanner = (store_type: number) => {
  formData[store_type].adsenses.push({
    id: null,
    url: null,
    image: null,
    data: null,
    display_link_setting: false,
    enable: true,
    deleted: false,
  });

  formData[store_type].errorsForm.push({
    data: null,
  });
};

const deleteBanner = (store_type: number, index: number) => {
  if (formData[store_type].adsenses[index].id) {
    formData[store_type].adsenses[index].deleted = true;
    arrayDelete.value.push(formData[store_type].adsenses[index]);
  }

  formData[store_type].adsenses.splice(index, 1);
  formData[store_type].errorsForm.splice(index, 1);
};

const handleChange = (store_type: number, index: number) => {
  if (
    !formData[store_type].adsenses[index]?.data ||
    !formData[store_type].adsenses[index]?.data.trim().length
  ) {
    formData[store_type].errorsForm[index].data = t("validate.required.field", {
      field: t("URL"),
    });
    validate.value = false;
  }
};

const handleHref = (store_type: number, index: number) => {
  const data = formData[store_type].adsenses[index].data;
  if (data) {
    const node = new DOMParser().parseFromString(data, "text/html").body
      .firstElementChild;
    if (
      node?.getAttribute("href") &&
      node?.firstElementChild?.getAttribute("src")
    ) {
      formData[store_type].adsenses[index].url = node.getAttribute("href");
      formData[store_type].adsenses[index].image =
        node.firstElementChild?.getAttribute("src");
      formData[store_type].errorsForm[index] = { data: "" };
    } else {
      formData[store_type].errorsForm[index].data = t("validate.format.field", {
        field: t("URL"),
      });
      validate.value = false;
    }
  }
};

const formSubmit = ref();

const clearData = (index: number) => {
  formData[index].errorsForm = [];
  formData[index].adsenses = [];
  arrayDelete.value = [];
};

const validateForm = (index_store: number) => {
  validate.value = true;
  formData[index_store].adsenses.forEach((item, index) => {
    handleHref(index_store, index);
    handleChange(index_store, index);
  });
};

const handleAfterSubmit = (index) => {
  formSubmit.value = JSON.parse(JSON.stringify(formData[index]));
  // delele field
  delete formSubmit.value.errorsForm;
  if (formSubmit.value.store_type === PORTAL)
    formSubmit.value.store_type = PORTAL_SUBMIT;
  arrayDelete.value.forEach((item) => {
    formSubmit.value.adsenses.push(item);
  });
};
const submitForm = async (form: FormInstance | undefined, index: number) => {
  if (!form) return;
  loading.value = true;

  validateForm(index);
  handleAfterSubmit(index);

  if (validate.value) {
    try {
      await AdsenseRequest.post(formSubmit.value);
      loading.value = true;
      messageSuccess("success.edit");
      clearData(index);
      await getDataResponse(index);
    } catch (e) {
      updateError();
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
};

const getDataResponse = async (store_type: number) => {
  try {
    isLoading.value[store_type] = true;
    clearData(store_type);
    const dataResponse = (
      await AdsenseRequest.getList({
        store_type: store_type ? store_type : PORTAL_SUBMIT,
      })
    )?.data;

    if (dataResponse.data.length) {
      dataResponse.data.forEach((item: any) => {
        formData[store_type].adsenses.push({
          id: item.id,
          enable: !!item.enable,
          data: item.data,
          deleted: false,
          url: item.url,
          image: item.image.url,
        });
        formData[store_type].errorsForm.push({
          data: "",
        });
      });
    } else {
      for (let i = 0; i < DEFAULT_LENGTH_BANNER; i++) {
        formData[store_type].adsenses.push({
          id: null,
          enable: true,
          data: null,
          deleted: false,
          url: null,
          image: null,
        });
        formData[store_type].errorsForm.push({
          data: "",
        });
      }
    }
  } catch (e) {
  } finally {
    isLoading.value[store_type] = false;
  }
};
</script>

<style lang="scss" scoped>
@import "~/../../src/admin/assets/scss/variables.scss";

:deep(.content) {
  background: $alice-blue !important;
}

:deep(.el-scrollbar.scroll-content) {
  background: $alice-blue !important;
}

:deep(.group-button) {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 30px;
}

:deep(.el-collapse-item__header) {
  border-radius: 4px 4px 0 0;
}

:deep(.el-collapse-item__wrap) {
  border-radius: 0 0 4px 4px;
  border-top: 1px solid #c1cbdb;
}

:deep(.el-loading-mask) {
  top: 40px;
}

:deep(.el-collapse) {
  border: none;

  .header-title {
    width: 100%;
    padding-left: 20px;
    font-size: 14px;
    line-height: 20px;
  }

  .el-collapse-item {
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    .el-collapse-item__header {
      position: relative;

      div {
        display: flex;
        align-items: center;
        z-index: 2;
        height: 100%;
        position: absolute;
      }
    }

    .el-collapse-item__content {
      padding-top: 32px;
    }
  }
}

.form-settings {
  width: 100%;
  font-size: 14px;

  .collapse-link__label {
    min-width: 165px;
  }
}

.form-settings .el-form-item {
  margin-bottom: 8px;
}

.item-collapse {
  display: flex;
  align-items: center;
  gap: 10px;
}

.collapse-link {
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 10px;
}

.delete-course {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: $red-100;
  gap: 5px;
  white-space: nowrap;
}

.add-course {
  width: 95px;
  cursor: pointer;
  margin-top: -15px;
  display: flex;
  align-items: center;
  color: $menuBg;
  margin-left: 275px;
  gap: 5px;
}

:deep(.el-textarea__inner) {
  height: 110px;
}

:deep(.el-collapse) {
  background: $alice-blue;

  .el-collapse-item__header {
    .el-icon::before {
      content: url("data:image/svg+xml;charset=UTF-8, <svg width='14' height='10' viewBox='0 0 18 10' fill='none' xmlns='http://www.w3.org/2000/svg'> <path d='M16.5002 0.991288L9.00017 8.30379L1.50017 0.991288C1.35967 0.850788 1.19567 0.780538 1.00817 0.780538C0.82067 0.780538 0.65667 0.850788 0.51617 0.991288C0.37567 1.13179 0.30542 1.29579 0.30542 1.48329C0.30542 1.67079 0.36792 1.82704 0.49292 1.95204L8.48492 9.73329C8.62542 9.87379 8.79742 9.94404 9.00092 9.94404C9.20442 9.94404 9.37642 9.87379 9.51692 9.73329L17.5089 1.97529C17.6339 1.83479 17.6964 1.66679 17.6964 1.47129C17.6964 1.27579 17.6262 1.11179 17.4857 0.979288C17.3452 0.846788 17.1812 0.780288 16.9937 0.779788C16.8062 0.779288 16.6422 0.849538 16.5017 0.990538L16.5002 0.991288Z' fill='black' fill-opacity='0.4'/> </svg>");
      width: 17px;
      height: 9px;
    }
  }

  .el-collapse-item__arrow.is-active {
    transform: rotate(180deg);
  }
}
</style>
