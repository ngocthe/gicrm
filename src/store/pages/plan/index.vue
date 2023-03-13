<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.plan_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.plan_detail") }}</template>
        <template #button>
          <ButtonExport :name="$t('button_export')" @click="handleExport" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div v-loading="isLoadingTable" class="container-plan-information">
        <div class="time">
          <div class="time-item">
            <div class="label-input_date">{{ $t("new_contact_date") }}</div>
            <input-date v-model="plan.start_date" :is-disable="true" />
          </div>
          <div class="time-item">
            <div class="label-input_date">
              {{ $t("contract_renewal_date") }}
            </div>
            <input-date v-model="plan.due_date" :is-disable="true" />
          </div>
        </div>
        <el-scrollbar
          view-style="max-height: calc(100vh - 58px - 90px - 70px - 70px);"
        >
          <div class="table-plan">
            <!--        HEADER-TABLE-->
            <div class="header-table">
              <div class="header-item">{{ $t("admin.plans.name_plan") }}</div>
              <div v-for="item in tableData" class="header-item">
                <div>{{ uppercaseFirstLetter(item.name) }}</div>
                <div>{{ $t(`${item.name}`) }}</div>
                <div v-if="item.duration && item.name !== 'free'">
                  {{ $t("admin.plans.contract_period") }}{{ item.duration
                  }}{{ $t("month_yen") }}
                </div>
              </div>
            </div>
            <!--        DETAIL-TABLE-->
            <div class="detail-table">
              <div class="label">
                <div class="label-detail">
                  {{ $t("admin.plans.annual_payment") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.year_time_payment") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.monthly_payment") }}
                </div>
                <div class="label-detail">
                  {{ $t("annual_payment_amount_month") }}
                </div>
                <div class="label-detail">
                  <div>{{ $t("difference_from_annual_payment") }}</div>
                  <div class="text-red">
                    {{ $t("annual_payment_is_advantageous") }}
                  </div>
                </div>
                <div class="label-detail">{{ $t("higher_display") }}</div>
                <div class="label-detail">
                  {{ $t("admin.plans.credit_card") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.number_monthly_reservation") }}
                </div>
                <div v-if="typeStore === SALON" class="label-detail">
                  <div>
                    {{ $t("admin.plans.number_registered_staff_members") }}
                  </div>
                  <div>{{ $t("admin.plans.nominated_type") }}</div>
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.number_photos_register_store") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.photo_gallery") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.number_registered_customers") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.job_offer") }}
                </div>
                <div class="label-detail">
                  {{ $t("admin.plans.advertisement") }}
                </div>
                <div class="label-detail">{{ $t("admin.plans.support") }}</div>
                <div class="label-detail">
                  {{ $t("admin.plans.initial_cost") }}
                </div>
                <div class="label-detail">
                  <div>{{ $t("portal_site") }}</div>
                  <div>{{ $t("recommended_display") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>
                    {{ priceDisplay(dataRanger[0]?.range.range_1.amount)
                    }}{{ $t("yen") }}{{ $t("less_than") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>
                    {{ priceDisplay(dataRanger[1]?.range.range_2.amount)
                    }}{{ $t("yen") }}{{ $t("that_all") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>
                    {{ priceDisplay(dataRanger[2]?.range.range_3.amount)
                    }}{{ $t("yen") }}{{ $t("that_all") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>
                    {{ priceDisplay(dataRanger[3]?.range.range_4.amount)
                    }}{{ $t("yen") }}{{ $t("that_all") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>
                    {{ priceDisplay(dataRanger[4]?.range.range_5.amount)
                    }}{{ $t("yen") }}{{ $t("that_all") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>1{{ $t("reserve_2") }}{{ $t("store-reception") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.booking_fee") }}
                    {{ $t("total_per_person_not_yen") }}
                  </div>
                  <div>1{{ $t("reserve_2") }}{{ $t("seat") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options")
                    }}{{ $t("admin.plans.zoom_monthly_fee") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options")
                    }}{{ $t("admin.plans.line_monthly_fee") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options") }}
                  </div>
                  <div>{{ $t("admin.plans.external_monthly_fee") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options") }}
                  </div>
                  <div>{{ $t("admin.plans.initial_monthly_fee") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options") }}
                  </div>
                  <div>{{ $t("admin.plans.customer_monthly_fee") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options") }}
                  </div>
                  <div>{{ $t("admin.plans.submission_monthly_fee") }}</div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("SMS_under_100") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("SMS_under_300") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("SMS_under_500") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("SMS_under_1000") }}
                  </div>
                </div>
                <div class="label-detail">
                  <div>
                    {{ $t("SMS_above_1000") }}
                  </div>
                </div>

                <div class="label-detail">
                  <div>
                    {{ $t("admin.plans.additional_options") }}
                  </div>
                  <div>{{ $t("admin.plans.custom_billing_monthly") }}</div>
                </div>
                <div class="label-detail"></div>
              </div>
              <div v-for="(item, index) in tableData" class="title-item">
                <div class="item-detail text-red">
                  {{
                    item.monthly_cost_annual
                      ? priceDisplay(item.monthly_cost_annual) + $t("yen")
                      : "0"
                  }}
                </div>
                <div class="item-detail text-red">
                  {{
                    item.monthly_cost_annual
                      ? priceDisplay(item.monthly_cost_annual * 12) + $t("yen")
                      : "0"
                  }}
                </div>
                <div class="item-detail text-red">
                  {{
                    item.monthly_cost
                      ? priceDisplay(item.monthly_cost) + $t("yen")
                      : "0"
                  }}
                </div>
                <div class="item-detail">
                  {{
                    item.monthly_cost
                      ? priceDisplay(item.monthly_cost * 12)
                      : "0"
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail">
                  <div>
                    {{
                      priceDisplay(
                        Math.abs(item.monthly_cost - item.monthly_cost_annual) *
                          12
                      )
                    }}{{ $t("yen") }}
                  </div>
                </div>
                <div class="item-detail">
                  <template v-if="item.priority === 1"><icon-minus /></template>
                  <template v-if="item.priority === 2"
                    ><icon-triangle /> </template
                  ><template v-if="item.priority === 3"
                    ><icon-circle-red-white
                  /></template>
                  <template v-if="item.priority === 4"
                    ><icon-circle-red
                  /></template>
                  <template v-if="item.priority === 5"
                    ><icon-circle-red-white
                      class="double-icon"
                    ></icon-circle-red-white
                    ><icon-circle-red
                  /></template>
                  <template v-if="item.priority === 6"
                    ><icon-circle-red class="double-icon" /><icon-circle-red
                  /></template>
                </div>
                <div class="item-detail">
                  {{
                    item.card_payment_service_fee
                      ? item.card_payment_service_fee +
                        "%" +
                        " ＋ " +
                        priceDisplay(item.card_payment_fee) +
                        $t("yen")
                      : "ー"
                  }}
                </div>
                <div class="item-detail">
                  {{
                    item.monthly_booking
                      ? priceDisplay(item.monthly_booking) + $t("subject_unit")
                      : $t("unlimited")
                  }}
                </div>
                <div v-if="typeStore === SALON" class="item-detail">
                  <div>
                    {{
                      item.number_staff
                        ? item.number_staff + $t("man")
                        : $t("maximum")
                    }}
                  </div>
                </div>
                <div class="item-detail">
                  {{ item.number_store_top_photo || 0 }}{{ $t("sheet") }}
                </div>
                <div class="item-detail">
                  {{
                    item.number_photo !== null
                      ? priceDisplay(item.number_photo) + $t("sheet")
                      : $t("unlimited-max", {
                          max: priceDisplay(MAX_NUMBER_PHOTO),
                        })
                  }}
                </div>
                <div class="item-detail">
                  {{ priceDisplay(item.number_customer)
                  }}{{ $t("last_name_kanji") }}
                </div>
                <div class="item-detail">
                  <template v-if="item.job_offer">
                    {{ $t("display") }}
                  </template>
                  <template v-else> {{ $t("no_displayed") }} </template>
                </div>
                <div class="item-detail">
                  <template v-if="item.advertisement">
                    {{ $t("display") }}
                  </template>
                  <template v-else>
                    {{ $t("no_displayed") }}
                  </template>
                </div>
                <div class="item-detail">{{ item.support_type }}</div>
                <div class="item-detail">
                  {{
                    item.initial_cost
                      ? priceDisplay(item.initial_cost) + $t("yen")
                      : $t("free")
                  }}
                </div>
                <div class="item-detail">
                  <template v-if="item.recommend_portal_site_priority === 1"
                    ><icon-false />
                  </template>
                  <template v-if="item.recommend_portal_site_priority === 2"
                    ><icon-false />
                  </template>
                  <template v-if="item.recommend_portal_site_priority === 3"
                    ><icon-circle-white
                  /></template>
                  <template v-if="item.recommend_portal_site_priority === 4"
                    ><icon-circle-white-black />
                  </template>
                  <template v-if="item.recommend_portal_site_priority === 5"
                    ><icon-circle-white
                      class="double-icon"
                    /><icon-circle-white-black />
                  </template>
                  <template v-if="item.recommend_portal_site_priority === 6"
                    ><icon-circle-white-black
                      class="double-icon" /><icon-circle-white-black
                  /></template>
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.range.range_1?.fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.range.range_2?.fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.range.range_3?.fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.range.range_4?.fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.range.range_5?.fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.store_booking)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(dataRanger[index]?.empty_booking)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.zoom_fee) }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.line_fee) }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.external_site_monthly_fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.initial_support_monthly_fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.customer_attraction_fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.submission_agency_monthly_fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.sms_monthly_fee?.below_100)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.sms_monthly_fee?.below_300)
                  }}{{ $t("yen")
                  }}<!-- TODO -->
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.sms_monthly_fee?.below_500)
                  }}{{ $t("yen")
                  }}<!-- TODO -->
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.sms_monthly_fee?.below_1000)
                  }}{{ $t("yen")
                  }}<!-- TODO -->
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.sms_monthly_fee?.unlimit)
                  }}{{ $t("yen")
                  }}<!-- TODO -->
                </div>
                <div class="item-detail text-red">
                  {{ priceDisplay(item?.custom_billing_monthly_fee)
                  }}{{ $t("yen") }}
                </div>
                <div class="item-detail item-button">
                  <template v-if="item.id > planId">
                    <button-light-blue
                      :name="$t('upgrade')"
                      @click="handleClick(item.id)"
                    ></button-light-blue>
                  </template>
                  <template v-else-if="item.id < planId">
                    <button-gray
                      disabled
                      class="button-gray"
                      :name="$t('upgrade')"
                      @click="handleClick(item.id)"
                    ></button-gray
                  ></template>
                  <template v-else>
                    <button-gray
                      class="button-in-use"
                      :name="$t('in_use')"
                      @click="handleClick(item.id)"
                    ></button-gray>
                  </template>
                </div>
              </div>
            </div>
            <UpgradePlan
              v-if="isShowModalConfirm"
              :plan-in-use="planId"
              :in-use="choosePlan === planId"
              :data-plan="tableData"
              :plan-name="$t(`${plan.plan_data?.name}`)"
              :choose-plan="choosePlan"
              :dialog-visible="isShowModalConfirm"
              :title="$t('title_delete')"
              :name-cancel="$t('button.cancel')"
              :name-confirm="$t('button.confirm')"
              :loading="isLoadingTable"
              @handle-close="handleClose"
              @handle-confirm="handleConfirm"
            />
          </div>
        </el-scrollbar>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ButtonSearch from "../../../shared/components/button/Search.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import { Plan } from "~/../../src/shared/types/plan";
import priceDisplay from "../../../shared/utils/price";
import InputDate from "../../../shared/components/input/Date.vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";

import IconMinus from "../../../shared/components/icon/Minus.vue";
import IconCircleRedWhite from "../../../shared/components/icon/CircleRedWhite.vue";
import IconCircleRed from "../../../shared/components/icon/CircleRed.vue";
import IconCircleWhite from "../../../shared/components/icon/CircleWhite.vue";
import IconCircleWhiteBlack from "../../../shared/components/icon/CircleWhiteBlack.vue";
import IconFalse from "../../../shared/components/icon/False.vue";
import IconTriangle from "../../../shared/components/icon/Triangle.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { MAX_NUMBER_PHOTO } from "~/../../src/shared/constants";
import UpgradePlan from "~/../../src/shared/components/modal/UpgradePlan.vue";

const isLoadingTable = ref(true);
const tableData = ref<Plan[]>();
const meStore = useMeStore();
const typeStore = meStore.getTypeStore;
const plan = meStore.getPlan;
const choosePlan = ref();
const dataRanger = ref([]);
const isShowModalConfirm = ref(false);
const planId = ref();
const extendType = ref();

const getDataPlans = async () => {
  try {
    isLoadingTable.value = true;
    const planResponse = (await PlanRequest.list<Plan[]>({})).data;
    tableData.value = planResponse.data.reverse();
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};
const getDataRanger = () => {
  tableData.value.forEach((item) => {
    switch (typeStore) {
      case RESTAURANT:
        dataRanger.value.push(item.booking_fee_setting.restaurant);
      case SALON:
        dataRanger.value.push(item.booking_fee_setting.salon);
    }
  });
  dataRanger.value = dataRanger.value.reverse();
};

const uppercaseFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

onMounted(async () => {
  planId.value = plan?.plan_data.id;
  extendType.value = plan?.extend_type;
  await getDataPlans();
  getDataRanger();
});

const handleClick = (plan_id: number) => {
  choosePlan.value = plan_id;
  isShowModalConfirm.value = true;
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = async (planUpgrade: number) => {
  isShowModalConfirm.value = false;
  planId.value = planUpgrade;
  await meStore.fetchUpdate();
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.container-plan-information {
  padding: 12px 12px 26px;

  .time {
    width: 725px;
    display: flex;
    gap: 80px;

    .time-item {
      display: flex;
      height: 40px;
      align-items: center;
      margin-bottom: 20px;

      :deep(.el-input) {
        height: 40px;
        width: 253px !important;
      }

      .label-input_date {
        width: 104px;
      }
    }
  }
  .table-plan {
    .header-table {
      min-width: 1344px;
      border-bottom: 1px solid $gray-200;
      display: flex;
      width: 100%;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;

      .header-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 190px;
        height: 100px;
        text-align: center;
        flex-basis: 14.28%;
        line-height: 30px;
        font-weight: 700;
        font-size: 16px;
        position: sticky;
        left: 0;

        &:not(.header-item:last-child) {
          border-right: 1px solid $gray-200;
        }

        &:first-child {
          padding: 46px;
          background-color: $gray-70;
          position: sticky;
          left: 0;
          z-index: 100;
        }

        &:nth-child(2) {
          background-color: $green-60;
        }

        &:nth-child(3) {
          background-color: $red-color-light;
        }

        &:nth-child(4) {
          background-color: $gray-500;
        }

        &:nth-child(5) {
          background-color: $yellow-color-light;
        }

        &:nth-child(6) {
          background-color: $green-30;
        }

        &:last-child {
          background-color: $green-color-10;
        }
      }
    }

    .detail-table {
      font-weight: 700;
      min-width: 1344px;
      display: flex;
      width: 100%;
      border-bottom: 1px solid $gray-200;
      position: relative;

      .label {
        text-align: center;
        flex-basis: 14.28%;
        position: sticky;
        left: 0;
        z-index: 1;
        background: $white-color;
        border-right: 1px solid $gray-200;

        .label-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 72px;
          min-width: 190px;
          padding: 3px;

          &:not(.label-detail:last-child) {
            border-bottom: 1px solid $gray-200;
          }
        }
      }

      .title-item {
        flex-basis: 14.28%;
        text-align: center;

        .icon-true-false {
          font-size: 24px;
        }

        &:not(.title-item:last-child) {
          border-right: 1px solid $gray-200;
        }

        .item-detail {
          line-height: 72px;
          height: 72px;

          &:not(.item-detail:last-child) {
            border-bottom: 1px solid $gray-200;
          }
        }

        .item-button {
          button {
            width: 180px;
            height: 40px;
            border-radius: 4px;
          }
        }
      }
    }

    .text-red {
      font-size: 16px;
      color: $red-100;
    }

    .double-icon {
      margin-right: 3px;
    }

    .button-submit:not(.button-gray, .button-in-use) {
      background: linear-gradient(180deg, #409eff 0%, #1075bf 100%);
    }

    .button-in-use {
      background: radial-gradient(
        circle at 18.7% 37.8%,
        rgb(250, 250, 250) 0%,
        rgb(225, 234, 238) 90%
      );
    }

    .el-button.is-disabled,
    .el-button.is-disabled:hover {
      background: $gray-100;
      color: $black-80;
    }
  }
}

:deep(.el-scrollbar.scroll-content) {
  height: calc(100% - 50px - 5px) !important;
}
</style>
