<template>
  <div class="connect-hot-pepper-gourmet">
    <connect-template
      :disabled-connect="formData.status && data"
      :disabled-save="!formData.status || (formData.status && data)"
      :is-loading-connect="loading"
      :is-loading-save="loadingSubmit"
      @connect-data="checkConnection(formRef)"
      @save-data="postHotPepper(formRef)"
    >
      <template #connect-type>
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="hotPepperRules"
        >
          <div-inline :label="'store.login_link'" :is-required="true">
            <template #form-item>
              <el-form-item prop="url" :error="errorForm['url']?.[0]">
                <input-text
                  v-model="formData.url"
                  width="400px"
                  :placeholder="$t('placeholder.link_hot_pepper')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'store.user_id'" :is-required="true">
            <template #form-item>
              <el-form-item prop="account">
                <input-text
                  v-model="formData.account"
                  width="400px"
                  :placeholder="$t('store.user_id')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'password'" :is-required="true">
            <template #form-item>
              <el-form-item prop="password">
                <InputPassword
                  v-model="formData.password"
                  width="400px"
                  :placeholder="$t('password')"
                  :maxlength="MAX_LENGTH_PASSWORD_HOT_PEPPER"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div v-if="formData.status" class="confirmation-status">
                <IconCheck />
                <div class="status">{{ $t("store.correct_information") }}</div>
              </div>
              <div v-if="!formData.status" class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>
        </el-form>
      </template>
    </connect-template>
  </div>
</template>

<script lang="ts" setup>
import ConnectTemplate from "./ConnectTemplate";
import { reactive, ref, toRefs, watch } from "vue";
import { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPassword from "~/../../src/shared/components/input/InputPasswordCache.vue";
import { HotPepper } from "~/../../src/store/models/external";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import {
  messageSuccess,
  messageError,
  createSuccess,
  createError,
} from "~/../../src/shared/utils/notification";
import hotPepperRules from "~/../../src/store/validates/hotPepper";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { MAX_LENGTH_PASSWORD_HOT_PEPPER } from "~/../../src/shared/utils/validate";

interface Prop {
  data: HotPepper;
}

const emits = defineEmits(["updateHopper"]);
const props = defineProps<Prop>();
const { data } = toRefs(props);

const formRef = ref<FormInstance>();
const formData = reactive({
  url: data.value?.url || "",
  account: data.value?.account || "",
  password: data.value?.password || "",
  status: !!data.value,
});
const loading = ref(false);
const loadingSubmit = ref(false);
const errorForm = ref({});

const checkConnection = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await storeSettingRequest.checkHotPepperAvailable(formData);
        formData.status = true;
        messageSuccess("success.connect_hot_pepper");
      } catch (error: any) {
        if (error.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorForm.value = error.response?._data?.errors;
        } else {
          messageError("errors.connect_external");
        }
      } finally {
        loading.value = false;
      }
    }
  });
};

const postHotPepper = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.status) {
          loadingSubmit.value = true;
          await storeSettingRequest.saveHotPepperSetting(formData);
          emits("updateHopper");
          createSuccess();
        } else {
          messageError("errors.setting_hot_pepper");
        }
      } catch (error) {
        createError();
      } finally {
        loadingSubmit.value = false;
      }
    }
  });
};

watch(data, (value) => {
  if (value) {
    formData.url = value.url;
    formData.account = value.account;
    formData.password = value.password;
  } else {
    formData.url = "";
    formData.account = "";
    formData.password = "";
  }
  formData.status = !!value;
});
</script>
