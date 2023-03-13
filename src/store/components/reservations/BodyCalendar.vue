<template>
  <div class="body-calendar">
    <MonthlyCalendarSalon
      v-if="
        reservationStore.calendar.viewMode === ViewMode.monthly &&
        storeTypeId === TypeStore.SALON
      "
      class="body-calendar__view-mode"
    />
    <MonthlyCalendarRestaurant
      v-else-if="
        reservationStore.calendar.viewMode === ViewMode.monthly &&
        storeTypeId === TypeStore.RESTAURANT
      "
      class="body-calendar__view-mode"
    />
    <WeeklyCalendarSalon
      v-else-if="
        reservationStore.calendar.viewMode === ViewMode.weekly &&
        storeTypeId === TypeStore.SALON
      "
      class="body-calendar__view-mode"
    />
    <WeeklyCalendarRestaurant
      v-else-if="
        reservationStore.calendar.viewMode === ViewMode.weekly &&
        storeTypeId === TypeStore.RESTAURANT
      "
      class="body-calendar__view-mode"
    />
    <DailyCalendarSalon
      v-else-if="
        reservationStore.calendar.viewMode === ViewMode.daily &&
        storeTypeId === TypeStore.SALON
      "
      class="body-calendar__view-mode"
    />
    <DailyCalendarRestaurant
      v-else-if="
        reservationStore.calendar.viewMode === ViewMode.daily &&
        storeTypeId === TypeStore.RESTAURANT
      "
      class="body-calendar__view-mode"
    />
  </div>
</template>

<script lang="ts" setup>
import MonthlyCalendarSalon from "./Calendar/Monthly/MonthlyCalendarSalon.vue";
import MonthlyCalendarRestaurant from "./Calendar/Monthly/MonthlyCalendarRestaurant.vue";

import WeeklyCalendarSalon from "./Calendar/Weekly/WeeklyCalendarSalon.vue";
import WeeklyCalendarRestaurant from "./Calendar/Weekly/WeeklyCalendarRestaurant.vue";

import DailyCalendarSalon from "./Calendar/Daily/DailyCalendarSalon.vue";
import DailyCalendarRestaurant from "./Calendar/Daily/DailyCalendarRestaurant.vue";

import { ViewMode } from "../../constants";
import TypeStore from "../../../shared/constants/category";

import { useReservation } from "../../store/useReservation";
import { useMeStore } from "../../../shared/stores/me";

const reservationStore = useReservation();
const meStore = useMeStore();

const storeTypeId = meStore.getStoreType;
</script>

<style lang="scss">
.body-calendar {
  height: calc(100% - 34px - 48px);

  &__view-mode {
    height: 100%;
  }
}
</style>
