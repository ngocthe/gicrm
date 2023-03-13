<template>
  <div class="subscription-container">
    <div class="left">
      <el-form>
        <el-form-item :label="$t('period')">
          <el-date-picker
            :model-value="data?.month"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月"
            disabled
          />
        </el-form-item>
      </el-form>
      <div class="plan-fee">
        <div class="title-text">{{ $t("admin.booking_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column prop="plan" :label="$t('date')">
              {{ formatDate(data?.month, "YYYY年MM月") }}
            </el-table-column>
            <el-table-column
              prop="payment_options"
              :label="$t('store.number_of_reservation')"
            >
              <template #default> {{ data?.number_booking || 0 }} </template>
            </el-table-column>
            <el-table-column prop="plan_fee" :label="$t('booking.fee')">
              <template #default>
                {{ priceDisplay(data?.booking_fee) || 0 }}{{ $t("yen") }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="plan-fee">
        <div class="title-text">{{ $t("booking.plan_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column prop="plan" :label="$t('plan')" width="160px">
              <template #default="scope">
                <span v-if="scope.row.plan_name">
                  {{ $t("plans_" + scope.row.plan_name) }}</span
                >
                <span v-else>{{ $t("plans_free") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payment_options"
              :label="$t('booking.payment_options')"
            >
              <template #default> - </template>
            </el-table-column>
            <el-table-column prop="plan_fee" :label="$t('booking.fee')">
              <template #default="scope">
                <span v-if="scope.row.plan_fee"
                  >{{ priceDisplay(scope.row.plan_fee) }}{{ $t("yen") }}</span
                >
                <span v-else> - </span></template
              >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="option_fee">
        <div class="title-text">{{ $t("booking.option_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableData" border>
            <el-table-column
              prop="title"
              :label="$t('option')"
            ></el-table-column>
            <el-table-column prop="date" :label="$t('date')" width="180px">
              <template #default="scope">{{
                formatDate(scope.row.date, "YYYY年MM月")
              }}</template>
            </el-table-column>
            <el-table-column
              prop="option_fee"
              :label="$t('booking.fee')"
              align="right"
            >
              <template #default="scope">
                {{ priceDisplay(scope.row.price) || 0 }}{{ $t("yen") }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="total">
          <div>{{ $t("total") }}</div>
          <div class="display-price">
            {{ priceDisplay(data?.subscription_fee) || 0 }}{{ $t("yen") }}
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <el-form>
        <el-form-item :label="$t('store.billing_date')">
          <el-date-picker
            :model-value="data?.created_at"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('store.due_date')">
          <el-date-picker
            :model-value="data?.due_date"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('store.date_of_payment')">
          <el-date-picker
            :model-value="data?.paid_at"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('payment_status')">
          <el-select
            :model-value="
              findObj(
                paymentStatusBookingOptions,
                'value',
                data?.payment_status
              )?.label
            "
            placeholder=" "
            disabled
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { ref, toRefs, computed } from "vue";
import priceDisplay, { formatValuePrice } from "~/../../src/shared/utils/price";
import { i18n } from "~/../../src/shared/plugins/i18n";
import IconLock from "~/../../src/admin/components/Icon/Timer.vue";
import { findObj } from "~/../../src/shared/utils";
import { paymentStatusBookingOptions } from "~/../../src/shared/constants";
import { SubscriptionInterface } from "~/../../src/store/models/subscription";

interface Prop {
  data: SubscriptionInterface;
}
const { t } = i18n.global;
const props = defineProps<Prop>();
const { data } = toRefs(props);

const tableData = computed(() => {
  let array: any = [];
  if (data.value) {
    array = [
      // {
      //   title: t("zoom"),
      //   date: data.value.month,
      //   price: data.value.zoom_fee || 0,
      // },
      {
        title: t("admin.line"),
        date: data.value.month,
        price: Number(data.value.line_fee) || 0,
      },
      // {
      //   title: t("external_site"),
      //   date: data.value.date,
      //   price: Number(data.value.detail.external_site_monthly_fee) || 0,
      // },
      // {
      // {
      //   title: t("initial_support"),
      //   date: data.value.month,
      //   price: data.value.initial_support_monthly_fee || 0,
      // },
      // {
      //   title: t("customer_attraction"),
      //   date: data.value.month,
      //   price: data.value.customer_attraction_fee || 0,
      // },
      // {
      //   title: t("submission_agency"),
      //   date: data.value.month,
      //   price: data.value.submission_agency_monthly_fee || 0,
      // },
      //   title: t("sms"),
      //   date: data.value.month,
      //   price: data.value.custom_billing_monthly_fee || 0,
      // }
      {
        title: t("sms_booking"),
        date: data.value.month,
        price: Number(data.value.sms_monthly_fee) || 0,
      },
      // {
      //   title: t("custom_billing"),
      //   date: data.value.month,
      //   price: data.value.custom_billing_monthly_fee || 0,
      // },
    ];
  }
  return array;
});

const tableDataSubscription = computed(() => {
  const array = [];
  if (data.value) {
    array.push({
      plan_name: data.value.plan_name,
      plan_fee: data.value.plan_fee,
    });
  }
  return array;
});
</script>
<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables" as *;

.subscription-container {
  display: flex;
  gap: 96px;
  min-width: 1096px;
  padding: 32px 12px;
  flex-wrap: wrap;

  .left {
    .plan-fee {
      margin-bottom: 20px;
    }

    .option_fee {
      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-left: 16px;
        padding-right: 16px;
        height: 48px;
        background-color: $blue-70;
        font-weight: 700;
        margin-bottom: 10px;

        .display-price {
          font-size: 16px;
          line-height: 26px;
        }
      }
    }
  }

  .left,
  .right {
    width: calc(100% / 2 - 60px);

    .el-form {
      .el-form-item {
        :deep(.el-form-item__label) {
          width: 152px;
          justify-content: flex-start;
        }

        :deep(.el-form-item__content) {
          width: calc(100% - 152px);

          .el-input,
          .el-select {
            height: 40px;
            width: 100%;
          }
        }
      }
    }
  }
}

.line {
  margin-top: 15px;
  border-bottom: 1px solid $gray-400;
  margin-bottom: 20px;
}

.title-text {
  font-weight: 700;
}
</style>
