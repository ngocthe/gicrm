<template>
  <div class="sale-all-container">
    <el-form
      ref="_formRef"
      label-position="left"
      label-width="160px"
      class="form-data"
      :model="formData"
    >
      <el-form-item
        class="title-text"
        :label="$t('front.booking.reservation_information')"
      />
      <div class="line"></div>
      <el-form-item :label="$t('store_name')">
        <input-text v-model="formData.store_name" :disabled="true"></input-text>
      </el-form-item>
      <el-form-item :label="$t('guest_name')">
        <input-text v-model="formData.guest_name" :disabled="true"></input-text>
      </el-form-item>
      <ClientOnly>
        <el-form-item :label="$t('start_date')">
          <el-date-picker
            v-model="formData.start_date"
            :editable="false"
            type="datetime"
            format="YYYY年MM月DD日 HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled="true"
            :clearable="false"
          />
        </el-form-item>
      </ClientOnly>
      <el-form-item :label="$t('course_name')">
        <input-text
          v-model="formData.course_name"
          :disabled="true"
        ></input-text>
      </el-form-item>
      <el-form-item
        class="title-text"
        :label="$t('front.booking.payment_information')"
      />
      <div class="line"></div>
      <el-form-item :label="$t('transition_number')">
        <input-text
          v-model="formData.transaction_id"
          :disabled="true"
        ></input-text>
      </el-form-item>
      <ClientOnly>
        <el-form-item :label="$t('payment_date')">
          <el-date-picker
            v-model="formData.payment_date"
            :editable="false"
            type="datetime"
            format="YYYY年MM月DD日 HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled="true"
            :clearable="false"
          />
        </el-form-item>
      </ClientOnly>
      <el-form-item :label="$t('payment_type')">
        <ClientOnly>
          <el-select v-model="formData.payment_type" :disabled="true">
            <el-option
              v-for="item in PaymentMethod"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </ClientOnly>
      </el-form-item>
      <el-form-item :label="$t('payment_status')">
        <ClientOnly>
          <el-select v-model="formData.status_payment" :disabled="true">
            <el-option
              v-for="item in reservationStatusOptions"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </ClientOnly>
      </el-form-item>
      <el-form-item :label="$t('booking.settlement_amount')">
        <input-price
          v-model="formData.amount"
          :disabled="true"
          class="input-price"
        />
        <span>{{ $t("yen") }}</span>
      </el-form-item>
      <el-form-item class="custom-date" :label="$t('sales_date')">
        <input-date
          v-model="formData.sales_date"
          :is-disable="true"
        ></input-date>
      </el-form-item>
      <el-form-item :label="$t('comments_remarks')">
        <el-input
          v-model="formData.comment"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="form-data"></div>
  </div>
</template>
<script lang="ts" setup>
import { i18n } from "~/../../src/shared/plugins/i18n";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { reservationStatusOptions } from "~/../../src/shared/constants/reservation";
import { PaymentMethod } from "~/../../src/shared/constants/payment";

const { t } = i18n.global;

const formData = {
  store_name: "ABC店舗",
  guest_name: "田中",
  start_date: "2022年10月27日 17:30",
  payment_date: "2022年10月27日 17:30",
  sales_date: "2022年10月27日",
  course_name: "コース・メニュー",
  transaction_id: "123acbx",
  status_payment: 1,
  payment_type: 1,
  amount: "12212",
  comment: "コメント・備考",
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

:deep(.el-select) {
  width: 100%;

  .el-input {
    height: 40px;
  }
}
:deep(.el-textarea__inner) {
  height: 80px;
}
.sale-all-container {
  display: flex;

  .form-data {
    flex: 1;
    margin-bottom: 17px;

    .title-text {
      font-weight: 700;
    }

    :deep(.input-price) {
      width: 40% !important;
      margin-right: 16px;
    }

    .line {
      border-bottom: 1px solid $gray-400;
      margin-bottom: 20px;
    }
  }
}

:deep(.custom-date) {
  .el-input__wrapper {
    flex-direction: row-reverse;
  }
}
</style>
