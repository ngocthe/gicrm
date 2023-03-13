<template>
  <div v-loading="isLoadingSave || isLoadingDetail">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="profileRules"
      class="form-profile"
      require-asterisk-position="right"
    >
      <div-inline :label="'image'" class="align-items-center mb-20">
        <template #form-item>
          <input-file
            v-loading="loadingImage"
            :is-avatar="true"
            :width="'160px'"
            :height="'160px'"
            :limit="limit"
            :data="image_ids"
            @handle-remove-image="handleRemove"
            @handle-change-image="handleImageChange"
          />
        </template>
      </div-inline>

      <div-inline
        :label="'full_name_kanji'"
        :is-required="true"
        :label-class="true"
      >
        <template #form-item>
          <div class="w-100">
            <div class="full-name kanji-name">
              <div-block :label="$t('first_name_kanji')">
                <template #form-item>
                  <el-form-item prop="first_name">
                    <InputText
                      v-model="formData.first_name"
                      :maxlength="MAX_LENGTH_FIRST_NAME"
                      width="277px"
                      :placeholder="$t('placeholder.first_name')"
                    />
                  </el-form-item>
                </template>
              </div-block>
              <div-block :label="$t('last_name_kanji')">
                <template #form-item>
                  <el-form-item prop="last_name">
                    <InputText
                      v-model="formData.last_name"
                      :maxlength="MAX_LENGTH_LAST_NAME"
                      width="277px"
                      :placeholder="$t('placeholder.last_name')"
                    />
                  </el-form-item>
                </template>
              </div-block>
            </div>

            <div class="full-name kana-name">
              <div-block :label="$t('sur_name')">
                <template #form-item>
                  <el-form-item prop="first_name_kana">
                    <InputText
                      v-model="formData.first_name_kana"
                      :maxlength="MAX_LENGTH_FIRST_NAME"
                      width="277px"
                      :placeholder="$t('placeholder.first_name_kana')"
                      @input="
                        formatInputKatakana($event, 'first_name_kana', formRef)
                      "
                    />
                  </el-form-item>
                </template>
              </div-block>
              <div-block :label="$t('may_name')">
                <template #form-item>
                  <el-form-item prop="last_name_kana">
                    <InputText
                      v-model="formData.last_name_kana"
                      :maxlength="MAX_LENGTH_LAST_NAME"
                      width="277px"
                      :placeholder="$t('placeholder.last_name_kana')"
                      @input="
                        formatInputKatakana($event, 'last_name_kana', formRef)
                      "
                    />
                  </el-form-item>
                </template>
              </div-block>
            </div>
          </div>
        </template>
      </div-inline>

      <div-inline :label="'email_address'" :is-required="true">
        <template #form-item>
          <el-form-item prop="email" :error="errorData.email?.[0]">
            <input-text
              v-model="formData.email"
              :placeholder="$t('placeholder.email')"
              class="input--item"
              :maxlength="MAX_LENGTH_EMAIL"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
            />
          </el-form-item>
        </template>
      </div-inline>

      <div-inline :label="'gender'">
        <template #form-item>
          <client-only>
            <el-form-item prop="gender" :error="errorData.gender?.[0]">
              <el-select
                v-model="formData.gender"
                class="input--item"
                :placeholder="$t('gender')"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></el-option>
              </el-select>
            </el-form-item>
          </client-only>
        </template>
      </div-inline>

      <div-inline :label="'birthday'" :is-required="true">
        <template #form-item>
          <client-only>
            <el-form-item
              class="form-item"
              prop="birth_day"
              :error="errorData.birth_day?.[0]"
            >
              <el-date-picker
                v-model="formData.birth_day"
                :disabled-date="disabledDate"
                type="date"
                :placeholder="$t('placeholder.birthday')"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
                width="565px"
                clearable
              />
            </el-form-item>
          </client-only>
        </template>
      </div-inline>

      <div-inline :label="'phone_number'" :is-required="true">
        <template #form-item>
          <el-form-item
            prop="phone_number"
            :error="errorData.phone_number?.[0]"
          >
            <InputPhone v-model="formData.phone_number" />
          </el-form-item>
        </template>
      </div-inline>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from "~/../../src/shared/utils/validate";
