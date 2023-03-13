<template>
  <div v-loading="isLoading" class="daily-calendar">
    <el-scrollbar>
      <div class="hours-in-day">
        <div class="hour hour__title">
          {{ $t("time") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['hour', 'hour__value']"
        >
          {{ hour }}
        </div>
      </div>
      <div class="number_of_reversion">
        <div class="number number__title">
          {{ $t("number_of_reservations") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div class="part part__first" :hour="getMomentPart(hour, part)">
              <span>
                {{
                  reservationInDay
                    ? reservationInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- START Number of available reservation on top -->
      <div class="number_of_available_reservation">
        <div class="number number__title">
          {{ t("number_of_available_reservation") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div
              :class="`part part__${part}`"
              :hour="getMomentPart(hour, part)"
            >
              <span>
                {{
                  availableSeatInDay
                    ? availableSeatInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
            </div>
          </template>
        </div>
      </div>
      <!-- END Number of available reservation on top -->

      <!-- START Show seat in left sidebar -->
      <div
        v-for="(seat, index) in seatData"
        :key="index"
        class="list-seats"
        :seat-id="seat.id"
      >
        <div class="seat seat__title">
          <div class="seat__name">
            {{ seat.name }}
          </div>
          <div class="seat__count-reservation">
            {{
              `
              ${$t("reserve_2")}:
              ${
                arrCountReservationRestaurant
                  .filter(
                    (item) =>
                      item.activeTime === reservationStore.getActiveTime &&
                      item.seatId === seat.id
                  )
                  .at(0)?.count || 0
              }
              ${$t("group")}
                `
            }}
          </div>
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['seat', 'seat__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div :class="`part part__${part}`"></div>
          </template>
        </div>
        <ReservationInSeat
          :seat-id="seat.id"
          @count-reservation="handleCountReservationRestaurant"
        />
      </div>
      <!-- END Show seat on left sidebar -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import moment from "moment";
import "moment/dist/locale/ja";
import { watch, onBeforeMount, ref } from "vue";

import { calculatorHoursInDay } from "../../../../composables/reservations/getCalendar";
import {
  getReservationInDay,
  getSeatOfStore,
  getAvailableSeatInDay,
} from "../../../../composables/reservations/getStore";
import {
  AvailableSeatInDay,
  ReservationInDay,
  Seat,
  CountReservationRestaurant,
} from "../../../../models";

import ReservationInSeat from "../../Reservation/Daily/ReservationInSeat.vue";
import { useReservation } from "../../../../store/useReservation";
import { useMeStore } from "../../../../../shared/stores/me";

import { getMomentPart } from "./mixin";

moment.locale("ja");

const reservationStore = useReservation();
const meStore = useMeStore();
const { t } = useI18n();

const { hoursInDay } = calculatorHoursInDay();

const reservationInDay = ref<ReservationInDay[]>();

const isLoading = ref<boolean>(false);

const seatData = ref<Seat[]>();
const availableSeatInDay = ref<AvailableSeatInDay[]>();

const storeId = meStore.getStoreId;

const arrCountReservationRestaurant = ref<CountReservationRestaurant[]>([]);

const handleCountReservationRestaurant = (
  count: number,
  activeTime: string,
  seatId: number
) => {
  arrCountReservationRestaurant.value.push({
    count,
    activeTime,
    seatId,
  });
};

watch(
  () => reservationStore.getActiveTime,
  async () => {
    await getData();
  }
);

const getData = async () => {
  isLoading.value = true;
  if (storeId) {
    const reservationData = await getReservationInDay(
      storeId,
      reservationStore.getActiveTime
    );
    if (reservationData) {
      reservationInDay.value = reservationData.reservations;
    }

    const seatOfStoreData = await getSeatOfStore();
    if (seatOfStoreData) {
      seatData.value = seatOfStoreData.seat;
    }

    const availableSeatData = await getAvailableSeatInDay(
      storeId,
      reservationStore.getActiveTime
    );
    if (availableSeatData) {
      availableSeatInDay.value = availableSeatData.availableSeat;
    }
  }
  isLoading.value = false;
};

onBeforeMount(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
@use "./style.scss";
@use "../../../../assets/scss/variables.scss";

.daily-calendar {
  width: 100%;

  .el-scrollbar {
    :deep() {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          position: relative;

          .list-seats {
            $minHeightSeat: 152px;
            background-color: white;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            min-height: $minHeightSeat;
            position: relative;

            .seat {
              background-color: white;
              flex-grow: 1;
              flex-shrink: 1;

              height: 100%;

              &__title {
                min-height: $minHeightSeat;
                min-width: style.$widthFirstColumn;
                padding: style.$paddingFirstColumn;
                border: 1px solid variables.$border-color;
                font-size: 14px;
                background-color: variables.$gray-500;
                z-index: 2;

                .seat__name {
                  font-weight: 700;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-bottom: 10px;
                }
              }

              &__value {
                display: flex;
                min-height: $minHeightSeat;
                min-width: calc(style.$minWidthMinuteSpace * 4);
                text-align: center;

                .part {
                  border: 1px solid variables.$border-color;
                  min-width: 46px;
                  min-height: $minHeightSeat;
                  width: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }

              &:first-child {
                position: sticky;
                left: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
