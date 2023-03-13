<template>
  <div class="online-container">
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
                )
              "
            />
          </el-form-item>
          <el-form-item
            v-if="data?.incurred_amount"
            :label="$t('booking.incurred_amount')"
            class="custom-price"
          >
            <el-input
              :model-value="priceDisplay(data?.incurred_amount)"
              disabled
            />
            {{ $t("yen") }}
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
        <div class="title-text">{{ $t("admin.reserved_item") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableData" border>
            <el-table-column
              prop="title"
              width="280px"
              :label="$t('item_detail')"
            >
              <template #default="scope">
                <span v-if="data.booking_type === SALON">
                  {{
                    getCourseMenuBooking(
                      data.course_name,
                      data.booking_detail.menus,
                      data.booking_detail.staff?.name,
                      data.booking_detail.staff?.request_staff
                    )
                  }}
                </span>
                <span v-else>{{ $t("price_yen") }}{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              width="120px"
              align="right"
              header-align="left"
              :label="$t('tax_price')"
            >
              <template #default="scope">{{
                scope.row.price !== null
                  ? priceDisplay(scope.row.price) + $t("yen")
                  : ""
              }}</template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              align="right"
              header-align="left"
              :label="$t('quantity')"
            >
              <template #default="scope">{{
                scope.row.price !== null ? priceDisplay(scope.row.quantity) : ""
              }}</template>
            </el-table-column>
            <el-table-column
              prop="store_name"
              align="right"
              header-align="left"
              :label="$t('commission')"
            >
              <template #default="scope">{{
                scope.row.fee_per_person !== null
                  ? priceDisplay(scope.row.fee_per_person) + $t("yen")
                  : ""
              }}</template>
            </el-table-column>
            <el-table-column
              prop="period"
              :label="$t('fee_subtotal')"
              align="right"
              header-align="left"
              width="140px"
            >
              <template #default="scope">{{
                scope.row.fee !== null
                  ? priceDisplay(scope.row.fee) + $t("yen")
                  : ""
              }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="total">
          <div>{{ $t("total_fee") }}</div>
          <div class="display-price">
            {{ priceDisplay(dataTotal) }}{{ $t("yen") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { computed, toRefs, ref } from "vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { DetailReportRevenue } from "../../models";
import IconLock from "~/../../src/admin/components/Icon/Timer.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  paymentStatusBookingOptions,
  PAYMENT_TYPE_DATA,
} from "~/../../src/shared/constants";
import { findObj } from "~/../../src/shared/utils";
import { SALON } from "~/../../src/shared/constants/category";
import { BookingDetail } from "~/../../src/admin/models/reportRevenue";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";

interface Prop {
  data: DetailReportRevenue;
}

const props = defineProps<Prop>();
const { data } = toRefs(props);
const { t } = i18n.global;
const dataTotal = ref(0);

const tableData = computed(() => {
  const array = [];
  if (data.value && data.value.booking_type === SALON) {
    array.push({
      title: data.value.booking_detail,
      quantity: data.value.total_people,
      price: data.value.total,
      fee_per_person: data.value.fee_per_person,
      tax_price: 0,
      fee: data.value.fee_per_person * data.value.total_people,
    });
    dataTotal.value += Number(
      data.value.fee_per_person * data.value.total_people
    );
  } else if (data.value) {
    if (data.value.number_adult) {
      array.push({
        title: data.value.course_name + "（" + t("adult") + "）",
        quantity: data.value.number_adult,
        price: data.value.price,
        fee_per_person: data.value.fee_per_person,
        tax_price: 0,
        fee: data.value.fee_per_person * data.value.number_adult,
      });

      dataTotal.value += Number(
        data.value.fee_per_person * data.value.number_adult
      );
    }
    if (data.value.number_children) {
      array.push({
        title: data.value.course_name + "（" + t("child") + "）",
        quantity: data.value.number_children,
        price: data.value.children_price || 0,
        tax_price: 0,
        fee_per_person: data.value.fee_per_person,
        fee: data.value.fee_per_person * data.value.number_children,
      });
      dataTotal.value += Number(
        data.value.fee_per_person * data.value.number_children
      );
    }
  }
  return array;
});
</script>
<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.online-container {
  display: flex;
  gap: 112px;
  margin-right: 16px;
  margin-left: 16px;

  .left {
    width: calc(50% - 56px);

    .plan-fee {
      margin-bottom: 20px;
    }
  }

  .right {
    .plan-fee {
      margin-bottom: 20px;

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

.line {
  margin-top: 15px;
  border-bottom: 1px solid $gray-400;
  margin-bottom: 20px;
}

.title-text {
  font-weight: 600;
}
</style>
