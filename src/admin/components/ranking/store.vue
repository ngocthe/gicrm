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
        @sort-change="handleHeaderSort"
      >
        <el-table-column
          :label="$t('order')"
          min-width="70px"
          type="index"
          :index="columnIndex"
        />
        <el-table-column
          :label="$t('store_code')"
          width="150px"
          prop="store_code"
        >
          <template #default="scope">
            <span> {{ scope.row.stores?.code }} </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('store_name')"
          class="column-point"
          min-width="220px"
        >
          <template #default="scope">
            <div
              class="text-link"
              @click="
                $router.push({
                  name: 'stores-edit-id',
                  params: { id: scope.row.stores?.id },
                })
              "
            >
              {{ scope.row.stores?.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('plan')" class="column-point" width="200px">
          <template #default="scope">
            {{
              scope.row.stores?.plan?.plan_data?.name
                ? $t("plans_" + scope.row.stores?.plan?.plan_data?.name)
                : ""
            }}
          </template>
        </el-table-column>
        <!-- START Type Store -->
        <el-table-column
          :label="$t('industry')"
          class="column-point"
          width="160px"
        >
          <template #default="scope">
            {{ scope.row.stores?.model_has_type?.type?.name }}
          </template>
        </el-table-column>
        <!-- END Type Store -->
        <!-- START Tag Store -->
        <el-table-column
          :label="$t('genre_type')"
          class="column-point"
          min-width="150px"
        >
          <template #default="scope">
            {{ getTagStore(scope.row.stores?.model_has_tag) }}
          </template>
        </el-table-column>
        <!-- END Tag Store -->
        <el-table-column
          :label="$t('evaluation_people')"
          class="column-point"
          min-width="100px"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{
              scope.row.stores?.review[0]?.count_review
                ? priceDisplay(scope.row.stores?.review[0]?.count_review) +
                  $t("subject_unit")
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('evaluation_score')"
          class="column-point"
          width="210px"
        >
          <template #default="scope">
            <EvaluateStartComponent
              :model-value="
                formatPriceFromMath(scope.row.stores?.review?.[0]?.avg, 2)
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.DAY"
          :label="$t('number_of_reservations')"
          class="column-point"
          width="130px"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{
              priceDisplay(formatPriceFromMath(scope.row.real_booking, 2)) +
              $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.DAY"
          :label="$t('number_of_accesses')"
          class="column-point"
          width="130px"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{
              priceDisplay(formatPriceFromMath(scope.row.real_access, 2)) +
              $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.WEEK || mode === RANKING_MODE.MONTH"
          :label="$t('number_of_reservations')"
          class="column-point"
          width="130px"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{
              priceDisplay(formatPriceFromMath(scope.row.sum_real_booking, 2)) +
              $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.WEEK || mode === RANKING_MODE.MONTH"
          :label="$t('number_of_accesses')"
          class="column-point"
          width="130px"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{
              priceDisplay(formatPriceFromMath(scope.row.sum_real_access, 2)) +
              $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ranking_registration_date')"
          class="column-point"
          width="180px"
        >
          <template #default="scope">
            {{ formatDate(scope.row.stores.created_at) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('registered_person')"
          class="column-point"
          min-width="120px"
        >
          <template #default="scope">
            {{ scope.row.stores.create_user?.fullname }}
          </template>
        </el-table-column>

        <el-table-column
          v-if="mode === RANKING_MODE.DAY"
          :label="$t('tentative_reservations')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.daily_booking
              ) + $t("times")
            }}
          </template>
        </el-table-column>

        <el-table-column
          v-if="mode === RANKING_MODE.DAY"
          :label="$t('access_count')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.daily_access
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.WEEK"
          :label="$t('tentative_reservations')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.weekly_booking
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode === RANKING_MODE.WEEK"
          :label="$t('access_count')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.weekly_access
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode == RANKING_MODE.MONTH"
          :label="$t('tentative_reservations')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.monthly_booking
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="mode == RANKING_MODE.MONTH"
          :label="$t('access_count')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
        >
          <template #default="scope">
            {{
              priceDisplay(
                scope.row.stores?.admin_buff_store_ranking?.monthly_access
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('total_number_of_reservations')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
          prop="sum_total_booking"
          :sortable="type === RANKING_TYPE.SUM_TOTAL_BOOKING"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            {{
              priceDisplay(
                formatPriceFromMath(scope.row.sum_total_booking, 2)
              ) + $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('total_number_of_access')"
          class="column-point"
          min-width="190px"
          align="right"
          header-align="left"
          class-name="admin-buff-ranking"
          prop="sum_total_access"
          :sortable="type === RANKING_TYPE.SUM_TOTAL_ACCESS"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            {{
              priceDisplay(formatPriceFromMath(scope.row.sum_total_access, 2)) +
              $t("times")
            }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('action')"
          align="center"
          width="110px"
        >
          <template #default="scope">
            <IconEdit
              class="icon-button button-edit"
              @click="editRanking(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </client-only>
    <client-only>
      <ModalUpdateRanking
        :dialog-visible="dialogVisible"
        :data-ranking="rowDataRanking"
        :mode="mode"
        @handle-close-data="handleCloseData"
        @get-list-data="getListData"
      />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRefs } from "vue";
import { PaginationForm } from "~/../../src/shared/requests/types";
import { Ranking } from "~/../../src/admin/models/ranking";
import priceDisplay from "~/../../src/shared/utils/price";
import {
  formatDate,
  formatPriceFromMath,
} from "~/../../src/shared/utils/format";
import EvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { RANKING_MODE } from "~/../../src/shared/constants/ranking";
import { customIndex, getTypeSort } from "~/../../src/shared/utils";
import { SORT_ORDER } from "../../../shared/constants";
import { TagStoreModel } from "../../models";
import { RANKING_TYPE } from "~/../../src/shared/constants/ranking";

interface Prop {
  pagination: PaginationForm;
  tableData: Ranking[];
  loading: boolean;
  type: string | null;
  noData: string;
  mode: string | null;
}

const props = defineProps<Prop>();
const { pagination, tableData, type } = toRefs(props);
const dialogVisible = ref(false);
const rowDataRanking = ref({});
const emits = defineEmits([
  "headerSort",
  "handleSizeChange",
  "handleCurrentChange",
  "getListData",
]);
const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.value.currentPage,
    pagination.value.numberRecordPerPage
  );
};
const handleCloseData = () => {
  dialogVisible.value = false;
};
const editRanking = (data) => {
  dialogVisible.value = true;
  rowDataRanking.value = data;
};

const handleHeaderSort = (event: {
  prop: string;
  order: string;
  column: { property: string };
}) => {
  emits("headerSort", {
    prop: event.prop,
    order: event.order,
    column: event.column.property,
  });
};

const sortTable = reactive({
  order_by:
    type.value === RANKING_TYPE.SUM_TOTAL_BOOKING
      ? "sum_total_booking"
      : "sum_total_access",
  direct: SORT_ORDER.DESC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const getTagStore = (tag: TagStoreModel[]) => {
  if (tag.length <= 0) {
    return "";
  } else {
    let result: string[] = [];
    tag.forEach((item: TagStoreModel) => {
      result.push(item.tag_store.name);
    });
    return result.join("、 ");
  }
};

const getListData = () => {
  emits("getListData");
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
:deep(.table-row) {
  cursor: pointer;
}
:deep(.admin-buff-ranking) {
  background-color: $background-ranking-buff;
}
</style>
