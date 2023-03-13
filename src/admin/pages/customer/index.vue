<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.list_customers") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_customers") }}</template>
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
            <el-form-item :label="$t('full_name_kanji')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('full_name_kanji')"
              />
            </el-form-item>
            <el-form-item :label="$t('phone_number')">
              <InputText
                v-model="formSearch.phone_number"
                :placeholder="$t('phone_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('email_address')">
              <InputText
                v-model="formSearch.email"
                :placeholder="$t('placeholder.email')"
              />
            </el-form-item>
            <el-form-item :label="$t('type_login')">
              <client-only>
                <el-select v-model="formSearch.login_type">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in typeLoginOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('store_name')" class="store-name-label">
              <InputText
                v-model="formSearch.store_name"
                :placeholder="$t('placeholder.store_name')"
              />
            </el-form-item>
            <ButtonSearch :loading="loadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <client-only>
          <el-table
            v-loading="isLoadingTable"
            class="table-content"
            :empty-text="noData"
            :data="tableData"
            border
            row-class-name="table-row"
            header-row-class-name="table-header"
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
            cell-class-name="text-row-2"
            @sort-change="headerSort"
          >
            <el-table-column
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndex"
            />

            <el-table-column
              :label="$t('full_name_kanji')"
              class="column-point"
              min-width="160px"
              prop="name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('store_name')"
              class="column-point"
              min-width="220px"
              prop="store_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.store_name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('email_address')"
              class="column-point"
              min-width="160px"
              prop="email"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            />
            <el-table-column
              :label="$t('phone_number')"
              class="column-point"
              width="140px"
              prop="created_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.phone_number }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('type_login')"
              class="column-point"
              width="145px"
              prop="login_type"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div class="login-type">
                  <component
                    :is="checkIconLogin(scope.row.login_type)"
                    class="icon-login-type"
                  ></component>
                  <span class="ellipsis">
                    {{
                      scope.row.login_type !== null
                        ? $t(
                            findObj(
                              typeLoginOptions,
                              "value",
                              scope.row.login_type
                            ) !== null
                              ? findObj(
                                  typeLoginOptions,
                                  "value",
                                  scope.row.login_type
                                )?.label
                              : ""
                          )
                        : ""
                    }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('last_time_login')"
              class="column-point"
              width="200px"
              prop="last_visited"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    formatDate(scope.row.last_visited, "YYYY年MM月DD日 HH:mm")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('created_at')"
              class="column-point"
              width="180px"
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
              :label="$t('action')"
              align="center"
              width="120px"
            >
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="editCustomer(scope.row.id, scope.row.type)"
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <ModalConfirm
        :dialog-visible="dialogVisible"
        :title="$t('title_delete')"
        :name-cancel="$t('line_cancel')"
        :name-confirm="$t('line_accept')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteCustomer"
      />
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import CustomerRequest from "~/../../src/shared/requests/CustomerRequest";
import { typeLoginOptions } from "~/../../src/shared/constants/typeLogin";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { getPageDelete } from "~/../../src/shared/utils/dataPage";
import { useRouter } from "nuxt/app";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { DetailCustomer } from "../../models/detailCustomer";
import { findObj } from "~/../../src/shared/utils/array";
import { customIndex } from "~/../../src/shared/utils";
import {
  messageError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { checkIconLogin } from "~/../../src/shared/composables/loginType";

const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const dataTableStore = DataTableStore();
const idDelete = ref(null);
const isLoadingTable = ref(false);
const dialogVisible = ref(false);
const loadingDelete = ref(false);
const loadingSearch = ref(false);
const customerData = ref<DetailCustomer[]>();
const noData = ref(t("no_data"));
const formResultAfterSubmitSearch = ref(null);
const formSearch = ref({
  id: null,
  name: "",
  phone_number: "",
  email: "",
  login_type: null,
  store_name: "",
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

const addConditionSearchStore = () => {
  dataTableStore.customerList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const handleClose = () => {
  idDelete.value = "";
  dialogVisible.value = false;
};

const handleCurrentChange = async (val) => {
  pagination.currentPage = val;
  await getDataCustomers();
  addConditionSearchStore();
};

const handleSizeChange = async (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  await getDataCustomers();
  addConditionSearchStore();
};

const handleSearch = async () => {
  pagination.currentPage = 1;
  loadingSearch.value = true;
  await getDataCustomers();
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
  if (!customerData.value?.length) {
    noData.value = t("no_result");
  }
  addConditionSearchStore();
  loadingSearch.value = false;
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
  pagination.currentPage = 1;
  await getDataCustomers();
  addConditionSearchStore();
};

const deleteCustomer = async () => {
  try {
    await CustomerRequest.delete(idDelete.value);
    dialogVisible.value = false;
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      tableData.value
    );
    idDelete.value = "";
    await getDataCustomers();
    deleteSuccess();
  } catch (e) {
    messageError("errors.delete_failed");
  } finally {
    loadingDelete.value = false;
  }
};

const editCustomer = (id, type) => {
  router.push(`/customer/edit/${id}?type=${type}`);
};

const showModalDelete = (id) => {
  idDelete.value = id;
  dialogVisible.value = true;
};

const getDataCustomers = async () => {
  try {
    isLoadingTable.value = true;
    const params = {
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    };
    const data = await CustomerRequest.list(params);
    if (loadingSearch.value && !data.data) {
      noData.value = t("no_result");
    }
    tableData.value = data.data?.data;
    pagination.total = data.data?.total;
    pagination.currentPage = data.data?.current_page;
    pagination.numberRecordPerPage = data.data?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (dataTableStore.customerList?.search) {
    formSearch.value = dataTableStore.customerList.search;
  }
  if (dataTableStore.customerList?.sort) {
    sortTable.order_by = dataTableStore.customerList.sort.order_by;
    sortTable.direct = dataTableStore.customerList.sort.direct;
  }
  pagination.currentPage = dataTableStore.customerList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.customerList.pageSize;
  await getDataCustomers();
  formSearch.value.id = null;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.search) .el-input {
  width: 222px;
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

.login-type {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
