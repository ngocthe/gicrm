<template>
  <div class="user-list-content">
    <div v-if="!isConfirmMessage">
      <div v-if="!id" class="table-title">
        {{ $t("title_screen.send_target_search") }}
      </div>
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
            <el-form-item :label="$t('keyword_search')">
              <InputText
                v-model="formSearch.keyword"
                :placeholder="$t('email_of_name')"
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item class="date-notices" :label="$t('last_login')">
              <InputDate
                v-model="formSearch.last_time_visited_store_start"
                :value-format="'YYYY-MM-DD HH:mm:ss'"
                :placeholder="$t('start_date')"
                clearable
              />
              <InputDate
                v-model="formSearch.last_time_visited_store_end"
                :value-format="'YYYY-MM-DD HH:mm:ss'"
                :placeholder="$t('end_date')"
                clearable
              />
            </el-form-item>
            <el-form-item
              class="time-more"
              :label="$t('admin.messages.access_log')"
            >
              <input-number
                v-model="formSearch.number_visited_store_min"
                placeholder=""
              />
              <span class="time--more">{{ $t("time_or_more") }}</span>
              <input-number
                v-model="formSearch.number_visited_store_max"
                placeholder=""
              />
              <span class="time--more">{{ $t("time_or_more") }}</span>
            </el-form-item>
            <el-form-item class="birth-day" :label="$t('birth_day')">
              <client-only>
                <el-select
                  v-model="formSearch.birth_month_from"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("monday") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_day_from"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("from_the_day") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_month_to"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("monday") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_day_to"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("sunday") }}</span>
            </el-form-item>
            <el-form-item :label="$t('era')">
              <client-only>
                <el-select
                  v-model="formSearch.age"
                  :placeholder="$t('era')"
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in ageOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('gender')">
              <client-only>
                <el-select
                  v-model="formSearch.gender"
                  :placeholder="$t('gender')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <br />
            <el-form-item :label="$t('admin.messages.section')">
              <client-only>
                <el-select v-model="formSearch.role" :placeholder="$t('all')">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in optionRoleType"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('industry')">
              <client-only>
                <el-select
                  v-model="formSearch.store_type"
                  :placeholder="$t('industry')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in filterDataTypeStore"
                    :key="item.id"
                    :label="$t(item.name)"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('plan')">
              <client-only>
                <el-select
                  v-model="formSearch.plan_id"
                  class="select-plans"
                  :placeholder="$t('all')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in planNameData"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item v-if="id" :label="$t('status')">
              <client-only>
                <el-select v-model="formSearch.status" :placeholder="$t('all')">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in statusSendOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <ButtonSearch :loading="isLoadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
    </div>
    <div v-if="id" class="table-title">
      {{ $t("destination_list") }}
    </div>
    <div v-else class="table-title">
      {{ $t("title_screen.send_target_search") }}
    </div>
    <div class="user-list custom-table">
      <client-only>
        <div class="check-all-child">
          <el-checkbox
            v-if="!id && !isConfirmMessage"
            v-model="checkAll"
            :disabled="isConfirmMessage"
            :label="$t('all')"
            @change="handleCheckAllChange"
          ></el-checkbox>
          <el-checkbox
            v-if="isConfirmMessage"
            :disabled="isConfirmMessage"
            :label="$t('all')"
            :checked="true"
          ></el-checkbox>
        </div>
        <el-checkbox-group
          v-model="arrayUserPick"
          @change="handleCheckedChange"
        >
          <el-table
            ref="multipleTableRef"
            v-loading="isLoadingTable || loadingDetail"
            :data="tableData"
            :empty-text="noData"
            max-height="248px"
            style="width: 100%"
            border
            @sort-change="headerSort"
          >
            <el-table-column
              v-if="!id"
              fixed="left"
              class="column-checkbox"
              width="90"
            >
              <template #header>
                <div class="check-all"></div>
              </template>
              <template #default="scope">
                <el-checkbox
                  v-if="!isConfirmMessage"
                  :disabled="isConfirmMessage"
                  :label="scope.row._id"
                ></el-checkbox>
                <el-checkbox
                  v-if="isConfirmMessage"
                  :disabled="isConfirmMessage"
                  :checked="true"
                ></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column
              v-if="!isConfirmMessage"
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndex"
            />

            <el-table-column
              v-if="isConfirmMessage"
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndexConfirm"
            />

            <el-table-column :label="$t('full_name_kanji')" min-width="160px">
              <template #default="scope">{{ scope.row.fullname }}</template>
            </el-table-column>
            <el-table-column
              min-width="180px"
              property="email"
              :label="$t('email_address')"
            >
              <template #default="scope">{{ scope.row.email }}</template>
            </el-table-column>
            <el-table-column :label="$t('gender')" prop="gender" width="110px">
              <template #default="scope">
                {{
                  scope.row.gender !== null
                    ? $t(
                        findObj(genderOptions, "value", scope.row.gender)
                          ? findObj(genderOptions, "value", scope.row.gender)
                              ?.label
                          : ""
                      )
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('birthday')"
              width="180px"
              prop="birth_day"
            >
              <template #default="scope">
                {{ formatDate(scope.row.birth_day, "YYYY年MM月DD日") }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.section')"
              width="180px"
            >
              <template #default="scope">
                {{ scope.row.type ? $t(scope.row.type + "_receiver") : "" }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.access_log')"
              min-width="130px"
              header-align="left"
              align="right"
            >
              <template #default="scope"
                >{{
                  priceDisplay(
                    formatPriceFromMath(scope.row.total_visited_store, 2)
                  )
                }}{{ $t("times") }}</template
              >
            </el-table-column>
            <el-table-column
              v-if="!id"
              :label="$t('last_login')"
              width="180px"
              prop="last_time_visited_store"
            >
              <template #default="scope">{{
                formatDate(scope.row.last_time_visited_store, "YYYY年MM月DD日")
              }}</template>
            </el-table-column>
            <el-table-column v-if="id" :label="$t('created')" width="180px">
              <div>{{ formatDate(createdDate, "YYYY年MM月DD日") }}</div>
            </el-table-column>
            <el-table-column v-if="id" :label="$t('status')" width="150px">
              <template #default="scope">{{
                scope.row.delivery_status
                  ? $t(
                      findObj(
                        statusSendOptions,
                        "value",
                        scope.row.delivery_status
                      )?.label
                    )
                  : ""
              }}</template>
            </el-table-column>
            <el-table-column
              v-if="id"
              width="180px"
              :label="$t('admin.messages.sent_date_time')"
            >
              <template #default="scope">{{
                formatDate(scope.row.delivery_at, "YYYY年MM月DD日")
              }}</template>
            </el-table-column>
            <el-table-column width="160px" :label="$t('industry')">
              <template #default="scope">{{
                scope.row.store_type?.name
              }}</template>
            </el-table-column>
            <el-table-column width="200px" :label="$t('plan')">
              <template #default="scope">{{
                scope.row.plan?.name ? $t("plans_" + scope.row.plan?.name) : ""
              }}</template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </client-only>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            v-if="isConfirmMessage"
            :current-page="paginationRecipient.currentPage"
            :default-record="paginationRecipient.numberRecordPerPage"
            :total="paginationRecipient.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
          <LazyCommonPagination
            v-else
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTable } from "element-plus";
import {
  computed,
  defineProps,
  inject,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import InputText from "../../../shared/components/input/InputText.vue";
import InputDate from "../../../shared/components/input/Date.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import MessageRequest from "~/../../src/shared/requests/MessageRequest";
import { User } from "~/../../src/shared/types/user";
import { formatDate } from "~/../../src/shared/utils/format";
import { customIndex } from "~/../../src/shared/utils";
import { planNameData } from "~/../../src/shared/constants";
import {
  genderOptions,
  ageOptions,
  dateOptions,
  monthOptions,
  arrayAge,
  statusSendOptions,
} from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils/array";
import { useRoute } from "nuxt/app";
import { Message } from "~/../../src/shared/types/message";
import { bussinessOptions } from "~/../../src/shared/constants/message";
import optionRoleType from "~/../../src/shared/constants/roles";
import InputNumber from "~/../../src/shared/components/input/Code.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import priceDisplay from "~/../../src/shared/utils/price";
import { formatPriceFromMath } from "~/../../src/shared/utils/format";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import moment from "moment";

const route = useRoute();
const planOptions = ref([]);
const arrayUserPick = ref([]);
const checkAll = ref(false);
interface Prop {
  showFormSearch: boolean;
  createdDate?: string;
  checkAllUserPage: [];
  tableDataChecked: [];
}

const props = withDefaults(defineProps<Prop>(), {
  showFormSearch: false,
  createdDate: "",
});

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const { checkAllUserPage, tableDataChecked } = toRefs(props);
const id = ref(null);
id.value = Number(route.params.id);

const { t } = i18n.global;
const noData = ref(t("no_data"));
const loadingDetail = ref(false);
const emits = defineEmits(["arrayUsers", "messageData"]);
const loading = ref(false);
const isLoadingSearch = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const isLoadingTable = ref(false);
const isConfirmMessage = ref(inject("isConfirmMessageProvide", true));
const allDataUser = ref([]);
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const paginationRecipient = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const formSearch = ref({
  keyword: null,
  role: null,
  last_time_visited_store_start: null,
  last_time_visited_store_end: null,
  birth_day_to: null,
  number_visited_store_min: null,
  number_visited_store_max: null,
  birth_day_from: null,
  to_date: null,
  birth_month_from: null,
  birth_month_to: null,
  age: null,
  gender: null,
  store_type: null,
  plan_id: null,
  status: null,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const columnIndexConfirm = (index: number) => {
  return customIndex(
    index,
    paginationRecipient.currentPage,
    paginationRecipient.numberRecordPerPage
  );
};

const getAllDataTable = () => {
  allDataUser.value = JSON.parse(JSON.stringify(tableDataChecked.value));
  paginationRecipient.total = allDataUser.value.length;
  paginationRecipient.currentPage = 1;
  paginationRecipient.numberRecordPerPage = ADMIN_PAGINATION.PER_PAGE;
  getDataTable();
};

const getDataTable = () => {
  tableData.value = allDataUser.value.slice(
    (paginationRecipient.currentPage - 1) *
      paginationRecipient.numberRecordPerPage,
    paginationRecipient.numberRecordPerPage * paginationRecipient.currentPage
  );
};

const handleCheckAllChange = (val: boolean) => {
  const arrayIdUsers = tableData.value.map((item) => item._id);
  arrayUserPick.value = val ? arrayIdUsers : [];
  arrayUserPick.value = arrayUserPick.value.filter((item) => item !== false);
  emits("arrayUsers", arrayUserPick.value, arrayIdUsers, tableData.value);
};

const handleCheckedChange = () => {
  checkAll.value = !tableData.value.filter(
    (item) => !arrayUserPick.value.includes(item._id)
  ).length;
  const arrayIdUsers = tableData.value.map((item) => item._id);
  arrayUserPick.value = arrayUserPick.value.filter((item) => item !== false);
  emits("arrayUsers", arrayUserPick.value, arrayIdUsers, tableData.value);
};

const getListUser = async () => {
  if (id.value) {
    await getDataRecipient();
  } else {
    await getDataUsers();
  }
};

const setUserPick = () => {
  const currentIds = tableData.value.map((item) => item._id);
  arrayUserPick.value = checkAllUserPage.value.filter((id) =>
    currentIds.includes(id)
  );
  checkAll.value = arrayUserPick.value.length === currentIds.length;
};

const handleCurrentChange = async (val: number) => {
  if (isConfirmMessage.value) {
    paginationRecipient.currentPage = val;
    getDataTable();
  } else {
    pagination.currentPage = val;
    try {
      isLoadingTable.value = true;
      await getListUser();
      setUserPick();
    } finally {
      isLoadingTable.value = false;
    }
  }
};

const handleSizeChange = async (val) => {
  if (isConfirmMessage.value) {
    paginationRecipient.numberRecordPerPage = val;
    paginationRecipient.currentPage = 1;
    getDataTable();
  } else {
    pagination.numberRecordPerPage = val;
    pagination.currentPage = 1;
    await getListUser();
    setUserPick();
  }
};

const tableData = ref([]);
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
  loading.value = true;
  await getListUser();
  setUserPick();
  loading.value = false;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getListUser();
    if (!tableData.value.length) {
      noData.value = t("no_result");
    }
    setUserPick();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const getDataUsers = async () => {
  try {
    isLoadingTable.value = true;
    const ageRange = findObj(arrayAge, "type", formSearch.value.age)?.value;
    const params = {
      keyword: formSearch.value.keyword,
      role: formSearch.value.role,
      last_time_visited_store_start:
        formSearch.value.last_time_visited_store_start,
      last_time_visited_store_end: moment(
        formSearch.value.last_time_visited_store_end,
        "YYYY-MM-DD HH:mm:ss"
      )
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .format("YYYY-MM-DD HH:mm:ss"),
      birth_day_from: formSearch.value.birth_day_from,
      birth_day_to: formSearch.value.birth_day_to,
      birth_month_from: formSearch.value.birth_month_from,
      birth_month_to: formSearch.value.birth_month_to,
      number_visited_store_min: formSearch.value.number_visited_store_min,
      number_visited_store_max: formSearch.value.number_visited_store_max,
      to_date: formSearch.value.to_date,
      age_range: ageRange ? [ageRange] : null,
      gender: formSearch.value.gender,
      store_type: formSearch.value.store_type,
      plan_id: formSearch.value.plan_id,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid date"
      ) {
        delete params[key];
      }
    });

    const messageResponse = (
      await MessageRequest.searchUser<User[]>(
        {
          ...params,
          ...sortTable,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        },
        true
      )
    ).data;

    tableData.value = messageResponse.data;

    checkAll.value = !tableData.value.filter(
      (item) => !arrayUserPick.value.includes(item._id)
    ).length;

    pagination.total = messageResponse.pagination?.total;
    pagination.currentPage = messageResponse.pagination?.current_page;
    pagination.numberRecordPerPage = messageResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const getDetailMessages = async () => {
  try {
    loadingDetail.value = true;
    const messageResponse = await MessageRequest.show<Message>(id.value);
    emits("messageData", messageResponse.data);
  } catch (e) {
    return e;
  } finally {
    loadingDetail.value = false;
  }
};

const getDataRecipient = async () => {
  try {
    isLoadingTable.value = true;
    const ageRange = findObj(arrayAge, "type", formSearch.value.age)?.value;
    const params = {
      keyword: formSearch.value.keyword,
      role: formSearch.value.role,
      start_date: formSearch.value.last_time_visited_store_start,
      end_date: moment(
        formSearch.value.last_time_visited_store_end,
        "YYYY-MM-DD HH:mm:ss"
      )
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .format("YYYY-MM-DD HH:mm:ss"),
      birth_day_from: formSearch.value.birth_day_from,
      birth_day_to: formSearch.value.birth_day_to,
      birth_month_from: formSearch.value.birth_month_from,
      birth_month_to: formSearch.value.birth_month_to,
      number_visited_store_min: formSearch.value.number_visited_store_min,
      number_visited_store_max: formSearch.value.number_visited_store_max,
      to_date: formSearch.value.to_date,
      age_range: ageRange ? JSON.stringify([ageRange]) : null,
      gender: formSearch.value.gender,
      store_type: formSearch.value.store_type,
      plan_id: formSearch.value.plan_id,
      status: formSearch.value.status,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid date"
      ) {
        delete params[key];
      }
    });

    const messageResponse = (
      await MessageRequest.showRecipient<User[]>(
        id.value,
        {
          ...params,
          ...sortTable,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        },
        true
      )
    ).data;

    tableData.value = messageResponse.data;
    checkAll.value = !tableData.value.filter(
      (item) => !arrayUserPick.value.includes(item._id)
    ).length;

    pagination.total = messageResponse.pagination?.total;
    pagination.currentPage = messageResponse.pagination?.current_page;
    pagination.numberRecordPerPage = messageResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (id.value) {
    await getDetailMessages();
    await getDataRecipient();
  } else {
    await getDataUsers();
  }
});

defineExpose({
  loadingDetail,
  getDataUsers,
  getAllDataTable,
});
</script>

<style lang="scss" scoped>
.custom-table {
  position: relative;
}

:deep(.footer .group-button) {
  padding: 18px 0 !important;
}

.check-all-child {
  position: absolute;
  top: 10px;
  left: 17px;
  z-index: 99;
}

.user-list-content {
  padding-bottom: 20px;

  .table-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 20px;
  }

  .time--more,
  .unit {
    padding-right: 12px;
  }

  .select-plans {
    :deep(.el-input) {
      width: 210px;
    }
  }

  :deep(.date-notices .el-input) {
    width: 170px;
  }

  :deep(.time-more .el-input) {
    width: 90px;
  }

  :deep(.birth-day .el-input) {
    width: 100px;
  }
}

:deep(.el-checkbox-group .el-checkbox__label) {
  display: none;
}
</style>
