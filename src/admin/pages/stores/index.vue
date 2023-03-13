<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("admin.store_list") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("admin.store_list") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'stores-create' })"
          />
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
            :model="formSearch"
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('id_store')">
              <InputText
                v-model="formSearch.id"
                :placeholder="$t('id_store')"
              />
            </el-form-item>
            <el-form-item :label="$t('store_name')" class="store-name-label">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('store_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('phone_number')">
              <InputText
                v-model="formSearch.phone_number"
                :placeholder="$t('phone_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('industry')" class="mr-30">
              <ClientOnly>
                <el-select v-model="formSearch.type_store_id" placeholder="">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in filterDataTypeStore"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item :label="$t('email_address')">
              <InputText
                v-model="formSearch.email"
                :placeholder="$t('email_address')"
              />
            </el-form-item>
            <!-- START: Search Plan-->
            <el-form-item :label="$t('plan')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.plan_id"
                  :default-first-option="true"
                  placeholder=""
                >
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in planNameData"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END: Search Plan-->
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.status"
                  placeholder=""
                  :default-first-option="true"
                >
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in StatusStoreOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <ButtonSearch
              :loading="isLoadingSearch"
              :name="$t('button_search')"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :data="storesData"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          :default-sort="defaultSort"
          @sort-change="headerSort"
        >
          <el-table-column
            width="100px"
            :label="$t('id_store')"
            prop="id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="220px"
            :label="$t('store_name')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />

          <el-table-column
            min-width="160px"
            :label="$t('email_address')"
            prop="email"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            width="130px"
            :label="$t('phone_number')"
            prop="phone_number"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            width="160px"
            :label="$t('industry')"
            prop="type_name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row?.model_has_type?.type?.name }}</span>
            </template>
          </el-table-column>
          <!-- START: Plan  -->
          <el-table-column
            width="160px"
            :label="$t('plan')"
            prop="plan_id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>{{ $t("plans_" + scope.row?.plan.plan_data.name) }}</span>
            </template>
          </el-table-column>
          <!-- END: Plan  -->
          <!-- START: Registration Date -->
          <el-table-column
            width="180px"
            :label="$t('registration_date')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}</span
              >
            </template>
          </el-table-column>
          <!-- END: Registration Date -->
          <!-- START: FREE Registration Date -->
          <el-table-column
            width="180px"
            :label="$t('free_registration_date')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}
              </span>
            </template>
          </el-table-column>
          <!-- END: FREE Registration Date -->
          <!-- START: PAID Registration Date -->
          <el-table-column
            width="180px"
            :label="$t('paid_plan_registration_date')"
            prop="plan_start_date"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row?.plan.start_date, "YYYY年MM月DD日") }}
              </span>
            </template>
          </el-table-column>
          <!-- END: PAID Registration Date -->
          <el-table-column
            min-width="130px"
            :label="$t('status')"
            prop="status"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ getStatusStore(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :label="$t('action')"
            class-name="custom-action"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <div class="group-action justify-content-center">
                <icon-edit
                  v-if="hasPermStoreEdit"
                  class="cursor-pointer"
                  @click="
                    $router.push({
                      name: 'stores-edit-id',
                      params: { id: scope.row.id },
                    })
                  "
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
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
import { computed, onMounted, reactive, ref } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";

import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { FilterStoreList, StoreInterface } from "~/../../src/admin/models";

import {
  ADMIN_PAGINATION,
  SORT_ORDER,
  StatusStoreOptions,
  planNameData,
} from "~/../../src/shared/constants";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { Permission } from "~/../../src/shared/constants/permission";

import StoreRequest from "~/../../src/shared/requests/StoreRequest";

import { exportFile, getTypeSort, findObj } from "~/../../src/shared/utils";

import useHavePermission from "~/../../src/shared/composables/useHavePermission";

import { formatDate } from "~/../../src/shared/utils/format";
import { messageError } from "~/../../src/shared/utils/notification";
import ButtonAdd from "~/../../src/shared/components/button/ButtonAdd.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";

useHavePermission(Permission.StoreList);
const hasPermStoreEdit = useHavePermission(Permission.StoreEdit, false);

const { t } = i18n.global;
const dataTableStore = DataTableStore();

const storesData = ref<StoreInterface[]>([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isLoadingExport = ref(false);
const noData = ref(t("no_data"));
const formResultAfterSubmitSearch = ref<FilterStoreList | null>(null);

const formSearch = ref<FilterStoreList>({
  id: null,
  name: "",
  phone_number: "",
  email: "",
  type_store_id: null,
  plan_id: null,
  status: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const getListStore = async () => {
  isLoadingTable.value = true;
  try {
    const response = await StoreRequest.getList<StoreInterface[]>({
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    });

    if (response) {
      storesData.value = response.data.data;

      const paginationResponse = response.data.pagination;

      pagination.total = paginationResponse?.total;
      pagination.currentPage = paginationResponse?.current_page;
      pagination.numberRecordPerPage = paginationResponse?.per_page;
    }
  } finally {
    isLoadingTable.value = false;
  }
};

const getStatusStore = (value: any) => {
  return findObj(StatusStoreOptions, "value", value)?.label;
};

const addConditionSearchStore = () => {
  dataTableStore.storeList = {
    search: formResultAfterSubmitSearch.value as FilterStoreList,
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
    await getListStore();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!storesData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStore();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
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
    await getListStore();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListStore();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListStore();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    const res = await StoreRequest.export({
      ...formResultAfterSubmitSearch.value,
      ...sortTable,
      all: true,
    });
    if (res) {
      exportFile(res as any, "A006_店舗一覧");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const filterDataTypeStore = computed(() => {
  //TODO: phase 1
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

onMounted(async () => {
  if (dataTableStore.storeList.search) {
    formSearch.value = dataTableStore.storeList.search;
  }
  if (dataTableStore.storeList.sort) {
    sortTable.order_by = dataTableStore.storeList.sort.order_by;
    sortTable.direct = dataTableStore.storeList.sort.direct;
  }
  pagination.currentPage = dataTableStore.storeList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.storeList.pageSize;
  await getListStore();
});
</script>

<style lang="scss" scoped>
:deep(.form-search) {
  &.el-form--inline .el-form-item {
    margin-right: 60px;
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
</style>
