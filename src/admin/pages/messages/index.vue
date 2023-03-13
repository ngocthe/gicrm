<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.messages") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.messages") }}</template>
        <template #button>
          <ButtonCreateNew @click="addMessage" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            class="form-search d-flex justify-content-between"
            inline
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <div>
              <el-form-item :label="$t('keyword_search')">
                <InputText
                  v-model="formSearch.keyword"
                  :placeholder="$t('title_and_content')"
                  :width="'194px'"
                />
              </el-form-item>
              <el-form-item :label="$t('admin.messages.sender')">
                <ClientOnly>
                  <el-select
                    v-model="formSearch.sender_id"
                    filterable
                    :placeholder="$t('all')"
                    autocomplete="on"
                    :loading="isLoadingSearchUser"
                  >
                    <el-option :value="null" :label="$t('all')"></el-option>
                    <el-option
                      v-for="item in senderOptions"
                      :key="item.id"
                      :label="item.fullname"
                      :value="item.id"
                    />
                  </el-select>
                </ClientOnly>
              </el-form-item>
              <el-form-item :label="$t('receiver')">
                <ClientOnly>
                  <el-select
                    v-model="formSearch.recipient_types"
                    :placeholder="$t('all')"
                  >
                    <el-option :value="null" :label="$t('all')"></el-option>
                    <el-option
                      v-for="item in optionRoleType"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    ></el-option>
                  </el-select>
                </ClientOnly>
              </el-form-item>
              <el-form-item :label="$t('admin.messages.sent_date_time')">
                <client-only>
                  <el-date-picker
                    v-model="formSearch.send_at_from"
                    type="datetime"
                    :placeholder="$t('placeholder.start_date_and_time')"
                    format="YYYY年MM月DD日 HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :disabled-date="disabledDateStart"
                    class="select-date start-date"
                    clearable
                  />
                </client-only>
                <client-only>
                  <el-date-picker
                    v-model="formSearch.send_at_to"
                    type="datetime"
                    :placeholder="$t('placeholder.end_date_and_time')"
                    format="YYYY年MM月DD日 HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :disabled-date="disabledDateEnd"
                    class="select-date end-date"
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
            <el-table-column :label="$t('receiver')" min-width="161px">
              <template #default="scope">
                <span> {{ getNameReceiver(scope.row.recipient_types) }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('title_keyword')"
              min-width="161px"
              prop="title"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.title }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('content')"
              class="column-point"
              min-width="161px"
              prop="content"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.content }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.sent_date_time')"
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
              :label="$t('admin.messages.sender')"
              class="column-point"
              min-width="161px"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.sender?.fullname }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('method_message')"
              class="column-point"
              min-width="145px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    $t(findObj(messageTypes, "value", scope.row.type)?.label)
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.target_delivery')"
              class="column-point"
              min-width="155px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    scope.row.delivery_count?.sent +
                    scope.row.delivery_count?.unsend
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.send_count')"
              class="column-point"
              min-width="150px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.delivery_count?.sent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('created')"
              class="column-point"
              width="140px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('view_details')"
              min-width="121px"
              fixed="right"
            >
              <template #default="scope">
                <IconView
                  class="button-view"
                  @click="detailMessage(scope.row.id)"
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
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "#app";
import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import ButtonCreateNew from "~/../../src/shared/components/button/CreateNew.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { DataTableStore } from "~/../../src/admin/store/dataTable";
import MessageRequest from "~/../../src/shared/requests/MessageRequest";
import { optionRoleType } from "~/../../src/shared/constants/roles";
import { ListMessage } from "~/../../src/shared/types/message";
import { formatDate } from "~/../../src/shared/utils/format";
import { messageTypes } from "~/../../src/shared/constants/message";
import { findObj } from "~/../../src/shared/utils/array";
import UserRequest from "~/../../src/shared/requests/UserRequest";
import { ROLES } from "~/../../src/shared/constants/roles";
import {
  commonDisabledDateEnd,
  commonDisabledDateStart,
} from "~/../../src/shared/utils";

const { t } = i18n.global;
const senderOptions = ref({});
const isLoadingSearchUser = ref(false);
const router = useRouter();
const tableData = ref([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const dataTableStore = DataTableStore();
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const formSearch = ref({
  keyword: null,
  sender_id: null,
  recipient_types: null,
  send_at_from: "",
  send_at_to: "",
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const addMessage = () => {
  router.push(`/messages/create`);
};

const detailMessage = (id) => {
  router.push(`/messages/detail/${id}`);
};

const searchSenderOption = async () => {
  const params = {
    role: ROLES.ADMIN,
  };
  try {
    isLoadingSearchUser.value = true;
    const dataUser = await UserRequest.list({ ...params }, true);
    senderOptions.value = dataUser.data.data;
  } finally {
    isLoadingSearchUser.value = false;
  }
};

const getNameReceiver = (dataReceiver) => {
  const listReceiver = [...new Set(dataReceiver)];
  if (listReceiver) {
    return Array.prototype.map
      .call(listReceiver, function (item) {
        return t(item + "_receiver");
      })
      .join(", ");
  }
  return "";
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataMessage();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataMessage();
};

const addConditionSearchStore = () => {
  dataTableStore.messageList = {
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
    await getDataMessage();
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
  await getDataMessage();
  isLoadingTable.value = false;
};

const getDataMessage = async () => {
  try {
    isLoadingTable.value = true;

    const params = {
      keyword: formSearch.value.keyword,
      sender_ids: formSearch.value.sender_id
        ? JSON.stringify([formSearch.value.sender_id])
        : [],
      recipient_type: formSearch.value.recipient_types,
      send_at_from: formSearch.value.send_at_from,
      send_at_to: formSearch.value.send_at_to,
    };

    const messageData = (
      await MessageRequest.list<ListMessage[]>({
        ...params,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;

    tableData.value = messageData.data;
    pagination.total = messageData.pagination?.total;
    pagination.currentPage = messageData.pagination?.current_page;
    pagination.numberRecordPerPage = messageData.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const disabledDateStart = (time: Date) => {
  return commonDisabledDateStart(time, formSearch.value.send_at_to);
};

const disabledDateEnd = (time: Date) => {
  return commonDisabledDateEnd(time, formSearch.value.send_at_from);
};

onMounted(async () => {
  if (dataTableStore.messageList?.search) {
    formSearch.value = dataTableStore.messageList.search;
  }
  if (dataTableStore.messageList?.sort) {
    sortTable.order_by = dataTableStore.messageList.sort.order_by;
    sortTable.direct = dataTableStore.messageList.sort.direct;
  }
  pagination.currentPage = dataTableStore.messageList.currentPage;
  pagination.numberRecordPerPage = dataTableStore.messageList.pageSize;
  await getDataMessage();
  await searchSenderOption();
});
</script>

<style lang="scss" scoped>
.button-view {
  cursor: pointer;
}

:deep(.search) .el-input {
  width: 168px;
}

:deep(.search .select-date) {
  width: 210px;
}
</style>
