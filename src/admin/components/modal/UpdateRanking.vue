<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="$t('ranking_edit')"
    width="680px"
    align-center
    :z-index="9999"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :rules="rankingRules"
      :model="formData"
      class="form-menu"
      require-asterisk-position="right"
      label-position="left"
      label-width="180px"
    >
      <div class="box-ranking">
        <el-scrollbar max-height="500px">
          <el-form-item :label="$t('store_name')">
            <input-price v-model="formData.store_name" disabled="true" />
          </el-form-item>

          <el-form-item :label="$t('industry')">
            <input-price v-model="formData.industry" disabled="true" />
          </el-form-item>

          <el-form-item :label="$t('admin.ranking.current_plan')">
            <input-text v-model="formData.current_plan" disabled="true" />
          </el-form-item>

          <el-form-item :label="$t('number_of_reservations')">
            <input-price v-model="formData.booking_store" disabled="true" />
          </el-form-item>

          <el-form-item :label="$t('number_of_accesses')">
            <input-price v-model="formData.access_store" disabled="true" />
          </el-form-item>

          <div v-if="mode === RANKING_MODE.DAY">
            <el-form-item
              :label="$t('tentative_reservations')"
              prop="daily_booking"
            >
              <input-price
                v-model="formData.daily_booking"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalBookingDaily"
              />
            </el-form-item>

            <el-form-item :label="$t('access_count')" prop="daily_access">
              <input-price
                v-model="formData.daily_access"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalAccessDaily"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_reservations')">
              <input-price
                v-model="formData.daily_total_booking"
                disabled="true"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_access')">
              <input-price
                v-model="formData.daily_total_access"
                disabled="true"
              />
            </el-form-item>
          </div>

          <div v-if="mode === RANKING_MODE.WEEK">
            <el-form-item
              :label="$t('tentative_reservations')"
              prop="weekly_booking"
            >
              <input-price
                v-model="formData.weekly_booking"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalBookingWeek"
              />
            </el-form-item>

            <el-form-item :label="$t('access_count')" prop="weekly_access">
              <input-price
                v-model="formData.weekly_access"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalAccessWeek"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_reservations')">
              <input-price
                v-model="formData.weekly_total_booking"
                disabled="true"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_access')">
              <input-price
                v-model="formData.weekly_total_access"
                disabled="true"
              />
            </el-form-item>
          </div>

          <div v-if="mode === RANKING_MODE.MONTH">
            <el-form-item
              :label="$t('tentative_reservations')"
              prop="monthly_booking"
            >
              <input-price
                v-model="formData.monthly_booking"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalBookingMonth"
              />
            </el-form-item>

            <el-form-item :label="$t('access_count')" prop="monthly_access">
              <input-price
                v-model="formData.monthly_access"
                :max-price="MAX_RESERVATION"
                @handle-change-input="updateValueTotalAccessMonth"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_reservations')">
              <input-price
                v-model="formData.monthly_total_booking"
                disabled="true"
              />
            </el-form-item>

            <el-form-item :label="$t('total_number_of_access')">
              <input-price
                v-model="formData.monthly_total_access"
                disabled="true"
              />
            </el-form-item>
          </div>
        </el-scrollbar>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <ButtonCommon
          :loading="isEditRankingLoading"
          :name="$t('button.save')"
          background-color="#15AB47"
          color="#fff"
          border-radius="4px"
          width="60px"
          @click="editRanking(formRef)"
        />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, ref, reactive, watchEffect } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { FormInstance } from "element-plus";
import rankingRules from "~/../../src/admin/validates/ranking";
import { Ranking } from "~/../../src/admin/models/ranking";
import RankingRequest from "~/../../src/shared/requests/RankingRequest";
import { formatValuePrice } from "~/../../src/shared/utils";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { formatPriceFromMath } from "~/../../src/shared/utils/format";
import { RANKING_MODE } from "~/../../src/shared/constants/ranking";
import { MAX_RESERVATION } from "~/../../src/shared/utils/validate";
import {
  updateSuccess,
  updateError,
} from "~/../../src/shared/utils/notification";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  dataRanking: Ranking;
  loading?: boolean;
  mode: string;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "30%",
  loading: false,
});

