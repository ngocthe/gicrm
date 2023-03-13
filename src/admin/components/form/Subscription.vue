<template>
  <div class="subscription-container">
    <div class="left">
      <div class="plan-fee">
        <div class="title-text">{{ $t("booking.plan_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column prop="plan_name" :label="$t('plan')" width="160px">
              <template #default="scope">
                <span v-if="scope.row.plan_name">
                  {{ $t("plans_" + scope.row.plan_name) }}
                </span>
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
              <template #default> - </template>
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
            <el-table-column prop="date" width="180px" :label="$t('date')">
              <template #default="scope">{{
                formatDate(scope.row.date, "YYYY年MM月")
              }}</template>
            </el-table-column>
            <el-table-column
              prop="option_fee"
              :label="$t('booking.fee')"
              align="right"
              header-align="left"
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
            {{ priceDisplay(data?.subscription_fee) }}{{ $t("yen") }}
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="plan-fee">
        <div class="title-text">{{ $t("store_information") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column
              prop="store_name"
              :label="$t('store_name')"
            ></el-table-column>
            <el-table-column prop="period" :label="$t('period')" width="180px">
              <template #default="scope">{{
                formatDate(scope.row.period, "YYYY年MM月")
              }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { ref, toRefs, computed } from "vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { DetailReportRevenue } from "../../models";
import { i18n } from "~/../../src/shared/plugins/i18n";

interface Prop {
  data: DetailReportRevenue;
}
const { t } = i18n.global;
const props = defineProps<Prop>();
const { data } = toRefs(props);

const tableData = computed(() => {
  let array: any = [];
  if (data.value && data.value?.detail) {
    array = [
      {
        title: t("admin.line"),
        date: data.value.date,
        price: Number(data.value.detail.line_fee) || 0,
      },
      {
        title: t("sms_booking"),
        date: data.value.date,
        price: Number(data.value.detail.sms_monthly_fee) || 0,
      },
    ];
    // array.push({
    //   title: t("admin.line"),
    //   date: data.value.period,
    //   price: data.value.line_fee || 0,
    // });
    // {
    //   title: t("external_site"),
    //     date: data.value.month,
    //   price: data.value.booking_fee || 0,
    // },
    // array.push({
    //   title: t("admin.booking_fee"),
    //   date: data.value.paid_at,
    //   price: data.value.booking_fee || 0,
    // });
  }
  return array;
});

const tableDataSubscription = computed(() => {
  const array = [];
  if (data.value) {
    array.push(data.value);
  }
  return array;
});
</script>
<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.subscription-container {
  display: flex;
  gap: 96px;
  margin-right: 16px;
  margin-left: 16px;

  .left {
    flex: 1;

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

  .right {
    flex: 1;
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
