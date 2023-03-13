<template>
  <Head>
    <Title>
      {{ $t("site_name_title") }}{{ $t("title_screen.forgot_pass") }}
    </Title>
  </Head>
  <div class="forgot-password">
    <div v-if="isSuccess" class="send-success">
      <div class="send-success__body">
        <big-arxia-admin />
        <div class="icon-mail">
          <IconMailSendSuccess />
        </div>
        <div class="title-forgot">{{ $t("title_screen.forgot_pass") }}</div>
        <div>{{ $t("sent_you_a_link") }}:</div>
        <div class="mail-to">
          <NuxtLink to="/login">
            {{ formData.email }}
          </NuxtLink>
        </div>
        <div>
          <main-button-admin
            :name="$t('go_to_login')"
            @click="redirectPageLogin"
            @keyup.enter="redirectPageLogin"
          />
        </div>
        <span>{{ $t("do_not_receive_email") }}</span>
        <span class="re-send" @click="resendMail">{{
          $t("button.resend")
        }}</span>
      </div>
    </div>
    <div v-else class="main-forgot">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="forgotPasswordRules"
        class="form-forgot"
        @keyup.enter="submitForm(formRef)"
      >
        <div class="form-header">
          <div class="image-logo">
            <big-arxia-admin />
          </div>
          <div class="title-forgot">{{ $t("title_screen.forgot_pass") }}</div>
          <div class="text-service">
            {{ $t("proceed_with_next") }}
          </div>
        </div>
        <div>
          <div class="required-field">
            {{ $t("email_address") }}
          </div>
          <el-form-item
            class="form-item"
            prop="email"
            :error="errorData.email?.[0]"
          >
            <InputText
              v-model="formData.email"
              :placeholder="$t('placeholder.email')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              :maxlength="MAX_LENGTH_EMAIL"
            />
          </el-form-item>
        </div>
        <div class="box-item">
          <div class="box-item__name first_name">
            <div class="required-field">
              {{ $t("sur_name") }}
            </div>
            <el-form-item
              class="form-item"
              prop="first_name_kana"
              :error="errorData.first_name_kana?.[0]"
            >
              <InputText
                v-model="formData.first_name_kana"
                :placeholder="$t('placeholder.first_name_kana')"
                :maxlength="MAX_LENGTH_FIRST_NAME"
                @input="formatInputKatakana($event, 'first_name_kana', formRef)"
              />
            </el-form-item>
          </div>
          <div class="box-item__name last-name">
            <div class="required-field">
              {{ $t("may_name") }}
            </div>
            <el-form-item
              class="form-item"
              prop="last_name_kana"
              :error="errorData.last_name_kana?.[0]"
            >
              <InputText
                v-model="formData.last_name_kana"
                :placeholder="$t('placeholder.last_name_kana')"
                :maxlength="MAX_LENGTH_LAST_NAME"
                @input="formatInputKatakana($event, 'last_name_kana', formRef)"
              />
            </el-form-item>
          </div>
        </div>
        <div class="text-note">
          {{ $t("please_enter_the_name") }}
        </div>
        <div>
          <div class="required-field">
            {{ $t("phone_number") }}
          </div>
          <el-form-item
            class="form-item"
            prop="phone_number"
            :error="errorData.phone_number?.[0]"
          >
            <InputPhone
              v-model="formData.phone_number"
              :placeholder="$t('placeholder.phone')"
              :maxlength="MAX_LENGTH_PHONE_NUMBER"
            />
          </el-form-item>
        </div>
        <div>
          <div class="required-field">{{ $t("birthday") }}</div>
          <client-only>
            <el-form-item
              class="form-item"
              prop="birth_day"
              :error="errorData.birth_day?.[0]"
            >
              <InputDate
                v-model="formData.birth_day"
                :placeholder="$t('placeholder.birthday')"
                clearable
              />
            </el-form-item>
          </client-only>
        </div>
        <div class="group-button">
          <ButtonGray
            :name="$t('button.prev_login')"
            @click="redirectPageLogin"
          />
          <main-button-admin
            :loading="loading"
            :name="$t('button.send_mail')"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "#imports";
import type { FormInstance } from "element-plus";
import forgotPasswordRules from "../../validates/forgotPassword";
import InputText from "../../../shared/components/input/InputText.vue";
import InputPhone from "../../../shared/components/input/Phone.vue";
import InputDate from "../../../shared/components/input/Date.vue";
import ButtonGray from "../../../shared/components/button/ButtonGray.vue";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_EMAIL,
} from "~/../../src/shared/utils/validate";
import { forgotPasswordApi } from "~/../../src/shared/api/all/authApi";
import { i18n } from "~/../../src/shared/plugins/i18n";
import BigArxiaAdmin from "~/../../src/shared/components/icon/BigArxiaAdmin.vue";
import {
  forgotPasswordFailed,
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { ROLES } from "~/../../src/shared/constants/roles";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { formatInputKatakana } from "~/../../src/shared/utils";
import MainButtonAdmin from "~/../../src/shared/components/button/MainButtonAdmin.vue";

definePageMeta({ layout: "guest" });

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const router = useRouter();
const loading = ref(false);
const errorData = ref({});

const formData = reactive({
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  birth_day: "",
  role_type: ROLES.ADMIN,
});

const isSuccess = ref(false);

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        errorData.value = {};
        loading.value = true;
        await forgotPasswordApi(formData);
        isSuccess.value = true;
      } catch (error: any) {
        if (error.response?.status === STATUS_CODE.AUTHENTICATION) {
          messageError(error.response?._data?.message);
        } else if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          forgotPasswordFailed();
        } else if (error.response?.status === STATUS_CODE.TOO_MANY_REQUEST) {
          messageError("errors.resend_error");
        } else {
          forgotPasswordFailed();
        }
      } finally {
        loading.value = false;
      }
    }
  });
};

const redirectPageLogin = () => {
  router.push({ path: "/login" });
};

const resendMail = async () => {
  try {
    await forgotPasswordApi(formData);
    messageSuccess("success.resend_success");
  } catch (error) {
    messageError("errors.resend_error");
  }
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.forgot-password {
  background-image: $bg-guest;
  height: 100vh;
}

.main-forgot {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-guest;
}

.form-forgot {
  line-height: 22px;

  .form-header {
    text-align: center;
  }

  .box-item {
    display: flex;

    &__name {
      width: 308px;
    }

    .first_name {
      margin-right: 24px;
    }
  }

  .group-button .button-submit {
    width: 308px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    margin-bottom: 24px;

    .input-text,
    .input-password,
    .input-date {
      width: 640px;
    }

    .input-date {
      height: 40px;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .title-forgot {
    color: $black-80;
    font-size: 20px;
    line-height: 32px;
    font-weight: 400;
    margin-top: 32px;
  }

  .text-service {
    color: $black-80;
    font-size: 16px;
    margin-top: 8px;
    margin-bottom: 32px;
  }

  .form-footer {
    display: flex;
    justify-content: center;
    padding: 24px 0;
  }

  .text-note {
    text-align: center;
    font-size: 12px;
    margin-top: -12px;
    color: $black-60;
  }
}

.send-success {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__body {
    text-align: center;

    .re-send {
      color: $blue;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
    .icon-mail {
      margin-top: 50px;
    }

    .mail-to {
      margin-top: 8px;

      a {
        color: #409eff;
        text-decoration: none;
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    .title-forgot {
      font-size: 20px;
      line-height: 36px;
      font-weight: 400;
      text-align: center;
      margin: 24px 0;
    }

    .button-submit {
      width: 400px;
      margin: 24px 0;
      font-size: 16px;
    }
  }
}
</style>
