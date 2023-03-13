<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.list_revenue") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_revenue") }}</template>
        <template #button>
          <ButtonExport
            v-if="
              tableData.length > 0 &&
              useHavePermission(Permission.RevenueExport)
            "
            :name="$t('button_export')"
            :loading="isLoadingExport"
            @click="handleExport"
          />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            label-width="120px"
            inline
            class="form-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('store_code')">
              <InputText
                v-model="formSearch.store_code"
                :placeholder="$t('store_code')"
              />
            </el-form-item>
            <el-form-item :label="$t('store_name')" class="store-name-label">
              <InputText
                v-model="formSearch.store_name"
                :placeholder="$t('store_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('payment_status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.payment_status"
                  placeholder=""
                  :default-first-option="true"
                >
                  <el-option :label="$t('all')" value=""></el-option>
                  <el-option
                    v-for="item in paymentStatusBookingOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              class="box__input-date"
              :label="$t('payment_date_time')"
              ><client-only>
                <CustomDatePicker
                  v-model="formSearch.start_date"
                  :type-date="getTypeDatePicker"
                  :placeholder="$t('start_date')"
                  class="input-date"
                  :format="formatValue"
                  :disabled-date="disabledDateStart"
                  @clear-data="clearData('start_date')"
                />
              </client-only>
              <client-only>
                <CustomDatePicker
                  v-model="formSearch.end_date"
                  :type-date="getTypeDatePicker"
                  :placeholder="$t('end_date')"
                  class="input-date"
                  :format="formatValue"
                  :disabled-date="disabledDateEnd"
                  @clear-data="clearData('end_date')"
                />
              </client-only>
            </el-form-item>
            <ButtonSearch @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <client-only>
        <el-tabs
          v-model="formSearch.type"
          type="border-card"
          @tab-change="handleChangeType"
        >
          <div class="show-radio-group">
            <el-radio-group
              v-model="formSearch.mode"
              class="d-flex-end"
              @change="handleChangeTab"
            >
              <el-radio-button :label="REVENUE_MODE.MONTH">
                {{ $t("monthly") }}
              </el-radio-button>
              <el-radio-button :label="REVENUE_MODE.WEEk">
                {{ $t("weekly") }}
              </el-radio-button>
              <el-radio-button :label="REVENUE_MODE.DAY">
                {{ $t("daily") }}
              </el-radio-button>
              <el-radio-button :label="REVENUE_MODE.ALL">
                {{ $t("all") }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <el-tab-pane :label="$t('all')" :name="REVENUE.ALL">
            <sale-all
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingSearch"
              :mode="formSearch.mode"
              :default-sort="defaultSort"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('subscription')" :name="REVENUE.SUBSCRIPTION">
            <sale-subscription
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingSearch"
              :mode="formSearch.mode"
              :default-sort="defaultSort"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
            />
          </el-tab-pane>
          <el-tab-pane
            :label="$t('cancellation_fee')"
            :name="REVENUE.CANCELLATION"
          >
            <sale-cancellation
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingSearch"
              :mode="formSearch.mode"
              :default-sort="defaultSort"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('online_payment')" :name="REVENUE.ONLINE">
            <sale-online
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingSearch"
              :mode="formSearch.mode"
              :default-sort="defaultSort"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
          /></el-tab-pane>
        </el-tabs>
      </client-only>
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "nuxt/app";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import {
  paymentStatusBookingOptions,
  TYPE_DAY,
  TYPE_WEEK,
} from "~/../../src/shared/constants";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { REVENUE, REVENUE_MODE } from "~/../../src/shared/constants/sale";
import SaleAll from "../../components/Sale/All.vue";
import SaleSubscription from "../../components/Sale/Subscription.vue";
import SaleOnline from "../../components/Sale/Online.vue";
import SaleCancellation from "../../components/Sale/Cancellation.vue";
import moment from "moment";
import {
  exportFile,
  getEndDate,
  getStartDate,
  getTypeSort,
} from "~/../../src/shared/utils";
import ReportRevenueRequest from "~/../../src/shared/requests/ReportRevenueRequest";
import { ReportRevenue } from "~/../../src/admin/models";
import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import { messageError } from "~/../../src/shared/utils/notification";
import { DataRevenueStore } from "~/../../src/admin/store/revenue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import CustomDatePicker from "~/../../src/shared/components/input/CustomDatePicker.vue";

useHavePermission(Permission.RevenueList);
const { t } = i18n.global;
const router = useRouter();
const route = useRoute();
const tableData = ref<ReportRevenue[]>([]);
const isLoadingExport = ref(false);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const typeDate = ref("date");
const formatValue = ref("YYYY年MM月DD日");
const formSearch = ref({
  payment_status: "",
  store_code: "",
  store_name: null,
  start_date: null,
  end_date: null,
  mode: REVENUE_MODE.ALL,
  type: REVENUE.ALL,
});

const dataTableStore = DataRevenueStore();
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

let sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const clearData = (field: string) => {
  formSearch.value[field] = null;
};

const getTypeDatePicker = computed(() => {
  return typeDate.value === null || typeDate.value === TYPE_DAY
    ? "date"
    : typeDate.value;
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListData();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
  dataTableStore.currentPage = val;
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  dataTableStore.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListData();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
  dataTableStore.pageSize = val;
};

const addConditionSearchStore = () => {
  dataTableStore.type = formSearch.value.type;
  dataTableStore.mode = formSearch.value.mode;
  dataTableStore.start = formSearch.value.start_date;
  dataTableStore.end = formSearch.value.end_date;
  dataTableStore.payment_status = formSearch.value.payment_status;
  dataTableStore.store_name = formSearch.value.store_name;
  dataTableStore.store_code = formSearch.value.store_code;
  dataTableStore.currentPage = pagination.currentPage;
  dataTableStore.pageSize = pagination.numberRecordPerPage;
  dataTableStore.sort = sortTable;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getListData();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!tableData.value?.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStore();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const handleChangeType = (typeChange: string) => {
  dataTableStore.type = typeChange;
  dataTableStore.currentPage = 1;
  sortTable.direct = SORT_ORDER.DESC;
  sortTable.order_by = "date";
  getListData();
  formSearch.value.type =
    Number(formSearch.value.type) === 0 ? "" : formSearch.value.type;
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
};

const handleChangeTab = (tab: string) => {
  dataTableStore.mode = tab;
  dataTableStore.currentPage = 1;
  sortTable.direct = SORT_ORDER.DESC;
  sortTable.order_by = "date";
  if (tab === REVENUE_MODE.DAY) {
    typeDate.value = "date";
    formatValue.value = "YYYY年MM月DD日";
  } else if (tab === REVENUE_MODE.WEEk) {
    typeDate.value = "week";
    formatValue.value = "YYYY年ww週　(MM/DD～)";
  } else if (tab === REVENUE_MODE.MONTH) {
    typeDate.value = "month";
    formatValue.value = "YYYY年MM月";
  } else {
    typeDate.value = "date";
    formatValue.value = "YYYY年MM月DD日";
  }
  getListData();
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
};

const changeSearchData = (data) => {
  formSearch.value.start_date = data.start;
  formSearch.value.end_date = data.end;
  formSearch.value.store_name = data.store_name;
  formSearch.value.store_code = data.store_code;
  formSearch.value.payment_status = data.payment_status;
  pagination.currentPage = data.currentPage;
  pagination.numberRecordPerPage = data.pageSize;
  sortTable = data.sort;
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  dataTableStore.sort = sortTable;
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getListData();
  isLoadingTable.value = false;
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const res: any = await ReportRevenueRequest.export({
      ...formResultAfterSubmitSearch.value,
      ...sortTable,
      end_date: getEndDate(
        formResultAfterSubmitSearch.value.mode,
        formResultAfterSubmitSearch.value.end_date
      ),
      start_date: getStartDate(
        formResultAfterSubmitSearch.value.mode,
        formResultAfterSubmitSearch.value.start_date
      ),
    });
    if (res) {
      exportFile(res, getNameCsv());
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const getNameCsv = () => {
  if (formSearch.value.mode === REVENUE_MODE.MONTH) {
    return "A022_売上一覧画面_月別";
  } else if (formSearch.value.mode === REVENUE_MODE.WEEk) {
    return "A022_売上一覧画面_週別";
  } else if (formSearch.value.mode === REVENUE_MODE.DAY) {
    return "A022_売上一覧画面_日別";
  } else {
    return "A022_売上一覧画面_すべて";
  }
};

const getListData = async () => {
  isLoadingSearch.value = true;
  const data = (
    await ReportRevenueRequest.listRevenue<ReportRevenue[]>({
      ...formSearch.value,
      end_date: getEndDate(formSearch.value.mode, formSearch.value.end_date),
      start_date: getStartDate(
        formSearch.value.mode,
        formSearch.value.start_date
      ),
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
      type: Number(formSearch.value.type) === 0 ? null : formSearch.value.type,
      ...sortTable,
    })
  ).data;
  tableData.value = data.data;
  pagination.total = data.pagination.total;
  isLoadingSearch.value = false;
};

const disabledDateStart = (time: Date) => {
  return (
    time.getTime() > Date.parse(formSearch.value.end_date) ||
    time.getTime() > Date.now()
  );
};

const disabledDateEnd = (time: Date) => {
  return (
    time.getTime() >= Date.now() ||
    (formSearch.value.start_date &&
      moment(time).isSameOrBefore(
        moment(formSearch.value.start_date).subtract(1, "day")
      ))
  );
};

onMounted(() => {
  if (
    dataTableStore.end ||
    dataTableStore.start ||
    dataTableStore.type ||
    dataTableStore.mode ||
    dataTableStore.payment_status ||
    dataTableStore.store_name ||
    dataTableStore.store_code
  ) {
    formSearch.value.type = dataTableStore.type ? dataTableStore.type : "";
    formSearch.value.mode = dataTableStore.mode;
    if (dataTableStore.mode && dataTableStore.mode === REVENUE_MODE.WEEk) {
      typeDate.value = "week";
      formatValue.value = "YYYY年ww週　(MM/DD～)";
    } else if (
      dataTableStore.mode &&
      dataTableStore.mode === REVENUE_MODE.MONTH
    ) {
      typeDate.value = "month";
      formatValue.value = "YYYY年MM月";
    } else {
      typeDate.value = "date";
    }
    formSearch.value.start_date = dataTableStore.start;
    formSearch.value.end_date = dataTableStore.end;
    formSearch.value.payment_status = dataTableStore.payment_status
      ? dataTableStore.payment_status
      : "";
    formSearch.value.store_name = dataTableStore.store_name;
    formSearch.value.store_code = dataTableStore.store_code;
  }
  pagination.currentPage = dataTableStore.currentPage;
  pagination.numberRecordPerPage = dataTableStore.pageSize;
  if (dataTableStore.sort) {
    sortTable = dataTableStore.sort;
  } else {
    sortTable.order_by = "date";
    sortTable.direct = SORT_ORDER.DESC;
  }
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
  getListData();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.el-radio-button) {
  padding: 2px 4px;
  background-color: $gray-90;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: 0 0 0 0
    var(--el-radio-button-checked-border-color, var(--el-color-primary));
}

:deep(.el-radio-button:first-child) {
  border-radius: 4px 0 0 4px;

  .el-radio-button__inner {
    box-shadow: white;
    border-right: 2px;
    border-radius: 2px;
    border-left: 0;
  }
}

:deep(.el-radio-button:last-child) {
  border-radius: 0 4px 4px 0;

  .el-radio-button__inner {
    box-shadow: white;
    border-right: 2px;
    border-radius: 2px;
    border-left: 0;
  }
}

:deep(.el-radio-button__inner) {
  background-color: $gray-90;
  color: $black-80;
  border: 0;
}

:deep(.is-active) {
  .el-radio-button__inner {
    background-color: $white-color;
    color: $black-80;
    border-color: $white-color;
    border-radius: 2px;
  }
}

.show-radio-group {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

:deep(.el-tabs__content) {
  padding: 20px;
  height: calc(100% - 48px);
}

:deep(.search) .el-input {
  width: 200px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}

:deep(.btn-add) {
  background-color: $green-medium-color;
  border-color: $green-medium-color;
}

:deep(.box__input-date) {
  .el-form-item__content {
    gap: 10px;
  }
}

:deep(.el-tabs--border-card) {
  border: 0;
}

:deep(.el-tabs__item) {
  padding-top: 3px;
  color: $black-80 !important;
}

:deep(.el-tabs--border-card
    > .el-tabs__header
    .el-tabs__item
    + .el-tabs__item) {
  margin-left: 0;
}

:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-tabs__nav-scroll) {
  background-color: #fafafa;
}

:deep(.el-tabs__nav),
:deep(.is-top) {
  background: #f0f2f5;
  border-right: 1px solid #e7e7e7 !important;
}

:deep(.el-tabs__header) {
  border-bottom: 1px solid var(--el-border-color-light);
  height: 48px;
}

:deep(.el-tabs__header .is-active) {
  background-color: #f3f3f3;
  color: $blue-light !important;
  height: 48px;
}

:deep(.el-tabs__content) {
  background: rgba(0, 0, 0, 0.02);
}

:deep(.input-date) {
  width: 200px;

  .select-tags {
    top: 0px;
    margin-left: -5px;
  }
}
</style>
