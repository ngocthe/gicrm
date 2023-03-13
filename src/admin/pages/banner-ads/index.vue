<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.banner_ads") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.banner_ads") }}</template>
        <template #button>
          <ButtonCreateNew @click="addBannerAds" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            label-width="120px"
            class="form-search"
            inline
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('banner_name')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('placeholder.enter_banner_name')"
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item :label="$t('industry')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.store_type"
                  :placeholder="$t('placeholder.select_status')"
                  autocomplete="on"
                >
                  <el-option value="" :label="$t('all')"></el-option>
                  <el-option
                    value="66"
                    :label="$t('title_screen.portal')"
                  ></el-option>
                  <el-option
                    v-for="item in filterDataTypeStore"
                    :key="item.id"
                    :value="item.id"
                    :label="$t(item.name)"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item :label="$t('display_position')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.position"
                  filterable
                  :placeholder="$t('placeholder.select_display_position')"
                  autocomplete="on"
                  :loading="isLoadingSearchUser"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in positionBannerOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.status"
                  :placeholder="$t('placeholder.select_status')"
                  autocomplete="on"
                >
                  <el-option value="" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in statusDisplayOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <br />
            <el-form-item class="box__input-date" :label="$t('display_period')"
              ><client-only>
                <el-date-picker
                  v-model="formSearch.start_date"
                  :editable="false"
                  :placeholder="$t('start_date')"
                  width="144px"
                  type="date"
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
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  width="144px"
                  clearable
                />
              </client-only>
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
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndex"
            />
            <el-table-column
              :label="$t('display_order')"
              min-width="115px"
              prop="index"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.index }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('banner_image')"
              class="column-point"
              min-width="160px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  <el-image style="height: 50px" :src="scope.row.image?.url"
                /></span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('banner_name')"
              class="column-point"
              min-width="180px"
              prop="name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('display_position')"
              class="column-point"
              width="230px"
              prop="position"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{
                  $t(
                    findObj(positionBannerOptions, "value", scope.row.position)
                      .label
                  )
                }}
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
                    scope.row.store_type === TYPE_PORTAL
                      ? $t("title_screen.portal")
                      : $t(
                          findObj(dataTypeStore, "id", scope.row.store_type)
                            .name
                        )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('display_period')"
              class="column-point"
              width="300px"
              prop="start_time"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    formatDate(scope.row.start_time, "YYYY年MM月DD日") +
                    " - " +
                    formatDate(scope.row.end_time, "YYYY年MM月DD日")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('display_size')"
              class="column-point"
              min-width="130px"
              prop="position"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.position_size }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('update_date')"
              class="column-point"
              width="180px"
              prop="updated_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.updated_at, "YYYY年MM月DD日") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('changer')"
              class="column-point"
              min-width="120px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.changer }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('action')"
              width="110px"
            >
              <template #default="scope">
                <IconEdit
                  class="button-view"
                  @click="detailBannerAds(scope.row.id)"
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
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "#app";
import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import ButtonCreateNew from "~/../../src/shared/components/button/CreateNew.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import BannerAdsRequest from "~/../../src/shared/requests/BannerAdsRequest";
import { formatDate } from "~/../../src/shared/utils/format";
import { customIndex } from "~/../../src/shared/utils";
import { findObj } from "~/../../src/shared/utils";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { positionBannerOptions } from "~/../../src/shared/constants/positionBanner";
import { statusDisplayOptions } from "~/../../src/shared/constants/statusDisplay";
import { BannerAds } from "~/../../src/shared/types/bannerAds";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { TYPE_PORTAL } from "~/../../src/shared/constants/category";

const { t } = i18n.global;
const isLoadingSearchUser = ref(false);
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const dataTableStore = DataTableStore();
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const formSearch = ref({
  name: null,
  position: null,
  position_size: null,
  status: null,
  store_type: "",
  start_date: "",
  end_date: "",
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
const addBannerAds = () => {
  router.push(`/banner-ads/create`);
};

const detailBannerAds = (id) => {
  router.push(`/banner-ads/edit/${id}`);
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataBannerAds();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataBannerAds();
};

const addConditionSearchStore = () => {
  dataTableStore.bannerAdsList = {
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
    await getDataBannerAds();
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

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

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
  await getDataBannerAds();
  isLoadingTable.value = false;
};

const getDataBannerAds = async () => {
  try {
    isLoadingTable.value = true;

    const params = {
      name: formSearch.value.name,
      position: formSearch.value.position,
      status: formSearch.value.status,
      store_type: formSearch.value.store_type,
      start_date: formSearch.value.start_date,
      end_date: formSearch.value.end_date,
    };

    const bannerAdsData = (
      await BannerAdsRequest.list<BannerAds[]>({
        ...params,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;

    tableData.value = bannerAdsData.data;
    pagination.total = bannerAdsData.pagination?.total;
    pagination.currentPage = bannerAdsData.pagination?.current_page;
    pagination.numberRecordPerPage = bannerAdsData.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (dataTableStore.bannerAdsList.search) {
    formSearch.value = dataTableStore.bannerAdsList.search;
  }
  if (dataTableStore.bannerAdsList.sort) {
    sortTable.order_by = dataTableStore.bannerAdsList.sort.order_by;
    sortTable.direct = dataTableStore.bannerAdsList.sort.direct;
  }
  pagination.currentPage = dataTableStore.bannerAdsList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.bannerAdsList.pageSize;
  await getDataBannerAds();
});
</script>

<style lang="scss" scoped>
.button-view {
  cursor: pointer;
}
:deep(.search) .el-select .el-input {
  width: 160px;
  height: 40px;
}
</style>
