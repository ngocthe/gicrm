<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.payment_list") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.payment_list") }}</template>
        <template #button>
          <ButtonExport
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
            <el-form-item :label="$t('admin.payment_number')">
              <InputText
                v-model="formSearch.id"
                :placeholder="$t('admin.payment_number')"
              />
            </el-form-item>
            <el-form-item class="status-search" :label="$t('status')">
              <client-only>
                <el-select v-model="formSearch.payment_status">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in paymentStatusBookingOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <!--            <el-form-item :label="$t('date_visit')">-->
            <!--              <client-only>-->
            <!--                <el-date-picker-->
            <!--                  v-model="formSearch.start_order_date"-->
            <!--                  :placeholder="$t('start_date')"-->
            <!--                  :disabled-date="disabledDateStartPayment"-->
            <!--                  format="YYYY年MM月DD日"-->
            <!--                  value-format="YYYY-MM-DD"-->
            <!--                  :editable="false"-->
            <!--                  class="input-date"-->
            <!--                />-->
            <!--              </client-only>-->
            <!--              <client-only>-->
            <!--                <el-date-picker-->
            <!--                  v-model="formSearch.end_order_date"-->
            <!--                  :editable="false"-->
            <!--                  :placeholder="$t('end_date')"-->
            <!--                  :disabled-date="disabledDateEndPayment"-->
            <!--                  format="YYYY年MM月DD日"-->
            <!--                  value-format="YYYY-MM-DD"-->
            <!--                  class="input-date"-->
            <!--                />-->
            <!--              </client-only>-->
            <!--            </el-form-item>-->
            <el-form-item :label="$t('payment_date_time')">
              <client-only>
                <el-date-picker
                  v-model="formSearch.start_date"
                  :placeholder="$t('start_date')"
                  :disabled-date="disabledDateStart"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  :editable="false"
                  class="input-date"
                />
              </client-only>
              <client-only>
                <el-date-picker
                  v-model="formSearch.end_date"
                  :editable="false"
                  :placeholder="$t('end_date')"
                  :disabled-date="disabledDateEnd"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  class="input-date"
                />
              </client-only>
            </el-form-item>
            <br />
            <el-form-item :label="$t('consumer_name')">
              <InputText
                v-model="formSearch.order_name"
                :placeholder="$t('consumer_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('store_code')">
              <InputText
                v-model="formSearch.store_code"
                :placeholder="$t('store_code')"
              />
            </el-form-item>
            <el-form-item :label="$t('store_name')" class="store-name-label">
              <InputText
                v-model="formSearch.store_name"
                :placeholder="$t('placeholder.store_name')"
              />
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
            :empty-text="noData"
            border
            row-class-name="table-row"
            header-row-class-name="table-header"
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
            cell-class-name="text-row-2"
            :default-sort="defaultSort"
            @sort-change="headerSort"
          >
            <el-table-column
              :label="$t('admin.payment_number')"
              width="130px"
              prop="id"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.id }} </span>
              </template>
            </el-table-column>
            <el-table-column
              width="130px"
              prop="store_code"
              :label="$t('store_code')"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            />
            <el-table-column
              min-width="220px"
              prop="store_name"
              :label="$t('store_name')"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.store_name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('consumer_name')"
              class="column-point"
              min-width="120px"
              prop="order_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('status')"
              class="column-point"
              width="130px"
              prop="payment_status"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    findObj(
                      paymentStatusBookingOptions,
                      "value",
                      scope.row.payment_status
                    )?.label
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('course_name')"
              min-width="320px"
              prop="course_name"
              class-name="show-full-data"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    getCourseMenuBooking(
                      scope.row.booking_detail?.course?.name,
                      scope.row.booking_detail?.menus
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="130px"
              :label="$t('amount_money')"
              align="right"
              header-align="left"
              prop="amount"
            >
              <template #default="scope">
                {{ scope.row.amount > 0 ? priceDisplay(scope.row.amount) : 0
                }}{{ $t("yen") }}
              </template>
            </el-table-column>

            <!--            <el-table-column-->
            <!--              :label="$t('number_of_visitor')"-->
            <!--              class="column-point"-->
            <!--              width="130px"-->
            <!--              align="right"-->
            <!--              header-align="left"-->
            <!--              prop="total_people"-->
            <!--            >-->
            <!--              <template #default="scope">-->
            <!--                <span class="ellipsis">-->
            <!--                  {{ scope.row.total_people }}{{ $t("name_2") }}-->
            <!--                </span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column
              :label="$t('payment_date_time')"
              class="column-point"
              width="145px"
              prop="paid_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.paid_at, "YYYY年MM月DD日") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('created')"
              class="column-point"
              width="130px"
              prop="created_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              align="center"
              width="110px"
              :label="$t('action')"
            >
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="
                    $router.push({
                      name: 'invoices-detail-id',
                      params: { id: scope.row.id },
                    })
                  "
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
          <LazyCommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { useRouter } from "nuxt/app";
import priceDisplay from "../../../shared/utils/price";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import {
  paymentStatusBookingOptions,
  SORT_ORDER,
} from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { InvoiceInterface } from "../../models/invoice";
import { findObj } from "~/../../src/shared/utils/array";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { i18n } from "~/../../src/shared/plugins/i18n";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { exportFile, getTypeSort } from "~/../../src/shared/utils";
import { messageError } from "~/../../src/shared/utils/notification";
import { computed } from "#imports";
import {
  commonDisabledDateEnd,
  commonDisabledDateStart,
} from "~/../../src/shared/utils";

const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isLoadingExport = ref(false);
const dataTableStore = DataTableStore();
const invoicesData = ref<InvoiceInterface[]>();
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const formSearch = ref({
  id: null,
  payment_status: null,
  store_name: null,
  order_name: null,
  reservation_code: null,
  payment_type: null,
  start_order_date: null,
  end_order_date: null,
  start_date: "",
  end_date: "",
  store_code: "",
});

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const res: any = await InvoiceRequest.export({
      ...formResultAfterSubmitSearch.value,
      ...sortTable,
    });
    if (res) {
      exportFile(res, "A017_決済一覧画面");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataInvoice();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getDataInvoice();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const addConditionSearchStore = () => {
  dataTableStore.invoiceList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataInvoice();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!invoicesData.value?.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStore();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  try {
    isLoadingTable.value = true;
    pagination.currentPage = 1;
    await getDataInvoice();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const getDataInvoice = async () => {
  try {
    isLoadingTable.value = true;
    const invoiceData = (
      await InvoiceRequest.list<InvoiceInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = invoiceData?.data;
    pagination.total = invoiceData?.pagination.total;
    pagination.currentPage = invoiceData?.pagination.current_page;
    pagination.numberRecordPerPage = invoiceData?.pagination.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const disabledDateStart = (time: Date) => {
  return commonDisabledDateStart(time, formSearch.value.end_date);
};

const disabledDateEnd = (time: Date) => {
  return commonDisabledDateEnd(time, formSearch.value.start_date);
};

onMounted(async () => {
  if (dataTableStore.invoiceList?.search) {
    formSearch.value = dataTableStore.invoiceList.search;
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
  }
  if (dataTableStore.invoiceList?.sort) {
    sortTable.order_by = dataTableStore.invoiceList.sort.order_by;
    sortTable.direct = dataTableStore.invoiceList.sort.direct;
  } else {
    sortTable.order_by = "created_at";
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = dataTableStore.invoiceList?.currentPage;
  pagination.numberRecordPerPage = dataTableStore.invoiceList?.pageSize;
  await getDataInvoice();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.end-date {
  margin-left: 100px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}

:deep(.status-search) {
  margin-right: 96px;
}
</style>
