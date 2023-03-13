<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :title="$t('change_plan')"
        :close-on-click-modal="false"
        align-center
        :show-close="showClose"
      >
        <template #header>
          <div class="header-confirm">{{ $t("change_plan") }}</div>
        </template>
        <template #footer>
          <el-scrollbar v-loading="isLoading" max-height="620px">
            <el-form label-width="160px" label-position="left">
              <el-form-item :label="$t('current_plan')">
                <input-text v-model="planName" disabled />
              </el-form-item>
              <el-form-item :label="$t('new_plan')">
                <el-select
                  v-if="!inUse"
                  v-model="formSubmit.plan_id"
                  @change="getDataPlanById"
                >
                  <el-option
                    v-for="item in planNameData.filter(
                      (planItem) => planItem.value > planInUse
                    )"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(`${item.label}`)"
                  />
                </el-select>
                <el-select v-else v-model="choosePlan" :disabled="true">
                  <el-option
                    v-for="item in planNameData"
                    :value="item.value"
                    :label="$t(`${item.label}`)"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('booking.payment_options')">
                <el-select v-model="formSubmit.extend_type">
                  <el-option
                    :value="optionPlan.YEARLY"
                    :label="$t('admin.plans.year_time_payment')"
                  >
                  </el-option>
                  <el-option
                    :value="optionPlan.MONTHLY"
                    :label="$t('admin.plans.monthly_payment')"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('admin.plans.plan_amount')">
                <div class="text-price">
                  {{
                    priceDisplay(
                      formSubmit.extend_type === optionPlan.YEARLY
                        ? planData?.monthly_cost_annual
                        : planData?.monthly_cost
                    )
                  }}{{ $t("yen") }}
                </div>
              </el-form-item>
              <div class="block-contract">
                <el-form-item :label="$t('admin.plans.additional_options')">
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.zoom_monthly_fee')"
                      prop="zoom_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="priceDisplay(planData?.zoom_fee)"
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <el-form-item label-width="0px" class="d-flex">
                          <el-radio-group v-model="formSubmit.zoom_fee">
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.line_monthly_fee')"
                      prop="line_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="priceDisplay(planData?.line_fee)"
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <div class="d-flex">
                          <el-radio-group v-model="formSubmit.line_fee">
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.external_monthly_fee')"
                      prop="external_site_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.external_site_monthly_fee)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <div class="d-flex">
                          <el-radio-group
                            v-model="formSubmit.external_site_monthly"
                          >
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.initial_monthly_fee')"
                      prop="initial_support_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(
                                planData?.initial_support_monthly_fee
                              )
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <div class="d-flex">
                          <el-radio-group
                            v-model="formSubmit.initial_support_monthly_fee"
                            class="d-flex"
                          >
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.customer_monthly_fee')"
                      prop="customer_attraction_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.customer_attraction_fee)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <div class="d-flex">
                          <el-radio-group
                            v-model="formSubmit.customer_attraction_fee"
                          >
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.submission_monthly_fee')"
                      prop="submission_agency_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(
                                planData?.submission_agency_monthly_fee
                              )
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                        <div class="d-flex">
                          <el-radio-group
                            v-model="formSubmit.submission_agency_monthly_fee"
                          >
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('SMS_under_100')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.sms_monthly_fee?.below_100)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('SMS_under_300')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.sms_monthly_fee?.below_300)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('SMS_under_500')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.sms_monthly_fee?.below_500)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('SMS_under_1000')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(
                                planData?.sms_monthly_fee?.below_1000
                              )
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('SMS_above_1000')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price
                            :model-value="
                              priceDisplay(planData?.sms_monthly_fee?.unlimit)
                            "
                            disabled
                          />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.SMS_monthly_fee')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <el-form-item class="d-flex">
                          <el-radio-group v-model="formSubmit.sms_monthly_fee">
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="block-contract__item">
                    <el-form-item
                      :label="$t('admin.plans.custom_billing_monthly')"
                      prop="custom_billing_monthly_fee"
                      label-width="190px"
                    >
                      <div>
                        <div class="plans-input">
                          <input-price disabled />
                          <div class="unit-price">{{ $t("yen") }}</div>
                        </div>

                        <el-form-item class="d-flex">
                          <el-radio-group
                            v-model="formSubmit.custom_billing_monthly"
                          >
                            <el-radio :label="true">
                              {{ $t("join") }}
                            </el-radio>
                            <el-radio :label="false">
                              {{ $t("not_join") }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </el-form-item>
                  </div>
                </el-form-item>
              </div>
              <el-form-item :label="$t('admin.plans.additional_option_amount')">
                <div class="text-price">
                  5,000{{ $t("yen") }}（{{
                    $t("admin.plans.does_not_include_sms_sent_amount")
                  }}）
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="group-button">
            <span class="dialog-footer">
              <button-white
                :name="$t('button.cancel')"
                :disabled="loading"
                @click="handleClose"
              />
              <button-blue
                class="button-blue"
                :name="$t('button.change_plan')"
                :loading="loading"
                @click="handleConfirm"
              />
            </span>
          </div>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";
import ButtonWhite from "../../../shared/components/button/ButtonWhite.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { planNameData, optionPlan } from "~/../../src/shared/constants";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { Plan } from "~/../../src/shared/types/plan";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { useMeStore } from "~/../../src/shared/stores/me";
import { onMounted, reactive, ref } from "#imports";
import priceDisplay from "../../utils/price";

const isLoading = ref(false);
const meStore = useMeStore();

const formSubmit = reactive({
  //TODO
  plan_id: 0,
  extend_type: optionPlan.YEARLY,
  zoom_fee: true,
  line_fee: true,
  external_site_monthly: true,
  initial_support_monthly_fee: true,
  customer_attraction_fee: true,
  submission_agency_monthly_fee: true,
  custom_billing_monthly: true,
  sms_monthly_fee: true,
  below_100: true,
  below_300: true,
  below_500: true,
  below_1000: true,
  unlimit: true,
});

interface Prop {
  inUse?: boolean;
  choosePlan?: number;
  planName?: string;
  dialogVisible: boolean;
  width?: string;
  loading?: boolean;
  showClose?: boolean;
  planInUse?: number;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "480px",
  showClose: true,
  inUse: false,
});

