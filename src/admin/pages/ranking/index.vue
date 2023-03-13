<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") + $t("title_screen.ranking_list") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.ranking_list") }}</template>
        <template #button>
          <el-form-item :label="$t('industry')" class="align-items-center">
            <ClientOnly>
              <el-select
                v-model="formSearch.type_store_id"
                :default-first-option="true"
                @change="handleSearchStoreType"
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
            class="form-search d-flex justify-content-between"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <div>
              <el-form-item :label="$t('store_code')">
                <InputText
                  v-model="formSearch.store_code"
                  :placeholder="$t('placeholder.store_code')"
                />
              </el-form-item>
              <el-form-item :label="$t('store_name')" class="store-name-label">
                <InputText
                  v-model="formSearch.store_name"
                  :placeholder="$t('placeholder.enter_store_name')"
                />
              </el-form-item>
              <el-form-item :label="$t('genre_type')">
                <ClientOnly>
                  <el-select
                    v-model="formSearch.tag_store_id"
                    multiple
                    collapse-tags
                    :teleported="false"
                    :placeholder="$t('placeholder.enter_genre')"
                    class="custom-input-select-multi"
                  >
                    <el-option
                      v-for="item in tags"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </ClientOnly>
              </el-form-item>
            </div>
            <ButtonSearch :loading="isLoadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <client-only>
        <el-tabs
          v-model="formSearch.order_by"
          type="border-card"
          @tab-change="handleChangeType"
        >
          <div class="show-radio-group">
            <el-radio-group
              v-model="formSearch.period"
              class="d-flex-end"
              @change="handleChangeTab"
            >
              <el-radio-button :label="RANKING_MODE.MONTH">
                {{ $t("monthly") }}
              </el-radio-button>
              <el-radio-button :label="RANKING_MODE.WEEK">
                {{ $t("weekly") }}
              </el-radio-button>
              <el-radio-button :label="RANKING_MODE.DAY">
                {{ $t("daily") }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <el-tab-pane
            :label="$t('number_of_reservations')"
            :name="RANKING_TYPE.SUM_TOTAL_BOOKING"
          >
            <ranking-store
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingTable"
              :mode="formSearch.period"
              :type="RANKING_TYPE.SUM_TOTAL_BOOKING"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
              @get-list-data="getListData"
            />
          </el-tab-pane>
          <el-tab-pane
            :label="$t('number_of_accesses')"
            :name="RANKING_TYPE.SUM_TOTAL_ACCESS"
          >
            <ranking-store
              :table-data="tableData"
              :pagination="pagination"
              :no-data="noData"
              :loading="isLoadingTable"
              :mode="formSearch.period"
              :type="RANKING_TYPE.SUM_TOTAL_ACCESS"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
              @header-sort="headerSort"
              @get-list-data="getListData"
            />
          </el-tab-pane>
        </el-tabs>
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
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";

import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";

import RankingRequest from "~/../../src/shared/requests/RankingRequest";

import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";

import { Permission } from "~/../../src/shared/constants/permission";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { dataTypeStore } from "~/../../src/shared/constants/category";

import {
  RANKING_TYPE,
  RANKING_MODE,
} from "~/../../src/shared/constants/ranking";

import { TagInterface } from "~/../../src/admin/models";
import { IPayloadGetListRanking, Ranking } from "../../../admin/models/ranking";

import tagRequest from "../../../shared/requests/TagRequest";

useHavePermission(Permission.RevenueList);
const { t } = i18n.global;
const tableData = ref<Ranking[]>([]);
const isLoadingTable = ref(true);
const isLoadingSearch = ref(false);
const formResultAfterSubmitSearch = ref(null);
const tags = ref<TagInterface[]>([]);
const noData = ref(t("no_data"));

const formSearch = ref<{
  type_store_id: number | string;
  store_name: string;
  store_code: string;
  tag_store_id: number[];
  period: string;
  order_by: string;
  order_by_column: string | null;
  direct_column: string;
}>({
  type_store_id: "",
  store_name: "",
  store_code: "",
  tag_store_id: [],
  period: RANKING_MODE.DAY,
  order_by: RANKING_TYPE.SUM_TOTAL_BOOKING,
  order_by_column: null,
  direct_column: SORT_ORDER.DESC,
});

const dataTableStore = DataTableStore();
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

let sortTable = reactive({
  direct: SORT_ORDER.DESC,
});

const handleSearchStoreType = async () => {
  await handleSearchTag();
  await handleSearch();
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  sortTable.direct = SORT_ORDER.DESC;
  await getListData();
  dataTableStore.rankingList.currentPage = val;
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  sortTable.direct = SORT_ORDER.DESC;
  await getListData();
  dataTableStore.rankingList.pageSize = val;
};

const handleSearchTag = async () => {
  const res = await tagRequest.getAllTagByStore<TagInterface[]>(
    formSearch.value.type_store_id
      ? Number(formSearch.value.type_store_id)
      : undefined
  );
  if (res) {
    formSearch.value.tag_store_id = [];
    tags.value = res.data;
  }
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingSearch.value = true;
    await getListData();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!tableData.value?.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
  }
};

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const handleChangeType = async (typeChange: string) => {
  formSearch.value.order_by = typeChange;
  await getListData();
};

const handleChangeTab = async (tab: string) => {
  sortTable.direct = SORT_ORDER.DESC;
  formSearch.value.period = tab;
  formSearch.value.order_by_column = null;
  formSearch.value.direct_column = SORT_ORDER.DESC;
  await getListData();
};

const headerSort = async ({
  prop,
  order,
  column,
}: {
  prop: string;
  order: string;
  column: string;
}) => {
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  formSearch.value.order_by_column = column;
  formSearch.value.direct_column = sortTable.direct;
  pagination.currentPage = 1;
  await getListData();
};

const getListData = async () => {
  isLoadingTable.value = true;
  const rankingResponse = (
    await RankingRequest.getListRanking<Ranking[]>({
      ...formSearch.value,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
      ...sortTable,
    } as IPayloadGetListRanking)
  ).data;

  tableData.value = rankingResponse.data;
  pagination.total = rankingResponse.pagination?.total;
  pagination.currentPage = rankingResponse.pagination?.current_page;
  pagination.numberRecordPerPage = rankingResponse.pagination?.per_page;
  isLoadingTable.value = false;
};

onBeforeMount(async () => {
  await handleSearchTag();
});

onMounted(() => {
  getListData();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left: 0;
}

:deep(.search .el-select .el-input) {
  width: 200px;
}

.search {
  border-bottom: 1px solid $black-10;
  margin-bottom: 20px;
}

:deep(.el-form-item__content) {
  width: 240px;

  input {
    height: 40px;
  }
}

:deep(.el-radio-button) {
  padding: 2px 4px;
  background-color: $gray-90;
  border-radius: 2px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: 0 0 0 0
    var(--el-radio-button-checked-border-color, var(--el-color-primary));
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  box-shadow: white;
  border-right: 2px;
  border-radius: 2px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-left: white;
  border-radius: 2px;
  box-shadow: white;
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

:deep(.box__input-date) .el-input {
  width: 190px;
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
</style>