const { t } = i18n.global;
const { dialogVisible, dataRanking, mode } = toRefs(props);
const isEditRankingLoading = ref(false);
const formRef = ref<FormInstance>();
const emits = defineEmits([
  "handleCloseData",
  "showModalRanking",
  "getListData",
]);
const handleClose = () => {
  resetFormData();
  emits("handleCloseData");
  resetForm(formRef.value);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const formData = reactive({
  store_name: "",
  industry: "",
  current_plan: "",
  access_store: "",
  booking_store: "",
  daily_booking: "",
  daily_access: "",
  weekly_booking: "",
  weekly_access: "",
  monthly_booking: "",
  monthly_access: "",
  daily_total_booking: "",
  daily_total_access: "",
  weekly_total_booking: "",
  weekly_total_access: "",
  monthly_total_booking: "",
  monthly_total_access: "",
});

const resetFormData = () => {
  formData.daily_booking = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.daily_booking
  );
  formData.daily_access = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.daily_access
  );
  formData.weekly_booking = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.weekly_booking
  );
  formData.weekly_access = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.weekly_access
  );
  formData.monthly_booking = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.monthly_booking
  );
  formData.monthly_access = priceDisplay(
    dataRanking.value.stores?.admin_buff_store_ranking?.monthly_access
  );
};

const editRanking = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isEditRankingLoading.value = true;
        const params = {
          store_id: dataRanking.value.store_id,
          daily_booking: +formatValuePrice(formData.daily_booking),
          daily_access: +formatValuePrice(formData.daily_access),
          weekly_booking: +formatValuePrice(formData.weekly_booking),
          weekly_access: +formatValuePrice(formData.weekly_access),
          monthly_booking: +formatValuePrice(formData.monthly_booking),
          monthly_access: +formatValuePrice(formData.monthly_access),
        };

        await RankingRequest.updateRanking(params);
        updateSuccess();
        emits("handleCloseData");
        emits("getListData");
        resetFormData();
      } catch (error) {
        updateError();
      } finally {
        isEditRankingLoading.value = false;
      }
    }
  });
};

const updateValueTotalBookingMonth = () => {
  return (formData.monthly_total_booking = priceDisplay(
    +formatValuePrice(formData.monthly_booking) +
      parseInt(dataRanking.value.sum_real_booking)
  ));
};

const updateValueTotalAccessMonth = () => {
  return (formData.monthly_total_access = priceDisplay(
    +formatValuePrice(formData.monthly_access) +
      parseInt(dataRanking.value.sum_real_access)
  ));
};

const updateValueTotalBookingWeek = () => {
  return (formData.weekly_total_booking = priceDisplay(
    +formatValuePrice(formData.weekly_booking) +
      parseInt(dataRanking.value.sum_real_booking)
  ));
};

const updateValueTotalAccessWeek = () => {
  return (formData.weekly_total_access = priceDisplay(
    +formatValuePrice(formData.weekly_access) +
      parseInt(dataRanking.value.sum_real_access)
  ));
};

const updateValueTotalBookingDaily = () => {
  return (formData.daily_total_booking = priceDisplay(
    +formatValuePrice(formData.daily_booking) +
      parseInt(dataRanking.value.real_booking)
  ));
};

const updateValueTotalAccessDaily = () => {
  return (formData.daily_total_access = priceDisplay(
    +formatValuePrice(formData.daily_access) +
      parseInt(dataRanking.value.real_access)
  ));
};

watchEffect(() => {
  formData.store_name = dataRanking.value.stores?.name;
  formData.industry = dataRanking.value.stores?.model_has_type?.type?.name;
  formData.current_plan = dataRanking.value.stores?.plan?.plan_data?.name
    ? t("plans_" + dataRanking.value.stores?.plan?.plan_data?.name)
    : "";

  if (mode.value === RANKING_MODE.DAY) {
    formData.daily_booking = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.daily_booking
    );
    formData.daily_access = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.daily_access
    );

    formData.booking_store = priceDisplay(
      formatPriceFromMath(dataRanking.value.real_booking, 2)
    );
    formData.access_store = priceDisplay(
      formatPriceFromMath(dataRanking.value.real_access, 2)
    );

    formData.daily_total_booking = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_booking, 2)
    );

    formData.daily_total_access = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_access, 2)
    );
  }

  if (mode.value === RANKING_MODE.WEEK) {
    formData.weekly_booking = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.weekly_booking
    );
    formData.weekly_access = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.weekly_access
    );

    formData.weekly_total_booking = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_booking, 2)
    );

    formData.weekly_total_access = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_access, 2)
    );
  }

  if (mode.value === RANKING_MODE.MONTH) {
    formData.monthly_booking = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.monthly_booking
    );

    formData.monthly_access = priceDisplay(
      dataRanking.value.stores?.admin_buff_store_ranking?.monthly_access
    );

    formData.monthly_total_booking = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_booking, 2)
    );

    formData.monthly_total_access = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_total_access, 2)
    );
  }

  if (mode.value === RANKING_MODE.WEEK || mode.value === RANKING_MODE.MONTH) {
    formData.booking_store = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_real_booking, 2)
    );
    formData.access_store = priceDisplay(
      formatPriceFromMath(dataRanking.value.sum_real_access, 2)
    );
  }
});
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 15px;
}
</style>
