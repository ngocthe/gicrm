<template>
  <div class="payment-setting-container">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("store.payment_setting") }}</Title
      >
    </Head>
    <el-scrollbar>
      <div class="payment-setting-content">
        <div class="title-item">
          <div class="left">
            <icon-univapay />
            <span class="pl-10">{{
              $t("store.univapay_payment_linkage")
            }}</span>
          </div>
          <div class="right">
            <template v-if="isStatusConnect">
              <div class="status-color linked"></div>
              <div class="status">{{ $t("store.cooperating") }}</div>
            </template>
            <template v-else>
              <div class="status-color not-linked"></div>
              <div class="status">{{ $t("store.not_linked") }}</div>
            </template>
          </div>
        </div>
        <connect-univa-pay
          ref="_refPayment"
          :data="paymentSetting"
          @set-status-payment="isStatusConnect = $event"
        />
      </div>

      <!--Payment card-->
      <!-- TODO all text label -->
      <div class="payment-setting-content">
        <div class="title-item">
          <div class="left">
            <icon-univapay />
            <span class="pl-10">{{
              $t("payment_information_to_the_system")
            }}</span>
          </div>
          <div class="right">
            <template v-if="statusPaymentCard">
              <div class="status-color linked"></div>
              <div class="status">{{ $t("store.cooperating") }}</div>
              <button-common
                v-if="true"
                color="white"
                :name="'store.disconnect'"
                :height="'32px'"
                :background-color="'#C03522'"
                class="btn-delete-connect"
                :loading="isLoadingDisconnectPaymentCard"
                @click="showModalConfirmDisconnect"
              ></button-common>
            </template>
            <template v-else>
              <div class="status-color not-linked"></div>
              <div class="status">{{ $t("store.not_linked") }}</div>
            </template>
          </div>
        </div>
        <setting-payment-card
          ref="_refSettingCardPayment"
          :data="paymentSetting"
          :status-payment="statusPaymentCard"
          @set-status-payment-card="statusPaymentCard = $event"
        />
        <ModalConfirm
          :dialog-visible="isShowModalConfirm"
          :title="$t('confirm_disconnect')"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          :loading="isLoadingDisconnectPaymentCard"
          @handle-close="handleClose"
          @handle-confirm="handleConfirm"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ConnectUnivaPay from "~/../../src/store/components/external-site/ConnectUnivaPay.vue";
import IconUnivapay from "~/../../src/store/components/Icon/IconUnivapay.vue";
import { PaymentSetting } from "~/../../src/store/models/payment";
import PaymentRequest from "~/../../src/shared/requests/PaymentRequest";
import SettingPaymentCard from "~/../../src/store/components/external-site/SettingPaymentCard.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import StorePaymentSettingRequest from "~/../../src/shared/requests/StorePaymentSettingRequest";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";
import { messageSuccess } from "~/../../src/shared/utils/notification";

interface PaymentCardStatus {
  data: boolean;
}

const _refPayment = ref();

const isStatusConnect = ref(false);
const paymentSetting = ref<PaymentSetting>();
const statusPaymentCard = ref(false);
const isLoadingDisconnectPaymentCard = ref(false);
const authStore = useAuthStore();
const storeData = useMeStore();
const isShowModalConfirm = ref(false);

paymentSetting.value = (await PaymentRequest.setting<PaymentSetting>())?.data;

isStatusConnect.value = !!paymentSetting.value?.status;

const response =
  await StorePaymentSettingRequest.getPaymentStatusStore<PaymentCardStatus>();

statusPaymentCard.value = response?.data || false;

const showModalConfirmDisconnect = () => {
  isShowModalConfirm.value = true;
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = async () => {
  await disconnectPaymentCard();
};

const disconnectPaymentCard = async () => {
  try {
    isLoadingDisconnectPaymentCard.value = true;
    await StorePaymentSettingRequest.deletePaymentCardStore();
    await getStepSetting();
    statusPaymentCard.value = false;
    messageSuccess("success.disconnect_payment_card");
  } finally {
    isShowModalConfirm.value = false;
    isLoadingDisconnectPaymentCard.value = false;
  }
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
};
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.payment-setting-container {
  height: 100%;

  .payment-setting-content {
    background-color: white;
    box-shadow: 0px 2px 4px $black-5;
    border-radius: 4px;
    padding-bottom: 24px;
    margin-bottom: 22px;

    .title-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 12px 20px;

      .left {
        display: flex;
        align-items: center;
        font-size: 16px;
      }

      .right {
        display: flex;
        align-items: center;

        .status-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.linked {
            background-color: $green-100;
          }

          &.not-linked {
            background-color: $black-40;
          }
        }

        .status {
          padding-left: 8px;

          &.not-link-title {
            padding-right: 0;
          }
        }
      }
    }

    :deep(.data-form) {
      width: 38%;
      min-width: 560px;

      .connected-status {
        .label-text {
          padding-top: 0;
        }
      }

      .setting-guide {
        margin-bottom: 33px;

        .label-text {
          padding-top: 0;
        }
      }
    }

    :deep(.confirmation-status) {
      display: flex;
      align-items: center;

      .status {
        padding-left: 8px;
      }
    }

    .btn-delete-connect {
      margin-left: 24px;
    }
  }
}
</style>