const planData = ref();

const { dialogVisible, width, planName, choosePlan, inUse, planInUse } =
  toRefs(props);

const emits = defineEmits(["handleClose", "handleConfirm"]);

const getDataPlanById = async (id: number) => {
  try {
    isLoading.value = true;
    const planResponse = (await PlanRequest.show(id)).data as Plan;
    planData.value = planResponse;
    formSubmit.plan_id = id;
    if (inUse.value) {
      formSubmit.extend_type = meStore.getPlan.extend_type;
    }
  } catch (e) {
    return e;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  formSubmit.plan_id = choosePlan?.value as number;
  await getDataPlanById(choosePlan?.value);
});

const handleClose = () => {
  emits("handleClose");
};

const planSetting = async () => {
  let dataResponse;
  isLoading.value = true;
  try {
    dataResponse = (
      await StoreRequest.settingPlan({
        plan_id: formSubmit.plan_id,
        extend_type: formSubmit.extend_type,
      })
    ).data;
  } catch (e) {
    return e;
  } finally {
    isLoading.value = false;
  }
  return dataResponse;
};

const handleConfirm = async () => {
  const planData = await planSetting();
  emits("handleConfirm", planData.plan_id);
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-dialog) {
    width: 785px;
    padding: 20px;
    height: 800px;

    .el-dialog__body {
      padding: 0;
    }
  }

  .button-blue {
    background: #409eff;
  }

  .header-confirm {
    font-size: 18px;
    margin-bottom: 30px;
  }

  :deep(.el-input) {
    width: 530px;
    height: 40px;
  }

  .block-contract {
    margin-bottom: 10px;
    &__item {
      margin-bottom: 8px;

      .el-form-item {
        :deep(label) {
          align-item: center;
          height: 40px;
        }
      }
      .plans-input {
        align-items: center;
        display: flex;
        gap: 10px;
        .el-input {
          width: 320px;
        }
      }
    }
  }

  .group-button {
    margin-top: 5px;
  }

  .text-price {
    font-weight: 700;
    color: red;
  }
}
</style>
