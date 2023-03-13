<template>
  <div class="custom-table d-flex flex-column justify-content-between">
    <client-only>
      <el-table
        v-loading="loading"
        class="table-content"
        :data="tableData"
        border
        row-class-name="table-row"
        header-row-class-name="table-header"
        max-height="calc(100vh - 58px - 70px - 125px - 78px - 105px)"
        cell-class-name="text-row-2"
        :empty-text="noData"
        :default-sort="defaultSort"
        @sort-change="headerSort"
        @row-click="detailRevenue($event)"
      >
        <el-table-column
          :label="$t('date')"
          width="200px"
          prop="date"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <span v-if="mode === REVENUE_MODE.ALL">
              {{ formatDate(scope.row.date, "YYYY年MM月DD日 HH:mm") }}
            </span>
            <span v-if="mode === REVENUE_MODE.MONTH">
              {{ scope.row.year }}{{ $t("year") }}{{ scope.row.date
              }}{{ $t("monday") }}
            </span>
            <span v-if="mode === REVENUE_MODE.WEEk">
              {{ scope.row.year }}{{ $t("year") }}{{ scope.row.date
              }}{{ $t("week") }}
              {{ formatDate(scope.row.start_of_week, "　(MM/DD～)") }}
            </span>
            <span v-if="mode === REVENUE_MODE.DAY">
              {{ formatDate(scope.row.date, "YYYY年MM月DD日") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('store_code')"
          class="column-point"
          width="130px"
          prop="store_code"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        />
        <el-table-column
          :label="$t('store_name')"
          class="column-point"
          min-width="220px"
          prop="store_name"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
        </el-table-column>
        <el-table-column
          :label="$t('sale_category')"
          class="column-point"
          min-width="160px"
          prop="type"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <span v-if="scope.row.type === REVENUE.SUBSCRIPTION">
              {{ $t("subscription") }}
            </span>
            <span v-if="scope.row.type === REVENUE.CANCELLATION">
              {{ $t("cancellation_fee") }}
            </span>
            <span v-if="scope.row.type === REVENUE.ONLINE">
              {{ $t("online_payment") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('sale_amount')"
          class="column-point"
          min-width="120px"
          align="right"
          header-align="left"
          prop="total"
        >
          <template #default="scope">
            <span>
              {{
                scope.row.total !== null
                  ? priceDisplay(scope.row.total) + $t("yen")
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('commission')"
          class="column-point"
          min-width="110px"
          align="right"
          header-align="left"
          prop="fee"
        >
          <template #default="scope">
            <span>
              {{
                scope.row.fee !== null
                  ? priceDisplay(scope.row.fee) + $t("yen")
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('deposit_amount_after_deduction')"
          class="column-point"
          min-width="170px"
          align="right"
          header-align="left"
          prop="remain"
        >
          <template #default>
            <span> - </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('payment_type')"
          class="column-point"
          width="160px"
          prop="payment_type"
        >
          <template #default="scope">
            <span v-if="mode === REVENUE_MODE.ALL || !mode">
              {{ PAYMENT_TYPE_DATA[scope.row.payment_type] }}
            </span>
            <span v-else> -</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('payment_status')"
          class="column-point"
          min-width="160px"
          prop="payment_status"
        >
          <template #default="scope">
            <span v-if="mode === REVENUE_MODE.ALL || !mode">
              {{
                findObj(
                  paymentStatusBookingOptions,
                  "value",
                  scope.row.payment_status
                )?.label
              }}
            </span>
            <span v-else> -</span>
          </template>
        </el-table-column>
      </el-table>
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { useRouter } from "nuxt/app";
import { formatDate } from "~/../../src/shared/utils";
import { findObj } from "~/../../src/shared/utils";
import { ReportRevenue } from "../../models";
import { PaginationForm } from "~/../../src/shared/requests/types";
import { paymentStatusBookingOptions } from "~/../../src/shared/constants";
import { REVENUE, REVENUE_MODE } from "~/../../src/shared/constants/sale";
import priceDisplay from "~/../../src/shared/utils/price";
import { PAYMENT_TYPE_DATA } from "~/../../src/shared/constants";

const router = useRouter();

interface Prop {
  pagination: PaginationForm;
  tableData: ReportRevenue[];
  loading: boolean;
  noData: string;
  mode: string | null;
  defaultSort: object;
}

const props = defineProps<Prop>();
const { pagination, tableData } = toRefs(props);
const emit = defineEmits([
  "headerSort",
  "handleSizeChange",
  "handleCurrentChange",
]);

const detailRevenue = (val) => {
  if (val.id) {
    router.push({
      name: "revenues-detail-id",
      params: { id: val.id },
    });
  }
};

const headerSort = ({ prop, order }) => {
  emit("headerSort", { prop, order });
};
</script>

<style lang="scss" scoped>
:deep(.table-row) {
  cursor: pointer;
}
</style>
