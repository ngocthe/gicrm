<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.notice_management") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.notice_management") }}</template>
        <template #button>
          <ButtonCreateNew @click="addNotice" />
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
            <div>
              <el-form-item :label="$t('number')">
                <InputText
                  v-model="formSearch.id"
                  :placeholder="$t('placeholder.number')"
                  :width="'194px'"
                />
              </el-form-item>
              <el-form-item :label="$t('type')">
                <client-only>
                  <el-select
                    v-model="formSearch.type"
                    :placeholder="$t('news')"
                  >
                    <el-option :value="null" :label="$t('all')"></el-option>
                    <el-option
                      v-for="item in noticeOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    ></el-option>
                  </el-select>
                </client-only>
              </el-form-item>
              <el-form-item :label="$t('title_keyword')">
                <InputText
                  v-model="formSearch.title"
                  :placeholder="$t('title_notification')"
                />
              </el-form-item>
              <el-form-item
                class="box__input-date"
                :label="$t('date_notification')"
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
                    v-model="formSearch.due_date"
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
            </div>
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
              :label="$t('number')"
              min-width="80px"
              prop="id"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.id }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('type')"
              class="column-point"
              min-width="70px"
              prop="type"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    $t(findObj(noticeOptions, "value", scope.row.type)?.label)
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('title_keyword')"
              class="column-point"
              min-width="120px"
              prop="title"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('content')"
              class="column-point"
              min-width="266px"
              prop="body"
            >
              <template #default="scope">
                <span> {{ scope.row.body }} </span>
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
                <span>{{
                  formatDate(scope.row.created_at, "YYYY年MM月DD日 HH:mm")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('action')" width="115px">
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="editNotice(scope.row.id)"
                />
                <IconDelete
                  class="icon-button button-delete"
                  @click="showModalDelete(scope.row.id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <ModalConfirm
        :dialog-visible="dialogVisible"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteNotice"
      />
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
import NoticeRequest from "~/../../src/shared/requests/NoticeRequest";
import { noticeOptions } from "~/../../src/shared/constants/notices";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { getPageDelete } from "~/../../src/shared/utils/dataPage";
import { useRouter } from "nuxt/app";
import ButtonCreateNew from "~/../../src/shared/components/button/CreateNew.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "../../../shared/components/input/InputText.vue";
import { Notice } from "~/../../src/shared/types/notice";
import { formatDate } from "~/../../src/shared/utils/format";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { findObj } from "~/../../src/shared/utils/array";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import {
  commonDisabledDateEnd,
  commonDisabledDateStart,
} from "~/../../src/shared/utils";

const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(true);
const isLoadingSearch = ref(false);
const idDelete = ref(null);
const dataTableStore = DataTableStore();
const formResultAfterSubmitSearch = ref(null);
const dialogVisible = ref(false);
const loadingDelete = ref(false);
const noData = ref(t("no_data"));
const formSearch = ref({
  id: null,
  type: null,
  title: null,
  start_date: "",
  due_date: "",
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const handleClose = () => {
  idDelete.value = "";
  dialogVisible.value = false;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataNotices();
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

const deleteNotice = async () => {
  try {
    loadingDelete.value = true;
    await NoticeRequest.delete(idDelete.value);
    deleteSuccess();
    dialogVisible.value = false;
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      tableData.value
    );
    idDelete.value = "";
    await getDataNotices();
  } catch (e) {
    deleteError();
    return e;
  } finally {
    loadingDelete.value = false;
  }
};

const addNotice = () => {
  router.push(`/notices/create`);
};

const editNotice = (id) => {
  router.push(`/notices/edit/${id}`);
};

const showModalDelete = (id) => {
  idDelete.value = id;
  dialogVisible.value = true;
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataNotices();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataNotices();
};

const addConditionSearchStore = () => {
  dataTableStore.noticeList = {
    search: formResultAfterSubmitSearch.value,
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
  await getDataNotices();
  isLoadingTable.value = false;
};

const getDataNotices = async () => {
  try {
    isLoadingTable.value = true;
    const noticeResponse = (
      await NoticeRequest.list<Notice[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = noticeResponse.data;
    pagination.total = noticeResponse.pagination?.total;
    pagination.currentPage = noticeResponse.pagination?.current_page;
    pagination.numberRecordPerPage = noticeResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const disabledDateStart = (time: Date) => {
  return commonDisabledDateStart(time, formSearch.value.due_date);
};

const disabledDateEnd = (time: Date) => {
  return commonDisabledDateEnd(time, formSearch.value.start_date);
};

onMounted(async () => {
  if (dataTableStore.noticeList?.search) {
    formSearch.value = dataTableStore.noticeList.search;
  }
  if (dataTableStore.noticeList?.sort) {
    sortTable.order_by = dataTableStore.noticeList.sort.order_by;
    sortTable.direct = dataTableStore.noticeList.sort.direct;
  }
  pagination.currentPage = dataTableStore.noticeList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.noticeList.pageSize;
  await getDataNotices();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.form-search {
  display: flex;
  justify-content: space-between;
}

:deep(.search) .el-input {
  width: 222px;
}

:deep(.box__input-date) .el-input {
  width: 170px;
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
</style>
