<template>
  <ListScreenComponent class="booking-list">
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("reservations") }}</Title>
      </Head>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            label-width="125px"
            inline
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <!-- START Search for user name or reservation code -->
            <el-form-item :label="$t('keyword_search')">
              <InputText
                v-model="formSearch.key_search"
                :placeholder="$t('name_reservation_code')"
                :width="'194px'"
              />
            </el-form-item>
            <!-- END Search for user name or reservation code -->
            <!-- START reservation status -->
            <el-form-item :label="$t('store.reservation_status')">
              <ClientOnly>
                <el-select v-model="formSearch.status">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in reservationStatusOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END reservation status -->
            <!-- START Payment status -->
            <el-form-item :label="$t('payment_status')">
              <ClientOnly>
                <el-select v-model="formSearch.status_payment">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in paymentStatusBookingOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END Payment status -->
            <ButtonSearch
              :loading="isLoadingSearch"
              :name="$t('button_search')"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <!-- START custom table -->
      <div class="custom-table">
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :data="bookingList"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 40px - 10px - 20px - 34px - 16px - 58px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          :default-sort="defaultSort"
          @sort-change="headerSort"
        >
          <!-- START reservation code -->
          <el-table-column
            min-width="120px"
            :label="$t('reservation_number')"
            prop="reservation_code"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <!-- END reservation code -->
          <!-- START order name -->
          <el-table-column
            min-width="120px"
            :label="$t('customer_name2')"
            prop="order_name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row?.order_name }}</span>
            </template>
          </el-table-column>
          <!-- END order_name -->
          <!-- START situation -->
          <el-table-column width="190px" :label="$t('situation')" prop="status">
            <template #default="scope">
              {{ getSituation(scope.row) }}
            </template>
          </el-table-column>
          <!-- END situation -->
          <!-- START date of visit -->
          <el-table-column
            width="200px"
            :label="$t('date_of_visit')"
            prop="order_time"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{
                formatDate(scope.row?.order_time || "", "YYYY年MM月DD日 HH:mm")
              }}
            </template>
          </el-table-column>
          <!-- END date of visit -->
          <!-- START Course/Menu name -->
          <el-table-column min-width="320px" :label="$t('course_name')">
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
          <!-- END Course/Menu name -->
          <!-- START total people -->
          <el-table-column
            min-width="90px"
            :label="$t('number_of_people')"
            prop="total_people"
            align="right"
            header-align="left"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ priceDisplay(scope.row?.total_people)
                }}{{ $t("last_name_kanji") }}</span
              >
            </template>
          </el-table-column>
          <!-- END total people -->

          <!-- START money -->
          <el-table-column
            min-width="120px"
            :label="$t('amount_money')"
            prop="amount"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            header-align="left"
            align="right"
          >
            <template #default="scope">
              <span>
                {{ scope.row.amount > 0 ? priceDisplay(scope.row.amount) : 0
                }}{{ $t("yen") }}</span
              >
            </template>
          </el-table-column>
          <!-- END money -->

          <!-- START payment_type -->
          <el-table-column
            width="120px"
            :label="$t('payment_type')"
            prop="payment_type"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{ getTypePayment(scope.row?.payment_type) }}
            </template>
          </el-table-column>
          <!-- END payment_type -->
          <!-- START status payment -->
          <el-table-column
            width="120px"
            :label="$t('payment.status')"
            prop="status_payment"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{ getStatusPayment(scope.row.status_payment) }}
            </template>
          </el-table-column>
          <!-- END status payment -->
          <!-- START order time -->
          <el-table-column
            width="200px"
            :label="$t('reservation_date_Time')"
            prop="order_time"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{
                  formatDate(scope.row?.created_at, "YYYY年MM月DD日 HH:mm")
                }}</span
              >
            </template>
          </el-table-column>
          <!-- END order time -->
          <!-- START user booking -->
          <el-table-column width="90px" :label="$t('author')">
            <template #default="scope">
              {{ getUserBooking(scope.row) }}
            </template>
          </el-table-column>
          <!-- END user booking -->
          <!-- START action -->
          <el-table-column
            width="70px"
            fixed="right"
            :label="$t('edit')"
            class-name="custom-action"
          >
            <template #default="scope">
              <div class="group-action">
                <icon-edit
                  @click="
                    $router.push({
                      name: 'reservation-detail-id',
                      params: { id: scope.row.id },
                    })
                  "
                />
              </div>
            </template>
          </el-table-column>
          <!-- END action -->
        </el-table>
      </div>
      <!-- END custom table -->
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";

