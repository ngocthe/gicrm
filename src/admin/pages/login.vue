<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("title_screen.login") }} </Title>
  </Head>
  <div class="login">
    <div class="main-login">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="loginRules"
        class="form-login"
      >
        <div>
          <div class="border-form">
            <big-arxia-admin />
            <div class="title-login">{{ $t("title_login") }}</div>
            <el-form-item class="form-item" prop="email">
              <IconUser class="icon-input" />
              <InputText
                v-model="formData.email"
                :placeholder="$t('placeholder.email')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                :maxlength="MAX_LENGTH_EMAIL"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
            <el-form-item class="form-item" prop="password">
              <IconLock class="icon-input" />
              <InputPassword
                v-model="formData.password"
                :placeholder="$t('placeholder.password')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
            <div class="text-forgot">
              <NuxtLink to="/forgot-password" class="text-forgot__password">
                {{ $t("title_screen.forgot_pass") }}
              </NuxtLink>
            </div>
            <el-form-item>
              <main-button-admin
                :name="$t('button.login')"
                :loading="loading"
                @click="submitForm(formRef)"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="copy-right">
      {{ $t("copy_right") }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import loginRules from "../validates/login";
import type { FormInstance } from "element-plus";
import { useCookie, useRouter } from "nuxt/app";
import { MAX_LENGTH_EMAIL } from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { ROLES } from "../../shared/constants/roles";
import InputText from "../../shared/components/input/InputText.vue";
import InputPassword from "../../shared/components/input/InputPassword.vue";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import { useMeStore } from "~/../../src/shared/stores/me";
import BigArxiaAdmin from "~/../../src/shared/components/icon/BigArxiaAdmin.vue";
import { loginFailed } from "~/../../src/shared/utils/notification";
import MainButtonAdmin from "~/../../src/shared/components/button/MainButtonAdmin.vue";

definePageMeta({
  layout: "guest",
});

const router = useRouter();
const { t } = i18n.global;
const meStore = useMeStore();
const loading = ref(false);
const formRef = ref<FormInstance>();
const formData = reactive({
  email: "",
  password: "",
  role_type: ROLES.ADMIN,
});
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  const valid = await new Promise((resolve) => {
    form.validate(async (valid) => {
      resolve(valid);
    });
  });
  if (valid) {
    try {
      loading.value = true;
      const data = await authRequest.login(formData);
      if (data.data?.token) {
        cookieToken.value = data.data.token;
        await nextTick(async () => {
          await meStore.fetchUpdate();
          const redirect = useCookie(persistKeys.REDIRECT);
          if (redirect.value) {
            await router.push(redirect.value);
            redirect.value = null;
          } else {
            await router.push({ path: "/" });
          }
        });
      }
    } catch (e) {
      loginFailed();
      return e;
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.login {
  background-image: $bg-guest;
  font-size: 14px;

  .main-login {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .form-login {
      text-align: center;

      :deep(.el-form-item__content) {
        margin-left: 0 !important;
        margin-bottom: 24px;

        .input-text,
        .input-password,
        .button-submit {
          width: 400px;
        }

        .el-input__inner {
          margin-left: 30px;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 0;
      }

      .title-login {
        color: $black-80;
        font-size: 20px;
        line-height: 36px;
        font-weight: 400;
        text-align: center;
        margin: 24px 0;
      }

      .text-forgot {
        line-height: 22px;
        margin-bottom: 24px;

        &__password {
          color: $blue;
          text-decoration: none;
        }
      }

      :deep(.button-submit) {
        margin-bottom: -16px;
      }

      .form-item {
        position: relative;
      }

      .icon-input {
        position: absolute;
        z-index: 99;
        left: 15px;
        top: 10px;
      }
    }
  }

  .copy-right {
    text-align: center;
    height: 10vh;
  }
}
</style>
