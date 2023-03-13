<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("admin.end_user_details") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("admin.end_user_details") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div v-loading="isLoadingDetail" class="container-user-detail">
        <el-form
          ref="formRef"
          :model="formData"
          class="form-body"
          label-width="180px"
          label-position="left"
          :rules="customerRules"
          require-asterisk-position="right"
        >
          <div class="form">
            <el-form-item :label="$t('image')">
              <div v-if="!imagesUpload">
                <AvatarDefault />
              </div>
              <div v-else>
                <el-image
                  class="image-avatar"
                  :src="imagesUpload"
                  fit="contain"
                />
              </div>
            </el-form-item>

            <el-form-item :label="$t('full_name_kanji')" required>
              <div class="d-flex">
                <el-form-item prop="first_name" class="firstname-kanji">
                  <input-text
                    v-model="formData.first_name"
                    class="name-kanji"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    :placeholder="$t('placeholder.first_name')"
                  />
                </el-form-item>
                <el-form-item prop="last_name" class="lastname-kanji">
                  <input-text
                    v-model="formData.last_name"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.last_name')"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <el-form-item :label="$t('name_katakana')" required>
              <div class="d-flex">
                <el-form-item prop="first_name_kana" class="firstname-kana">
                  <input-text
                    v-model="formData.first_name_kana"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.first_name_kana')"
                  />
                </el-form-item>

                <el-form-item prop="last_name_kana" class="lastname-kana">
                  <input-text
                    v-model="formData.last_name_kana"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.last_name_kana')"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <el-form-item
              v-if="route.query.type === CUSTOMER"
              :label="$t('store_name')"
            >
              <input-text
                v-model="formData.store_name"
                disabled="true"
              ></input-text>
            </el-form-item>
            <el-form-item :label="$t('email_address')">
              <input-text
                v-model="formData.email"
                :disabled="true"
              ></input-text>
            </el-form-item>
            <template
              v-if="
                formData.gender === GENDER.MALE ||
                formData.gender === GENDER.FEMALE ||
                formData.gender === GENDER.OTHER
              "
            >
              <el-form-item :label="$t('gender')" required>
                <client-only>
                  <el-select v-model="formData.gender" placeholder="">
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    >
                    </el-option>
                  </el-select>
                </client-only>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item :label="$t('gender')" prop="gender" required>
                <client-only>
                  <el-select v-model="formData.gender" placeholder="">
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    >
                    </el-option>
                  </el-select>
                </client-only>
              </el-form-item>
            </template>
            <el-form-item :label="$t('birthday')" prop="birth_day" required>
              <InputDate
                v-model="formData.birth_day"
                :disabled-date="disabledDate"
              ></InputDate>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              prop="phone_number"
              required
            >
              <InputPhone v-model="formData.phone_number"> </InputPhone>
            </el-form-item>
            <el-form-item
              :label="$t('postal_code')"
              :error="getError('postal_code')"
              prop="postal_code"
              class="align-items-center"
            >
              <div class="d-flex w-100 post-code">
                <InputCode
                  v-model="formData.postal_code"
                  class="mr-10"
                ></InputCode>
                <button-common
                  :icon="Search"
                  background-color="#0071BC"
                  name="search_address"
                  color="white"
                  width="128px"
                  :loading="loadingSearch"
                  :disabled="!formData.postal_code"
                  @click="handleSearchAddress"
                />
              </div>
            </el-form-item>
            <el-form-item :label="$t('address')" class="align-items-center">
              <div class="w-100">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item :error="getError('address')">
                      <InputText
                        v-model="formData.address"
                        :placeholder="$t('placeholder.first_address')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :error="getError('address_detail')">
                      <InputText
                        v-model="formData.address_detail"
                        :placeholder="$t('placeholder.second_address')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === USER"
              :label="$t('admin.login_type')"
            >
              <component :is="checkIconLogin(formData.login_type)"></component>
              <span
                class="login_type"
                :class="{ 'system-type': formData.login_type === TYPE.SYSTEM }"
              >
                {{
                  $t(
                    findObj(typeLoginOptions, "value", formData.login_type)
                      ?.label
                  )
                }}</span
              >
            </el-form-item>
          </div>
          <div class="form">
            <el-form-item
              v-if="route.query.type === USER"
              :label="$t('status')"
            >
              <client-only>
                <el-select v-model="formData.status" placeholder="">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === CUSTOMER"
              :label="$t('status')"
            >
              <InputText v-model="isUserImport" :disabled="true"></InputText>
            </el-form-item>
            <el-form-item :label="$t('created_at')">
              <InputDate
                v-model="formData.created_at"
                :is-disable="true"
              ></InputDate>
            </el-form-item>
            <div class="link-history" @click="handleClick">
              <p>{{ $t("admin.view_user_history") }}</p>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="isLoadingSave"
            @click="updateCustomer(formRef)"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import InputDate from "../../../../shared/components/input/Date.vue";