import {
  PaymentMethod,
  paymentStatusBookingOptions,
  SORT_ORDER,
  STORE_PAGINATION,
} from "~/../../src/shared/constants";

import { DataTableStore } from "~/../../src/store/store/dataTable";
import { useReservation } from "../../store/useReservation";
import { BookingDetail } from "~/../../src/store/models/reservation";

import { formatDate } from "~/../../src/shared/utils/format";

import { getSituation, getTypeSort } from "~/../../src/shared/utils";
import { Appearance } from "~/../../src/store/constants";
import {
  DATA_USER_BOOKING_FILTER,
  reservationStatusOptions,
} from "../../../shared/constants/reservation";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import priceDisplay from "~/../../src/shared/utils/price";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import InputText from "../../../shared/components/input/InputText.vue";
import ButtonSearch from "../../../shared/components/button/Search.vue";

const reservationStore = useReservation();
const { t } = i18n.global;
const isLoadingTable = ref(false);
const noData = ref(t("no_data"));
const dataTableStore = DataTableStore();
const start = ref("");
const end = ref("");

const isLoadingSearch = ref<boolean>(false);
const bookingList = ref<BookingDetail[]>([]);

const formSearch = ref({
  key_search: null,
  status_payment: null,
  status: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: STORE_PAGINATION.PER_PAGE,
});

const sortTable = reactive({
  order_by: "id",
  direct: SORT_ORDER.DESC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const handleSearch = async () => {
  try {
    isLoadingTable.value = true;
    pagination.currentPage = 1;
    await getListBooking();
    addConditionSearchBooking();
    if (!bookingList.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingTable.value = false;
  }
};

const getListBooking = async (key?: boolean) => {
  if (reservationStore.appearance === Appearance.list) {
    try {
      isLoadingTable.value = true;
      const bookingResponse = (
        await BookingRequest.list<BookingDetail[]>(
          {
            ...formSearch.value,
            ...sortTable,
            start_date: start.value,
            end_date: end.value,
            page: pagination.currentPage,
            limit: pagination.numberRecordPerPage,
          },
          key
        )
      )?.data;
      bookingList.value = bookingResponse?.data;
      pagination.total = bookingResponse?.total;
      pagination.currentPage = bookingResponse?.current_page;
      pagination.numberRecordPerPage = bookingResponse?.per_page;
    } finally {
      isLoadingTable.value = false;
    }
  }
};

const addConditionSearchBooking = () => {
  dataTableStore.bookingList = {
    search: formSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const getUserBooking = (booking: BookingDetail) => {
  return DATA_USER_BOOKING_FILTER[booking.type_user_create];
};

const getTypePayment = (type: number) => {
  return PaymentMethod.find((item) => item.value === type)?.label || "";
};

const getStatusPayment = (status: number) => {
  return (
    paymentStatusBookingOptions.find((item) => item.value === status)?.label ||
    ""
  );
};

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
    await getListBooking();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListBooking();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListBooking();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

defineExpose({
  isLoadingTable,
});

watch(
  [() => reservationStore.getActiveTime, () => reservationStore.getViewMode],
  async (value) => {
    [start.value, end.value] = reservationStore.getDateRanger();
    pagination.currentPage = 1;
    await getListBooking(true);
    if (!bookingList.value.length) {
      noData.value = t("no_result");
    }
  }
);

watch(
  () => reservationStore.appearance,
  async (value) => {
    if (value === Appearance.list) {
      await getListBooking(true);
    }
  }
);

const getArrMenuBooking = (courseName: string, arrCategory: []) => {
  const arrMenu = [];
  arrCategory?.forEach((category) => {
    arrMenu.push(category.menu);
  });
  return getCourseMenuBooking(courseName, arrMenu);
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
  [start.value, end.value] = reservationStore.getDateRanger();
  await getListBooking(true);
});
</script>

<style lang="scss" scoped>
.booking-list.screen-layout:deep {
  height: calc(100% - 34px - 16px);

  .el-scrollbar.scroll-content {
    height: calc(100% - 36px - 16px);

    .content {
      :deep(.form-search) {
        &.el-form--inline .el-form-item {
          margin-right: 96px;
        }

        .el-input {
          width: 222px;
          margin-right: 0;
        }

        .el-select {
          .el-input {
            width: 134px;
          }
        }
      }
    }
  }
}
</style>
