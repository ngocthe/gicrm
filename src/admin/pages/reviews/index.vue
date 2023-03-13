<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.review_store") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.review_customer") }}</template>
        <template #button>
          <el-form-item
            :label="$t('industry')"
            class="select-industry align-items-center"
          >
            <ClientOnly>
              <el-select
                v-model="formSearch.industry"
                :default-first-option="true"
                @change="handleSearch"
              >
                <el-option :label="$t('all')" value=""></el-option>
                <el-option
                  v-for="item in filterDataTypeStore"
                  :key="item.id"
                  :label="$t(item.name)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </ClientOnly>
          </el-form-item>
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
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item :label="$t('commenter')">
              <InputText
                v-model="formSearch.customer_name"
                :placeholder="$t('placeholder.enter_author')"
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item :label="$t('comment')">
              <InputText
                v-model="formSearch.review_content"
                :placeholder="$t('placeholder.enter_comment')"
                :width="'194px'"
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
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
            cell-class-name="text-row-2"
            :empty-text="noData"
            @sort-change="headerSort"
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
              prop="store_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div
                  class="text-link"
                  @click="
                    $router.push({
                      name: 'stores-edit-id',
                      params: { id: scope.row.store?.id },
                    })
                  "
                >
                  {{ scope.row.store?.name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('nick_name')"
              class="column-point"
              min-width="160px"
              prop="nickname"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.nickname }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('gender')"
              class="column-point"
              min-width="120px"
              prop="gender"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{
                    findObj(genderOptions, "value", scope.row.gender)
                      ? $t(
                          findObj(genderOptions, "value", scope.row.gender)
                            .label
                        )
                      : ""
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('era')"
              class="column-point"
              min-width="120px"
              prop="age"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{
                    findObj(ageOptions, "value", scope.row.age)
                      ? $t(findObj(ageOptions, "value", scope.row.age).label)
                      : ""
                  }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('destination')"
              class="column-point"
              min-width="160px"
              prop="title"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('comment')"
              class="column-point"
              min-width="266px"
              prop="content"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.content }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('reply')"
              class="column-point"
              min-width="266px"
            >
              <template #default="scope">
                <span> {{ scope.row.reply?.content }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('posted_date')"
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
            <el-table-column
              :label="$t('contributor')"
              class="column-point"
              width="160px"
              prop="reviewer_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.customer?.fullname }}
                </span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('action')" width="110px">
              <template #default="scope">
                <div class="d-flex">
                  <IconView
                    class="icon-button button-edit"
                    @click="viewReviewStore(scope.row)"
                  />
                  <IconDelete
                    class="icon-button button-delete"
                    @click="showModalDelete(scope.row.id)"
                  />
                </div>
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
        @handle-confirm="deleteReviewStore"
      />
      <client-only>
        <ModalViewData
          :dialog-visible="dialogVisibleView"
          :data-review="rowDataReview"
          @handle-close-view="handleCloseView"
          @show-modal-delete="showModalDelete"
        />
      </client-only>
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
import { computed, onMounted, reactive, ref } from "vue";
import ReviewRequest from "~/../../src/shared/requests/ReviewRequest";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { getPageDelete } from "~/../../src/shared/utils/dataPage";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "../../../shared/components/input/InputText.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { ReviewStore } from "~/../../src/admin/models/reviewStore";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { customIndex } from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { genderOptions, ageOptions } from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils";

const { t } = i18n.global;
const tableData = ref([]);
const isLoadingTable = ref(true);
const isLoadingSearch = ref(false);
const idDelete = ref(null);
const rowDataReview = ref({});
const dialogVisible = ref(false);
const dialogVisibleView = ref(false);
const loadingDelete = ref(false);
const noData = ref(t("no_data"));
const formSearch = reactive({
  store_code: null,
  store_name: null,
  customer_name: null,
  review_content: null,
  industry: "",
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

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const handleClose = () => {
  idDelete.value = null;
  dialogVisible.value = false;
};

const handleCloseView = () => {
  dialogVisibleView.value = false;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataReviewStore();
    if (!tableData.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const deleteReviewStore = async () => {
  try {
    loadingDelete.value = true;
    await ReviewRequest.delete(idDelete.value);
    deleteSuccess();
    dialogVisible.value = false;
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      tableData.value
    );
    idDelete.value = null;
    await getDataReviewStore();
  } catch (e) {
    deleteError();
    return e;
  } finally {
    loadingDelete.value = false;
  }
};

const showModalDelete = (id: number) => {
  idDelete.value = id;
  dialogVisible.value = true;
  dialogVisibleView.value = false;
};

const viewReviewStore = (data: object) => {
  rowDataReview.value = data;
  dialogVisibleView.value = true;
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataReviewStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataReviewStore();
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
  await getDataReviewStore();
  isLoadingTable.value = false;
};

const getDataReviewStore = async () => {
  try {
    isLoadingTable.value = true;
    const reviewStoreResponse = (
      await ReviewRequest.list<ReviewStore[]>({
        ...formSearch,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;

    tableData.value = reviewStoreResponse.data;
    pagination.total = reviewStoreResponse.pagination?.total;
    pagination.currentPage = reviewStoreResponse.pagination?.current_page;
    pagination.numberRecordPerPage = reviewStoreResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  await getDataReviewStore();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.select-industry .el-form-item__content) {
  width: 160px;

  input {
    height: 38px;
  }
}

:deep(.search) .el-input {
  width: 190px;
}

:deep(.box__input-date) .el-input {
  width: 170px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