import InputPhone from "../../../../shared/components/input/Phone.vue";
import InputText from "../../../../shared/components/input/InputText.vue";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { statusOptions } from "~/../../src/shared/constants/user";
import { ImageUpload } from "../../../models";
import { useRoute } from "nuxt/app";
import { DetailCustomer } from "../../../models/detailCustomer";
import CustomerRequest from "~/../../src/shared/requests/CustomerRequest";
import CustomerEditRequest from "~/../../src/shared/requests/CustomerEditRequest";
import { findObj } from "~/../../src/shared/utils/array";
import { typeLoginOptions, TYPE } from "~/../../src/shared/constants/typeLogin";
import { genderOptions } from "~/../../src/shared/constants/user";
import { GENDER } from "~/../../src/shared/constants/user";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from "~/../../src/shared/utils/validate";
import {
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import { useRouter } from "#imports";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { USER, CUSTOMER } from "~/../../src/shared/constants/user";
import AvatarDefault from "~/../../src/shared/components/AvatarDefault.vue";
import { checkIconLogin } from "~/../../src/shared/composables/loginType";
import customerRules from "~/../../src/admin/validates/customer";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { useSearchAddress } from "~/../../src/store/mixins/storeMixin";
import moment from "moment/moment";

const loadingSearch = ref(false);
const dataTableStore = DataTableStore();
const route = useRoute();
const router = useRouter();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const imagesUpload = ref<ImageUpload[]>([]);
const loadingSubmit = ref(false);
const isLoadingDetail = ref(false);
const id = ref(null);
const type = ref(null);
const isUserImport = ref(t("import_user"));
const errorsForm = ref({});
const isLoadingSave = ref(false);
const errorData = ref({});

id.value = Number(route.params.id);
type.value = String(route.params.type);

const formData = reactive({
  id: 0,
  first_name: "",
  last_name: "",
  first_name_kana: "",
  last_name_kana: "",
  email: "",
  store_name: "",
  gender: "",
  birth_day: "",
  avatar_id: 0,
  phone_number: "",
  status: 0,
  created_at: "",
  login_type: 0,
  address: "",
  address_detail: "",
  postal_code: "",
});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};
const handleSearchAddress = () => {
  useSearchAddress(formData, loadingSearch);
};

const handleClick = () => {
  const obj = {
    consumer_id: formData.id,
    consumer_type: route.query.type,
  };
  dataTableStore.bookingList.search = obj;
  router.push({ name: "reservations" });
};

const detailCustomer = (dataObj) => {
  formData.id = dataObj.id;
  formData.first_name = dataObj.first_name;
  formData.last_name = dataObj.last_name;
  formData.first_name_kana = dataObj.first_name_kana;
  formData.last_name_kana = dataObj.last_name_kana;
  formData.gender = dataObj.gender;
  formData.email = dataObj.email;
  formData.created_at = dataObj.created_at;
  formData.birth_day = dataObj.birth_day;
  formData.phone_number = dataObj.phone_number;
  formData.status = dataObj.status;
  formData.postal_code = dataObj.postal_code;
  formData.store_name = dataObj.store_name;
  formData.address = dataObj.address;
  formData.address_detail = dataObj.address_detail;
  formData.login_type = dataObj.login_type;
  imagesUpload.value = dataObj.avatar?.url;
};

const disabledDate = (time: Date): boolean => {
  return moment(time) > moment();
};

const setMe = async () => {
  isLoadingDetail.value = true;
  try {
    if (route.query.type === USER) {
      const { data } = await CustomerRequest.showDetailUser(parseInt(id.value));
      const dataObj = data as DetailCustomer;
      detailCustomer(dataObj);
    } else if (route.query.type === CUSTOMER) {
      const { data } = await CustomerRequest.showDetailCustomer(
        parseInt(id.value)
      );
      const dataObj = data as DetailCustomer;
      detailCustomer(dataObj);
    } else {
      await router.push({ name: "customer" });
    }
  } catch (e) {
    await router.push({ name: "customer" });
  } finally {
    isLoadingDetail.value = false;
  }
};

const updateCustomer = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingSave.value = true;
        errorData.value = {};

        const params = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          birth_day: formData.birth_day,
          phone_number: formData.phone_number,
          first_name_kana: formData.first_name_kana,
          last_name_kana: formData.last_name_kana,
          gender: formData.gender,
          postal_code: formData.postal_code,
          address: formData.address,
          address_detail: formData.address_detail,
          status: formData.status,
        };

        if (route.query.type === CUSTOMER) {
          await CustomerEditRequest.editCustomer(id.value, params);
        } else if (route.query.type === USER) {
          await CustomerEditRequest.put(id.value, params);
        } else {
          return;
        }

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

onMounted(async () => {
  await setMe();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

.container-user-detail {
  padding: 12px 12px 0 12px;

  .form-body {
    display: flex;
    justify-content: space-between;

    .name-kanji,
    .name-kana {
      width: 278px;
    }

    .lastname-kanji,
    .lastname-kana {
      margin-left: 10px;
    }

    .image-avatar {
      height: 160px;
      width: 160px;
    }

    .form {
      flex-basis: 45%;

      .login_type {
        padding-left: 16px;

        &.system-type {
          padding-left: 0;
        }
      }

      .link-history {
        font-size: 14px;
        display: flex;
        justify-content: flex-end;
        cursor: pointer;

        p {
          color: $blue-light;
          text-decoration: underline;
        }
      }
    }
  }
}

.group-button {
  justify-content: flex-end !important;
}

:deep(.el-form-item) {
  align-items: center;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.input-date) {
  width: 100%;

  .el-input__wrapper {
    flex-direction: row-reverse;
  }
}

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

:deep(.btn-add) {
  background-color: #00a99d;
  border-color: #00a99d;
}
</style>
