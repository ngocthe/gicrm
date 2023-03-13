<template>
  <div class="head-calendar">
    <div class="head-calendar__left">
      <el-button @click="() => setToday()">
        {{ t("today") }}
      </el-button>
    </div>
    <div class="head-calendar__center">
      <div class="wrap-date">
        <ClientOnly>
          <el-button
            :icon="ArrowLeftBold"
            class="btn-change prev"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="() => prevActiveDay()"
          >
          </el-button>

          <el-date-picker
            v-model="activeTime"
            :type="typeDatePicker"
            :editable="false"
            :clearable="false"
            :format="formatTime"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          />
          <el-button
            :icon="ArrowRightBold"
            class="btn-change next"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="() => nextActiveDay()"
          >
          </el-button>
        </ClientOnly>
      </div>
    </div>
    <div class="head-calendar__right">
      <div class="target-time">
        <ClientOnly>
          <el-time-select
            v-if="
              reservationStore.getAppearance === Appearance.calendar &&
              reservationStore.getViewMode === ViewMode.monthly
            "
            v-model="targetTime"
            start="00:00"
            step="00:15"
            end="23:45"
            :editable="false"
            :clearable="false"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          />
        </ClientOnly>
      </div>
      <div class="wrap-toggle">
        <el-button
          :class="[{ active: viewMode === ViewMode.monthly }]"
          :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          @click="changeViewMode(ViewMode.monthly)"
        >
          {{ t("monthly") }}
        </el-button>
        <div class="separator"></div>
        <el-button
          :class="[{ active: viewMode === ViewMode.weekly }]"
          :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          @click="changeViewMode(ViewMode.weekly)"
        >
          {{ t("weekly") }}
        </el-button>
        <div class="separator"></div>
        <el-button
          :class="[{ active: viewMode === ViewMode.daily }]"
          :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          @click="changeViewMode(ViewMode.daily)"
        >
          {{ t("daily") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IDatePickerType } from "element-plus/es/components/date-picker/src/date-picker.type";
import { onBeforeMount, onMounted, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";

import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";

import { useReservation } from "../../store/useReservation";
import { useMeStore } from "../../../shared/stores/me";

import { Appearance, ViewMode } from "../../constants";
import TypeStore from "../../../shared/constants/category";

import { DATE_FORMAT } from "../../../shared/constants/index";
import {
  fetchDataReservationRestaurantCalendar,
  fetchDataReservationSalonCalendar,
  fetchDataStatusBooking,
} from "../../composables/reservations/getCalendar";

interface Prop {
  isCallingApi?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  isCallingApi: false,
});

const { isCallingApi } = toRefs(props);

const { t } = useI18n();
const meStore = useMeStore();
const reservationStore = useReservation();

const activeTime = ref<string>(reservationStore.getActiveTime);
const targetTime = ref<string>(reservationStore.getTargetTime);

const typeDatePicker = ref<IDatePickerType | undefined>("month");
const viewMode = ref<ViewMode>(reservationStore.getViewMode);
const FORMAT_MONTH = "YYYY年MM月";
const FORMAT_DAY = "YYYY年MM月DD日";
const formatTime = ref<string>(FORMAT_MONTH);
const isLoading = ref<boolean>(true);

const setToday = (date = moment().format(DATE_FORMAT)) => {
  reservationStore.setActiveTime(date);
};

const prevActiveDay = () => {
  // COMPLETE: Handle when spam button
  if (isCallingApi.value || !reservationStore.getCanChangeActiveTime) {
    return;
  }
  let prev = "";
  if (viewMode.value === ViewMode.monthly) {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "month")
      .format(DATE_FORMAT);
  } else if (viewMode.value === ViewMode.weekly) {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "week")
      .format(DATE_FORMAT);
  } else {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "day")
      .format(DATE_FORMAT);
  }

  if (prev) {
    reservationStore.setActiveTime(prev);
  }
};

