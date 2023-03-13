<template>
  <div class="cancel-container">
    <div class="left">
      <div class="plan-fee">
        <div class="title-text">
          {{ $t("front.booking.reservation_information") }}
        </div>
        <div class="line"></div>
        <el-form>
          <el-form-item :label="$t('front.store_name')">
            <el-input :model-value="data?.store_name" disabled />
          </el-form-item>
          <el-form-item :label="$t('guest_name')">
            <el-input :model-value="data?.name" disabled />
          </el-form-item>
          <el-form-item :label="$t('date_of_visit')">
            <el-date-picker
              :model-value="data?.order_time"
              format="YYYY年MM月DD日 HH:mm"
              :prefix-icon="IconLock"
              :clearable="false"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('course_name')">
            <div v-if="data.booking_type === SALON">
              {{
                getCourseMenuBooking(
                  data.course_name,
                  data.booking_detail.menus
                )
              }}
            </div>
            <el-select v-else :model-value="data?.course_name" disabled />
          </el-form-item>
        </el-form>
      </div>
      <div class="option_fee">
        <div class="title-text">
          {{ $t("front.booking.payment_information") }}
        </div>
        <div class="line"></div>
        <el-form>
          <el-form-item :label="$t('transition_number')">
            <el-input :model-value="data?.transaction_id" disabled />
          </el-form-item>
          <el-form-item :label="$t('payment_date')">
            <el-date-picker
              :model-value="data?.paid_at"
              :prefix-icon="IconLock"
              :clearable="false"
              format="YYYY年MM月DD日 HH:mm"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('payment_type')">
            <el-select
              :model-value="PAYMENT_TYPE_DATA[data?.payment_type]"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('payment_status')">
            <el-select
              disabled
              :model-value="
                findObj(
                  paymentStatusBookingOptions,
                  'value',
                  data?.payment_status
                )?.label
              "
            />
          </el-form-item>
          <el-form-item
            :label="$t('booking.settlement_amount')"
            class="custom-price"
          >
            <el-input :model-value="priceDisplay(data?.total)" disabled />
            {{ $t("yen") }}
          </el-form-item>
          <el-form-item :label="$t('sales_date')">
            <el-date-picker
              :model-value="data?.created_at"
              format="YYYY年MM月DD日 HH:mm"
              :clearable="false"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('comments_remarks')">
            <el-input
              type="textarea"
              :rows="4"
              :model-value="data?.memo"
              disabled
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="plan-fee">
        <el-form>
          <el-form-item :label="$t('admin.date_cancel')" class="custom-label">
            <el-date-picker
              :model-value="data?.cancel_at"
              format="YYYY年MM月DD日 HH:mm"
              :prefix-icon="IconLock"
              :clearable="false"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('admin.refund_status')">
            <el-input
              :model-value="
                findObj(
                  paymentStatusBookingOptions,
                  'value',
                  data?.payment_status
                )?.label
              "
              disabled
            />
          </el-form-item>
        </el-form>
        <div class="title-text">{{ $t("cancellation_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableData" border>
            <el-table-column
              prop="store_name"
              align="right"
              header-align="left"
              :label="$t('booking.amount')"
            >
              <template #default="scope">{{
                scope.row.amount !== null
                  ? priceDisplay(scope.row.amount) + $t("yen")
                  : ""
              }}</template>
            </el-table-column>
            <el-table-column
              prop="store_name"
              :label="$t('cancel_charge')"
              align="right"
              header-align="left"
            >
              <template #default="scope">
                {{
                  !checkValueCancelCharge(scope.row.cancel_charge)
                    ? priceDisplay(scope.row.cancel_charge) + $t("yen")
                    : scope.row.cancel_charge || 0
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="store_name"
              :label="$t('cancel_fee')"
              align="right"
              header-align="left"
            >
              <template #default="scope">{{
                (priceDisplay(scope.row.cancel_fee) || 0) + $t("yen")
              }}</template>
            </el-table-column>
            <el-table-column
              prop="period"
              :label="$t('consumer_refund')"
              align="right"
              header-align="left"
            >
              <template #default="scope"
                >{{ priceDisplay(scope.row.remain) }}{{ $t("yen") }}</template
              >
            </el-table-column>
          </el-table>
        </div>
        <el-form class="custom-form-cancel">
          <el-form-item :label="$t('store.reason_cancel')">
            <el-input :model-value="data?.cancel_reason" disabled />
          </el-form-item>
          <el-form-item :label="$t('memo_cancel')">
            <el-input
              type="textarea"
              :rows="4"
              :model-value="data?.cancel_memo"
              disabled
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { computed, toRefs } from "vue";
import priceDisplay, { formatValuePrice } from "~/../../src/shared/utils/price";
import { DetailReportRevenue } from "../../models";
import IconLock from "~/../../src/admin/components/Icon/Timer.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import {
  paymentStatusBookingOptions,
  PAYMENT_TYPE_DATA,
} from "~/../../src/shared/constants";
import { findObj } from "~/../../src/shared/utils";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  data: DetailReportRevenue;
}

const props = defineProps<Prop>();
const { data } = toRefs(props);

const tableData = computed(() => {
  const array = [];
  if (data.value) {
    array.push(data.value);
  }
  return array;
});

const checkValueCancelCharge = (cancelCharge) => {
  if (cancelCharge && typeof cancelCharge === "string") {
    return cancelCharge.includes("%");
  }
  if (typeof cancelCharge === "number") {
    return false;
  }
  return true;
};
</script>
<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.cancel-container {
  display: flex;
  gap: 112px;
  margin-right: 16px;
  margin-left: 16px;

  .left {
    width: calc(50% - 56px);

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

        .display-price {
          font-size: 16px;
          line-height: 26px;
        }
      }
    }
  }

  .right {
    width: calc(50% - 56px);

    .custom-form-cancel {
      margin-top: 20px;
    }
  }

  :deep(.el-form) {
    .el-form-item {
      .el-form-item__label {
        width: 170px;
        justify-content: flex-start;
      }

      .el-form-item__content {
        .el-input,
        .el-select {
          height: 40px;
          width: 100%;
        }
      }
    }

    .custom-price {
      .el-form-item__content {
        .el-input {
          height: 40px;
          width: 229px;
          margin-right: 16px;
        }
      }
    }

    .custom-label {
      .el-form-item__label {
        color: #f56c6c;
      }

      .el-form-item__content {
        .el-input__inner {
          color: #f56c6c;
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
