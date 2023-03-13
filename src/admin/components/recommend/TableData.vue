<template>
  <div class="store-recommended">
    <CommonSearchContentComponent>
      <template #form-search>
        <div v-if="type === POSITION_RECOMMEND.TOP" class="title-table">
          {{ $t("admin.narrowing_condition") }}
        </div>
        <div v-if="type === POSITION_RECOMMEND.BOTTOM" class="title-table">
          {{ $t("list_recommend") }}
        </div>
        <el-form
          label-position="left"
          inline
          class="form-search"
          :model="formSearch"
          @keyup.enter="handleSearch"
        >
          <el-form-item :label="$t('store_code')">
            <InputText
              v-model="formSearch.store_code"
              :placeholder="$t('placeholder.store_code')"
            />
          </el-form-item>
          <el-form-item :label="$t('store_name')">
            <InputText
              v-model="formSearch.store_name"
              :placeholder="$t('placeholder.enter_store_name')"
              :width="'240px'"
            />
          </el-form-item>
          <el-form-item
            v-if="type === POSITION_RECOMMEND.BOTTOM"
            :label="$t('plan')"
          >
            <client-only>
              <el-select v-model="formSearch.plan_id" :placeholder="$t('news')">
                <el-option :value="null" :label="$t('all')"></el-option>
                <el-option
                  v-for="item in planData"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></el-option>
              </el-select>
            </client-only>
          </el-form-item>
          <el-form-item :label="$t('industry')" class="align-items-center">
            <ClientOnly>
              <el-select
                v-model="formSearch.type_store_id"
                :default-first-option="true"
              >
                <el-option :value="null" :label="$t('all')"></el-option>
                <el-option
                  v-for="item in filterDataTypeStore"
                  :key="item.id"
                  :label="$t(item.name)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </ClientOnly>
          </el-form-item>
          <ButtonSearch :loading="isLoadingSearch" @click="handleSearch" />
        </el-form>
      </template>
    </CommonSearchContentComponent>
    <div class="custom-table">
      <client-only>
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :data="tableData"
          border
          row-class-name="table-row"
          header-row-class-name="table-header"
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          @sort-change="headerSort"
        >
          <el-table-column
            :label="$t('order')"
            min-width="80px"
            type="index"
            :index="columnIndex"
          />
          <el-table-column :label="$t('store_code')" width="150px">
            <template #default="scope">
              <span> {{ scope.row.code }} </span>
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
                    params: { id: scope.row.id },
                  })
                "
              >
                {{ scope.row.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('industry')"
            class="column-point"
            width="160px"
            prop="plan"
          >
            <template #default="scope">
              <span>{{ scope.row.model_has_type?.type?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('plan')"
            class="column-point"
            width="200px"
            prop="plan"
          >
            <template #default="scope">
              <span>{{
                scope.row.plan?.plan_data?.name
                  ? $t("plans_" + scope.row.plan?.plan_data?.name)
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('genre_type')"
            class="genre_type"
            min-width="180px"
          >
            <template #default="scope">
              {{ getTagStore(scope.row.model_has_tag) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('number_of_evaluations')"
            class="column-point"
            min-width="130px"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="rating_count_review"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span> {{ scope.row.reviews?.[0]?.count_review || 0 }} </span>
              <span>{{ $t("subject_unit") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('evaluation_score')"
            class="column-point"
            width="210px"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="rating_avg"
          >
            <template #default="scope">
              <StoreEvaluateStartComponent
                :model-value="
                  formatPriceFromMath(scope.row?.reviews?.[0]?.avg, 2) || 0
                "
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('number_of_reservations')"
            class="column-point"
            min-width="130px"
            prop="sum_real_booking"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span>
                {{ scope.row.store_statistics_all_time?.sum_real_booking }}
              </span>
              <span>{{ $t("times") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('number_of_access')"
            class="column-point"
            min-width="130px"
            prop="sum_real_access"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span>
                {{ scope.row.store_statistics_all_time?.sum_real_access }}
              </span>
              <span>{{ $t("times") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('registration_date_store')"
            class="column-point"
            width="180px"
            prop="created_at"
          >
            <template #default="scope">
              <span>{{
                formatDate(scope.row.created_at, "YYYY年MM月DD日")
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
    <div class="footer">
      <div class="group-button">
        <CommonPagination
          :current-page="pagination.currentPage"
          :default-record="pagination.numberRecordPerPage"
          :total="pagination.total"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import RecommendRequest from "~/../../src/shared/requests/RecomendedRequest";
import { RecommendInterface } from "~/../../src/admin/models/recomment";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "../../../shared/components/input/InputText.vue";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { POSITION_RECOMMEND } from "~/../../src/shared/constants/positionRecommend";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { planNameData, PLAN_NAME } from "~/../../src/shared/constants";
import { customIndex } from "~/../../src/shared/utils";
import {
  getTagStore,
  formatPriceFromMath,
  findObj,
} from "~/../../src/shared/utils";
import StoreEvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  type: number;
}

const dataStore = DataTableStore();
const props = withDefaults(defineProps<Prop>(), {
  type: POSITION_RECOMMEND.TOP,
});
const { t } = i18n.global;
const tableData = ref<RecommendInterface[]>([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const noData = ref(t("no_data"));
const { type } = toRefs(props);

const formSearch = ref({
  position: type.value === POSITION_RECOMMEND.TOP ? "top" : "bottom",
  store_code: "",
  store_name: "",
  plan_id: null,
  type_store_id: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const planData = computed(() => {
  return planNameData.filter((item) => {
    if (item.value === PLAN_NAME.PREMIUM || item.value === PLAN_NAME.STANDARD) {
      return item;
    }
  });
});

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataRecommend();
    if (type.value === POSITION_RECOMMEND.TOP) {
      dataStore.RecommendTopList.search = formSearch.value;
    } else {
      dataStore.RecommendBottomList.search = formSearch.value;
    }
    if (!tableData.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  if (type.value === POSITION_RECOMMEND.TOP) {
    dataStore.RecommendTopList.currentPage = val;
  } else {
    dataStore.RecommendBottomList.currentPage = val;
  }
  try {
    isLoadingTable.value = true;
    await getDataRecommend();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataRecommend();
  if (type.value === POSITION_RECOMMEND.TOP) {
    dataStore.RecommendTopList.currentPage = 1;
    dataStore.RecommendTopList.pageSize = val;
  } else {
    dataStore.RecommendBottomList.currentPage = 1;
    dataStore.RecommendBottomList.pageSize = val;
  }
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  if (type.value === POSITION_RECOMMEND.TOP) {
    dataStore.RecommendTopList.sort = sortTable;
  } else {
    dataStore.RecommendBottomList.sort = sortTable;
  }
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getDataRecommend();
  isLoadingTable.value = false;
};

const getDataRecommend = async () => {
  try {
    isLoadingTable.value = true;
    const response = (
      await RecommendRequest.list<RecommendInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = response.data;
    pagination.total = response.pagination?.total;
    pagination.currentPage = response.pagination?.current_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (type.value === POSITION_RECOMMEND.TOP) {
    if (dataStore.RecommendTopList.sort) {
      sortTable.direct = dataStore.RecommendTopList.sort?.direct || "";
      sortTable.order_by =
        dataStore.RecommendTopList.sort?.order_by || SORT_ORDER.DESC;
    }
    if (dataStore.RecommendTopList.search) {
      formSearch.value.type_store_id =
        dataStore.RecommendTopList.search?.type_store_id || null;
      formSearch.value.plan_id =
        dataStore.RecommendTopList.search.plan_id || null;
      formSearch.value.store_name =
        dataStore.RecommendTopList.search.store_name || "";
    }
    if (dataStore.RecommendTopList.pageSize) {
      pagination.numberRecordPerPage = dataStore.RecommendTopList.pageSize;
    }
    if (dataStore.RecommendTopList.pageSize) {
      pagination.numberRecordPerPage = dataStore.RecommendTopList.pageSize;
    }
    if (dataStore.RecommendTopList.currentPage) {
      pagination.currentPage = dataStore.RecommendTopList.currentPage;
    }
  } else {
    if (dataStore.RecommendBottomList.sort) {
      sortTable.direct = dataStore.RecommendBottomList.sort?.direct || "";
      sortTable.order_by =
        dataStore.RecommendBottomList.sort?.order_by || SORT_ORDER.DESC;
    }
    if (dataStore.RecommendBottomList.search) {
      formSearch.value.type_store_id =
        dataStore.RecommendBottomList.search?.type_store_id || null;
      formSearch.value.plan_id =
        dataStore.RecommendBottomList.search.plan_id || null;
      formSearch.value.store_name =
        dataStore.RecommendBottomList.search.store_name || "";
    }
    if (dataStore.RecommendBottomList.pageSize) {
      pagination.numberRecordPerPage = dataStore.RecommendBottomList.pageSize;
    }
    if (dataStore.RecommendBottomList.currentPage) {
      pagination.currentPage = dataStore.RecommendBottomList.currentPage;
    }
  }
  await getDataRecommend();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.store-recommended {
  :deep(.el-form) {
    .el-form-item {
      .el-form-item__label {
        width: auto !important;
        margin-right: 37px;
      }

      .el-form-item__content {
        .el-input,
        .el-select {
          width: 240px !important;
          height: 40px;
        }
      }
    }

    button {
      margin-bottom: 20px;
    }
  }

  :deep(.box__input-date) .el-input .title-table {
    padding: 20px 0;
  }

  .title-table {
    padding: 20px 0;
  }

  .icon-button {
    margin-right: 15px;
    margin-left: 5px;
    cursor: pointer;
  }

  .footer {
    .group-button {
      padding: 18px 0;
    }
  }
}
</style>
