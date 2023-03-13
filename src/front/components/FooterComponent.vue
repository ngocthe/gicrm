<template>
  <footer>
    <div class="inner-footer">
      <div class="left"></div>
      <div class="right">
        <h1>{{ $t("register_store") }}</h1>
        <div class="description">
          <p>
            {{ $t("description_register_store_1") }}
          </p>
          <p>
            {{ $t("description_register_store_2") }}
          </p>
        </div>
        <el-button @click="registerStore">
          <IconStore />
          <p>{{ $t("go_to_register_store") }}</p>
          <IconNextRegister />
        </el-button>
      </div>
    </div>
  </footer>
  <div class="info">
    <div class="logo">
      <big-arxia class="hidden-md-and-down" />
      <ArxiaLogoMobile class="hidden-lg-and-up" />
    </div>
    <div class="policy">
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'index' })"
      >
        <IconHomeWhite />
      </div>
      <div class="border-space"></div>
      <div class="policy-link__page border-right">
        <a target="_blank" href="https://jp.ar-xia.com/terms/">{{
          $t("term_of_service")
        }}</a>
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'privacy' })"
      >
        {{ $t("privacy_policy") }}
      </div>
      <div class="border-space"></div>
      <div class="policy-link__page border-right">
        <a target="_blank" href="https://jp.ar-xia.com/legal-notice/">
          {{ $t("transaction_law") }}
        </a>
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'frequent-question' })"
      >
        {{ $t("help_contact") }}
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page"
        @click="$router.push({ name: 'company-introduction' })"
      >
        {{ $t("management_company") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRuntimeConfig } from "nuxt/app";
import BigArxia from "~/../../src/shared/components/icon/BigArxia.vue";
import ArxiaLogoMobile from "~/../../src/shared/components/icon/ArxiaLogoMobile.vue";

const registerStore = () => {
  const config = useRuntimeConfig();
  window.open(`${config.urlStore}store/registration-application`, "_blank");
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

footer {
  z-index: 2026;
  color: $white-color;
  height: 320px;
  background-color: $background-logo;

  .inner-footer {
    padding: 0 12.5%;
    display: flex;
    gap: 16px;
    justify-content: space-between;

    .left,
    .right {
      width: 343px;
      margin-top: 70px;

      h1 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 32px;
      }

      .description {
        margin-bottom: 24px;
        p {
          line-height: 24px;
        }
      }

      .address {
        margin-bottom: 16px;
      }
    }

    .right {
      text-align: left;

      :deep(.el-button) {
        height: 48px;
        width: 232px;
        border-radius: 50px;
        border: 2px solid #ececec;
        background: #ececec;
        padding: 16px 32px;
        color: #d70035;
        font-weight: 500;
        font-size: 16px;

        &:hover {
          background-color: #d70035;
          color: white;

          svg {
            path {
              fill: $white-color;
            }
          }
        }

        span {
          gap: 9px;
        }
      }
    }
  }
}

.info {
  z-index: 2026;
  border-top: 1px solid $white-30;
  padding: 4px 12.5%;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  .logo {
    display: flex;
    svg {
      height: 48px;
      width: 100%;
    }
  }

  .policy {
    display: flex;
    flex-wrap: wrap;
    color: $white-color;
    align-items: center;

    .policy-link__page {
      cursor: pointer;
    }

    a {
      color: white;
      text-decoration: none;
    }

    .border-right {
      display: flex;
      align-items: center;
    }

    .border-space {
      height: 16px;
      width: 1px;
      background-color: $white-20;
      margin: 0 16px;
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  footer {
    height: auto;
    padding-bottom: 36px;
    background-position: right 50% bottom 100%;
    background-size: cover;

    .inner-footer {
      padding: 0 12.5%;

      .left,
      .right {
        margin-top: 24px;

        h1 {
          margin-bottom: 32px;
        }

        .address {
          margin-bottom: 14px;
        }
      }
    }
  }

  .info {
    padding: 4px 12.5%;

    .policy {
      gap: 24px;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  footer {
    .inner-footer {
      padding: 0 16px;
      flex-direction: column;
      .left {
        margin-top: 0;
      }
      .right {
        margin-top: 24px;

        h1 {
          margin-bottom: 16px;
          line-height: 30px;
        }

        .email {
          display: flex !important;
        }

        .address {
          margin-bottom: 14px;
        }
      }
      .right {
        align-self: end;
      }
    }
  }
  .info {
    padding: 24px 16px;

    .logo {
      svg {
        width: 200px;
        height: 100%;
      }
    }

    .policy {
      gap: 16px 0;
    }
  }
}
</style>
