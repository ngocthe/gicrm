<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.list_plan") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_plan") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
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
            @sort-change="headerSort"
          >
            <el-table-column :label="$t('admin.plans.name_plan')" width="200px">
              <template #default="scope">
                <span> {{ $t("plans_" + scope.row.name) }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.contract_period')"
              class="column-point"
              min-width="100px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    scope.row.name !== "free"
                      ? scope.row.duration + $t("month_yen")
                      : ""
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.annual_payment')"
              class="column-point"
              min-width="120px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ priceDisplay(scope.row.monthly_cost_annual) + $t("yen") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.year_time_payment')"
              class="column-point"
              min-width="140px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    priceDisplay(scope.row.monthly_cost_annual * 12) + $t("yen")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.monthly_payment')"
              class="column-point"
              min-width="125px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ priceDisplay(scope.row.monthly_cost) + $t("yen") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.credit_card')"
              class="column-point credit_card"
              width="230px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    scope.row.card_payment_service_fee +
                    "%" +
                    " ＋ " +
                    priceDisplay(scope.row.card_payment_fee) +
                    $t("yen")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.number_monthly_reservation')"
              class="column-point"
              min-width="130px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    scope.row.monthly_booking
                      ? priceDisplay(scope.row.monthly_booking) +
                        $t("subject_unit")
                      : $t("unlimited")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.number_register_staff')"
              class="column-point"
              min-width="140px"
              align="right"
            >
              <template #default="scope">
                <div>
                  {{
                    scope.row.number_staff
                      ? priceDisplay(scope.row.number_staff) + $t("man")
                      : $t("maximum")
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.number_photos_register_store')"
              class="column-point"
              min-width="170px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span>
                  {{
                    scope.row.number_store_top_photo
                      ? priceDisplay(scope.row.number_store_top_photo) +
                        $t("sheet")
                      : $t("maximum")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.photo_gallery')"
              class="column-point"
              min-width="200px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span>{{
                  priceDisplay(scope.row.number_photo) + $t("sheet")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.number_registered_customers')"
              class="column-point"
              width="130px"
              header-align="left"
              align="right"
            >
              <template #default="scope">
                <span>{{
                  priceDisplay(scope.row.number_customer) + $t("man")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.job_offer')"
              class="column-point"
              min-width="100px"
            >
              <template #default="scope">
                <span>{{
                  scope.row.job_offer === STATUS_TYPE.ENABLE
                    ? $t("display")
                    : $t("no_displayed")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.advertisement')"
              class="column-point"
              min-width="100px"
            >
              <template #default="scope">
                <span>{{
                  scope.row.advertisement === STATUS_TYPE.ENABLE
                    ? $t("display")
                    : $t("no_displayed")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.plans.support')"
              class="column-point"
              min-width="180px"
            >
              <template #default="scope">
                <span>{{ getCharacter(scope.row.support) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('action')"
              fixed="right"
              width="110px"
              align="center"
            >
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="editPlan(scope.row.id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
    </template>
    <template #footer>
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
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { useRouter } from "nuxt/app";
import { Plan } from "~/../../src/shared/types/plan";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { i18n } from "~/../../src/shared/plugins/i18n";
import priceDisplay from "~/../../src/shared/utils/price";
import { SUPPORT_PLANS } from "~/../../src/shared/constants/plan";
import { STATUS_TYPE } from "~/../../src/shared/constants";

const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(true);
const dataTableStore = DataTableStore();
const noData = ref(t("no_data"));

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const editPlan = (id) => {
  router.push(`/plans/edit/${id}`);
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const getCharacter = (item) => {
  if (item === SUPPORT_PLANS.CHAT_EMAIL) {
    return t("chatbox") + "/" + t("email");
  } else if (item === SUPPORT_PLANS.EMAIL) {
    return t("email");
  } else if (item === SUPPORT_PLANS.CHAT) {
    return t("chatbox");
  } else {
    return t("none");
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataPlans();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataPlans();
};

const addConditionSearchStore = () => {
  dataTableStore.planList = {
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getDataPlans();
  isLoadingTable.value = false;
};

const getDataPlans = async () => {
  try {
    isLoadingTable.value = true;
    const planResponse = (
      await PlanRequest.list<Plan[]>({
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = planResponse.data;
    pagination.total = planResponse.pagination?.total;
    pagination.currentPage = planResponse.pagination?.current_page;
    pagination.numberRecordPerPage = planResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (dataTableStore.planList?.sort) {
    sortTable.order_by = dataTableStore.planList.sort.order_by;
    sortTable.direct = dataTableStore.planList.sort.direct;
  }
  pagination.currentPage = dataTableStore.planList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.planList.pageSize;
  await getDataPlans();
});
</script>

<style lang="scss" scoped>
:deep(.custom-table .el-table__body .el-table__row td.text-row-2 > .cell) {
  line-height: 18px;
}

.button-edit {
  cursor: pointer;
}
</style>