const nextActiveDay = () => {
  // COMPLETE: Handle when spam button
  if (isCallingApi.value || !reservationStore.getCanChangeActiveTime) {
    return;
  }

  let prev = "";
  if (viewMode.value === ViewMode.monthly) {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "month")
      .format(DATE_FORMAT);
  } else if (viewMode.value === ViewMode.weekly) {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "week")
      .format(DATE_FORMAT);
  } else {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "day")
      .format(DATE_FORMAT);
  }

  if (prev) {
    reservationStore.setActiveTime(prev);
  }
};

const changeViewMode = (viewMode: ViewMode) => {
  if (isCallingApi.value) return;
  reservationStore.setViewMode(viewMode);
};

watch(
  () => reservationStore.getActiveTime,
  async () => {
    activeTime.value = reservationStore.getActiveTime;
    await getData(false);
  }
);

watch(
  () => activeTime.value,
  () => {
    reservationStore.setActiveTime(
      moment(activeTime.value).format(DATE_FORMAT)
    );
  }
);

watch(
  () => reservationStore.getTargetTime,
  async () => {
    targetTime.value = reservationStore.getTargetTime;
    reservationStore.setCanChangeActiveTime(false);
    const resultStatusBooking = await fetchDataStatusBooking(targetTime.value);
    if (resultStatusBooking) {
      reservationStore.setStatusBooking(resultStatusBooking);
    }
    reservationStore.setCanChangeActiveTime(true);
  }
);

watch(
  () => targetTime.value,
  async () => {
    reservationStore.setTargetTime(targetTime.value);
  }
);

watch(
  () => reservationStore.getViewMode,
  () => {
    viewMode.value = reservationStore.getViewMode;

    if (viewMode.value === ViewMode.monthly) {
      typeDatePicker.value = "month";
      formatTime.value = FORMAT_MONTH;
    }
    if (viewMode.value === ViewMode.weekly) {
      typeDatePicker.value = "week";
      formatTime.value = FORMAT_DAY;
    } else if (viewMode.value === ViewMode.daily) {
      typeDatePicker.value = "date";
      formatTime.value = FORMAT_DAY;
    }
  },
  {
    immediate: true,
  }
);

const getData = async (forceFetch: boolean) => {
  const typeStoreId = meStore.getStoreType;

  switch (typeStoreId) {
    case TypeStore.SALON: {
      await fetchDataReservationSalonCalendar(forceFetch);
      break;
    }

    case TypeStore.RESTAURANT: {
      await fetchDataReservationRestaurantCalendar(forceFetch);
      break;
    }

    default:
      break;
  }

  const resultStatusBooking = await fetchDataStatusBooking(targetTime.value);
  if (resultStatusBooking) {
    reservationStore.setStatusBooking(resultStatusBooking);
  }
};

onBeforeMount(async () => {
  await getData(true);
});

onMounted(() => {
  isLoading.value = false;
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.head-calendar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .head-calendar__center {
    .wrap-date {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid $gray-200;

      .btn-change {
        border-top: none;
        border-bottom: none;
        border-radius: 0px;
        width: 32px;
        height: 32px;
        &.prev {
          border-left: none;
        }
        &.next {
          border-right: none;
        }
      }
      .el-date-editor {
        width: 144px;

        .el-input__wrapper {
          .el-input__inner {
            font-weight: 700;
          }
        }

        .el-input__wrapper {
          padding: 0px;
          box-shadow: none;
          .el-input__prefix {
            display: none;
          }
          .el-input__inner {
            cursor: pointer;
            text-align: center;
          }
        }
      }
    }
  }

  .head-calendar__right {
    position: relative;
    .target-time {
      position: absolute;
      top: 1px;
      left: calc(-128px - 16px);
      width: 128px;
    }
    .wrap-toggle {
      padding: 1px;
      background-color: $gray-80;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;

      .separator {
        width: 1px;
        height: 16px;
        background-color: $gray-100;
      }
      .el-button {
        margin: 0px;
        width: 80px;

        &.active {
          & + .div,
          ~ .div {
            display: none;
          }
        }

        &:not(.active) {
          background: $gray-80;
          border: none;
        }

        &:focus {
          background-color: $white-color;
          color: var(--el-button-text-color);
          background-color: var(--el-button-bg-color);
          border-color: var(--el-button-border-color);
        }
      }
    }
  }
}
</style>