import { genderOptions } from "~/../../src/shared/constants/user";
import { getMe } from "~/../../src/shared/api/all/authApi";
import profileRules from "../../validates/profile";
import EditProfile from "../../../shared/requests/EditProfile";
import { i18n } from "~/../../src/shared/plugins/i18n";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import { Profile } from "~/../../src/shared/types/profile";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import DivBlock from "~/../../src/shared/components/DivBlock.vue";
import {
  updateSuccess,
  updateError,
  deleteError,
  messageError,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import { useMeStore } from "~/../../src/shared/stores/me";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import { DataFile } from "~/../../src/shared/models";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import moment from "moment/moment";
import { formatInputKatakana } from "~/../../src/shared/utils";

const upLoadImage = ref(false);
const { t } = i18n.global;
const emits = defineEmits(["changeLoadingData"]);
const router = useRouter();
const formRef = ref(null);
const image_ids = ref([]);
const limit = ref(1);
const id_image = ref("");
const loadingImage = ref(false);
const errorData = ref({});
const loading = ref(false);
const isLoadingDetail = ref(false);
const isLoadingSave = ref(false);
const meStore = useMeStore();
const formData = reactive({
  first_name: null,
  last_name: null,
  first_name_kana: null,
  last_name_kana: null,
  email: null,
  body: null,
  birth_day: null,
  phone_number: null,
  gender: null,
  avatar_id: null,
});

const urlAvatar = ref("");

const handleRemove = async (file, fileList) => {
  image_ids.value = fileList;
  if (file.id) {
    formData.avatar_id = null;
  }
};

const disabledDate = (time: Date) => {
  return moment(time) >= moment().subtract(0, "days");
};

const handleImageChange = async (file, fileList) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value = true;
    upLoadImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.avatar_id = data.id;
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    image_ids.value = [];
  } finally {
    loadingImage.value = false;
    upLoadImage.value = false;
  }
};

const setMe = async (key?: boolean) => {
  try {
    isLoadingDetail.value = true;
    const data = await getMe();
    if (key) {
      await meStore.setData(data.data);
    }
    const profile = data.data as Profile;
    formData.first_name = profile.first_name;
    formData.last_name = profile.last_name;
    formData.first_name_kana = profile.first_name_kana;
    formData.last_name_kana = profile.first_name_kana;
    formData.email = profile.email;
    formData.phone_number = profile.phone_number;
    formData.birth_day = profile.birth_day;
    formData.avatar_id = profile.avatar?.id;
    image_ids.value = profile.avatar ? [profile.avatar] : [];
    id_image.value = profile.avatar?.id;
    formData.gender = profile.gender;
    urlAvatar.value = profile.avatar?.url;
  } catch (e) {
    return;
  } finally {
    isLoadingDetail.value = false;
  }
};

const saveProfile = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingSave.value = true;
        errorData.value = {};
        await EditProfile.editProfile(formData);
        await setMe(true);
        updateSuccess();
      } catch (error) {
        errorData.value = error?.data?.errors;
        updateError();
      } finally {
        isLoadingSave.value = false;
      }
    }
  });
};

defineExpose({
  formRef,
  saveProfile,
  isLoadingSave,
  isLoadingDetail,
  upLoadImage,
});

onMounted(() => {
  setMe();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-profile) {
  width: 725px;

  .div-inline {
    margin-bottom: 0;

    .label-text {
      font-size: 14px;
    }
  }

  .full-name {
    display: flex;
    gap: 12px;

    .el-form-item {
      margin-bottom: 12px;
    }

    &.kana-name {
      .el-form-item {
        margin-bottom: 20px;
      }
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
