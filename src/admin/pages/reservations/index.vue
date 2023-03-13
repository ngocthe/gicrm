<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("reservations") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("reservations") }}</template>
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
            inline
            class="form-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('booking_number')">
              <InputText
                v-model="formSearch.code"
                :placeholder="$t('booking_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.status"
                  placeholder=""
                  :default-first-option="true"
                >
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in reservationStatusOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item class="box__input-date" :label="$t('date_visit')"
              ><client-only>
                <el-date-picker
                  v-model="formSearch.start_date"
                  :editable="false"
                  :placeholder="$t('start_date')"
                  width="144px"
                  type="date"
                  :disabled-date="disabledDateStart"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </client-only>
              <client-only>
                <el-date-picker
                  v-model="formSearch.end_date"
                  :editable="false"
                  type="date"
                  :placeholder="$t('end_date')"
                  :disabled-date="disabledDateEnd"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  width="144px"
                  clearable
                />
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('consumer_name')">
              <InputText
                v-model="formSearch.customer_name"
                :placeholder="$t('consumer_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('industry')">
              <client-only>
                <el-select
                  v-model="formSearch.branch_type"
                  placeholder=""
                  :default-first-option="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in storeType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('store_code')">
              <InputText
                v-model="formSearch.store_code"
                :placeholder="$t('placeholder.store_code')"
              />
            </el-form-item>
            <el-form-item :label="$t('store_name')">
              <InputText
                v-model="formSearch.store_name"
                :placeholder="$t('store_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('store.user_id')">
              <InputCode
                v-model="formSearch.consumer_id"
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('placeholder.id_input')"
                @input="searchHistoryUserBooking"
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
            border
            row-class-name="table-row"
            header-row-class-name="table-header"
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
            cell-class-name="text-row-2"
            :empty-text="noData"
            @sort-change="headerSort"
          >
            <el-table-column
              :label="$t('booking_number')"
              width="130px"
              prop="reservation_code"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.reservation_code }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('store_code')"
              width="150px"
              prop="store_code"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.store?.code }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('store_name')"
              class="column-point"
              min-width="220px"
              prop="store_id"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.store?.name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('store.user_id')"
              class="column-point"
              width="110px"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.customer?.id }} </span>
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
                <span class="ellipsis">
                  {{ scope.row.order_name ? scope.row.order_name : "" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('industry')"
              class="column-point"
              width="160px"
              prop="store_type"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    scope.row.store?.model_has_type?.type?.name
                      ? scope.row.store?.model_has_type?.type?.name
                      : ""
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('course_name')"
              class="column-point"
              min-width="320px"
              class-name="show-full-data"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    getArrMenuBooking(
                      scope.row.detail?.course?.name,
                      scope.row.detail?.menu_details
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('number_of_visitor')"
              class="column-point"
              width="120px"
              prop="total_people"
              align="right"
              header-align="left"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.total_people }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('status')"
              class="column-point"
              width="190px"
              prop="status"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ getSituation(scope.row) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('date_of_visit')"
              class="column-point"
              width="200px"
              prop="order_time"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.order_time, "YYYY年MM月DD日 HH:mm") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="100px"
              :label="$t('author')"
              prop="type_user_create"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{ getUserBooking(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('created_at')"
              class="column-point"
              width="200px"
              prop="created_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.created_at, "YYYY年MM月DD日 HH:mm") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('action')"
              min-width="110px"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="detailBooking(scope.row.id)"
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
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { useRouter } from "nuxt/app";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { Booking } from "~/../../src/shared/types/booking";
import {
  DATA_USER_BOOKING_FILTER,
  reservationStatusOptions,
} from "~/../../src/shared/constants/reservation";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { exportFile, getSituation } from "~/../../src/shared/utils";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import { Type } from "~/../../src/admin/models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import TypeRequest from "~/../../src/shared/requests/TypeRequest";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { BookingDetail } from "~/../../src/store/models/reservation";
import { MAX_LENGTH_DEFAULT } from "~/../../src/shared/utils/validate";
import { messageError } from "~/../../src/shared/utils/notification";
import {
  commonDisabledDateEnd,
  commonDisabledDateStart,
} from "~/../../src/shared/utils";

const storeType = ref<Type[]>([]);
const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isLoadingExport = ref(false);
const dataTableStore = DataTableStore();
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const formSearch = ref({
  code: null,
  status: null,
  store_name: null,
  branch_type: null,
  start_date: "",
  end_date: "",
  customer_name: null,
  consumer_id: null,
  consumer_type: null,
  store_code: "",
});

storeType.value = (await TypeRequest.getAllType(MODEL_TYPE.STORE)).data;

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const searchHistoryUserBooking = () => {
  if (formSearch.value.consumer_type) {
    formSearch.value.consumer_type = null;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataBooking();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataBooking();
};

const addConditionSearchStore = () => {
  dataTableStore.bookingList = {
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
    await getDataBooking();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!tableData.value.length) {
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
  direct: SORT_ORDER.DESC,
});

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getDataBooking();
  isLoadingTable.value = false;
};

const getUserBooking = (booking: BookingDetail) => {
  return DATA_USER_BOOKING_FILTER[booking.type_user_create];
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const res: any = await BookingRequest.export({
      ...formSearch.value,
      ...sortTable,
    });
    if (res) {
      exportFile(res, "A015_予約一覧画面");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const detailBooking = (id) => {
  router.push(`/reservations/detail/${id}`);
};

const getDataBooking = async () => {
  try {
    isLoadingTable.value = true;

    const params = {
      code: formSearch.value.code,
      status: formSearch.value.status,
      store_name: formSearch.value.store_name,
      branch_type: formSearch.value.branch_type,
      start_date: formSearch.value.start_date,
      end_date: formSearch.value.end_date,
      customer_name: formSearch.value.customer_name,
      consumer_id: formSearch.value.consumer_id,
      store_code: formSearch.value.store_code,
      consumer_type: formSearch.value.consumer_id
        ? formSearch.value.consumer_type
        : null,
    };

    const bookingData = (
      await BookingRequest.list<Booking[]>({
        ...params,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = bookingData?.data;
    pagination.total = bookingData.total;
    pagination.currentPage = bookingData.current_page;
    pagination.numberRecordPerPage = bookingData.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const getArrMenuBooking = (courseName: string, arrCategory: []) => {
  const arrMenu = [];
  arrCategory?.forEach((category) => {
    arrMenu.push(category.menu);
  });
  return getCourseMenuBooking(courseName, arrMenu);
};

const disabledDateStart = (time: Date) => {
  return formSearch.value.end_date
    ? time.getTime() > Date.parse(formSearch.value.end_date)
    : false;
};

const disabledDateEnd = (time: Date) => {
  return formSearch.value.start_date
    ? time.getTime() < Date.parse(formSearch.value.start_date)
    : false;
};

onMounted(async () => {
  if (dataTableStore.bookingList.search) {
    formSearch.value = dataTableStore.bookingList.search;
  }
  if (dataTableStore.bookingList.sort) {
    sortTable.order_by = dataTableStore.bookingList.sort.order_by;
    sortTable.direct = dataTableStore.bookingList.sort.direct;
  }
  pagination.currentPage = dataTableStore.bookingList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.bookingList.pageSize;
  await getDataBooking();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.search) .el-input {
  width: 180px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}

:deep(.btn-add) {
  background-color: #00a99d;
  border-color: #00a99d;
}

:deep(.box__input-date) .el-input {
  width: 170px;
}
</style>
