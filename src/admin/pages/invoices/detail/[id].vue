<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.payment_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.payment_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <el-form
        class="container-edit-payment"
        label-width="180px"
        label-position="left"
      >
        <el-form-item :label="$t('reservation_number')">
          <div
            class="text-link text-underline cursor-pointer"
            @click="redirectReservation"
          >
            {{ invoiceDetail.reservation_code }}
          </div>
        </el-form-item>
        <el-form-item class="form-item amount" :label="$t('settlement_amount')">
          <InputPrice
            v-model="invoiceDetail.amount"
            :disabled="true"
          ></InputPrice>
          <span>{{ $t("yen") }}</span>
        </el-form-item>

        <el-form-item class="form-item" :label="$t('admin.payment_number')">
          <InputText v-model="invoiceDetail.id" :disabled="true"></InputText>
        </el-form-item>
        <el-form-item :disabled="true" class="form-item" :label="$t('status')">
          <client-only>
            <el-select v-model="payment_status" :disabled="true"> </el-select>
          </client-only>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('store_name')">
          <InputText
            v-model="invoiceDetail.store_name"
            :disabled="true"
          ></InputText>
        </el-form-item>
        <br />
        <el-form-item class="form-item" :label="$t('full_name_kanji')">
          <InputText v-model="invoiceDetail.name" :disabled="true"></InputText>
        </el-form-item>
        <br />
        <el-form-item class="form-item" :label="$t('email_address')">
          <InputText v-model="invoiceDetail.email" :disabled="true"></InputText>
        </el-form-item>
        <br />
        <el-form-item class="form-item" :label="$t('date_time_use')">
          <input-date
            v-model="invoiceDetail.created_at"
            class="input-date"
            type="datetime"
            format="YYYY年MM月DD日 HH:mm"
            value-format="YYYY年MM月DD日 HH:mm"
            :is-disable="true"
          />
        </el-form-item>
        <br />
        <el-form-item class="form-item" :label="$t('card_type')">
          <InputText v-model="payment_type" :disabled="true"></InputText>
        </el-form-item>
        <br />
        <el-form-item class="form-item" :label="$t('content')">
          <el-input
            v-model="invoiceDetail.memo"
            :disabled="true"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import InputDate from "../../../../shared/components/input/Date.vue";
import InputText from "../../../../shared/components/input/InputText.vue";
import InputPrice from "../../../../shared/components/input/Price.vue";
import {
  paymentStatusBookingOptions,
  PaymentMethod,
} from "~/../../src/shared/constants/payment";
import { onMounted, reactive, ref } from "vue";
import { findObj } from "~/../../src/shared/utils/array";
import priceDisplay from "~/../../src/shared/utils/price";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { useRoute, useRouter } from "#imports";
import { InvoiceInterface } from "../../../models/invoice";

const invoiceDetail = ref<InvoiceInterface | null>(null);
const route = useRoute();
const router = useRouter();

if (route.params?.id) {
  try {
    invoiceDetail.value = (
      await InvoiceRequest.show(+route.params.id as number)
    )?.data as InvoiceInterface;
    invoiceDetail.value.amount = priceDisplay(invoiceDetail.value.amount);
  } catch (_) {
    router.push({ name: "invoices" });
  }
}
const payment_status = findObj(
  paymentStatusBookingOptions,
  "value",
  invoiceDetail.value.payment_status
)?.label;

const payment_type = findObj(
  PaymentMethod,
  "value",
  invoiceDetail.value.payment_type
)?.label;

const redirectReservation = () => {
  router.push(`/reservations/detail/${invoiceDetail.value.reservation_id}`);
};
</script>

<style lang="scss" scoped>
.container-edit-payment {
  padding: 12px;
  display: grid;
  grid-template-columns: 45% 45%;
  grid-column-gap: 96px;
  align-items: center;

  .form-item {
    width: 100%;
  }
}

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.amount) {
  .el-input {
    width: calc(100% - 35px);
    margin-right: 12px;
  }
}

:deep(.el-textarea__inner) {
  height: 80px;
}
</style>
