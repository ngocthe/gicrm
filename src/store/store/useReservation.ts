import { defineStore } from "pinia";
import moment, { Moment } from "moment";

import { DATE_FORMAT, TIME_FORMAT } from "../../shared/constants/index";
import { ViewMode, Appearance } from "../constants";
import {
  DayCalendar,
  ReservationRestaurant,
  ReservationSalon,
} from "../models/reservation";
import { getCurrentTimeBooking } from "~/../../src/shared/utils/date";
import TypeStore from "../../shared/constants/category";

type ReservationState = {
  appearance: Appearance;
  calendar: {
    /**
     * activeTime: string | format: YYYY-MM-DD
     */
    activeTime: string;
    /**
     * targetTime: string | format: HH:mm
     */
    targetTime: string;

    status: {
      booking: { day: string; value: number }[];
      canChangeActiveTime: boolean;
    };
    viewMode: ViewMode;
    daysDisplayOnCalendar: {
      monthly: DayCalendar[];
      weekly: DayCalendar[];
      daily: DayCalendar[];
    };
  };
  reservationRestaurant: ReservationRestaurant[];
  reservationSalon: ReservationSalon[];
};

export const useReservation = defineStore("reservation", {
  state: () =>
    ({
      appearance: Appearance.calendar,
      calendar: {
        activeTime: moment().format(DATE_FORMAT),
        targetTime: getCurrentTimeBooking(),
        status: {
          booking: [],
          canChangeActiveTime: true,
        },
        viewMode: ViewMode.monthly,
        daysDisplayOnCalendar: {
          monthly: [],
          weekly: [],
          daily: [],
        },
      },
      reservationRestaurant: [],
      reservationSalon: [],
    } as ReservationState),
  getters: {
    getActiveTime: (state: ReservationState) => state.calendar.activeTime,
    getTargetTime: (state: ReservationState) => state.calendar.targetTime,
    getStatusBooking: (state: ReservationState) =>
      state.calendar.status.booking,
    getCanChangeActiveTime: (state: ReservationState) =>
      state.calendar.status.canChangeActiveTime,
    getAppearance: (state: ReservationState) => state.appearance,
    getViewMode: (state: ReservationState) => state.calendar.viewMode,
    getDaysDisplayOnCalendar:
      (state: ReservationState) => (viewMode?: ViewMode) => {
        const viewModeCondition = viewMode || state.calendar.viewMode;
        if (viewModeCondition === ViewMode.monthly) {
          return state.calendar.daysDisplayOnCalendar.monthly;
        } else if (viewModeCondition === ViewMode.weekly) {
          return state.calendar.daysDisplayOnCalendar.weekly;
        } else if (viewModeCondition === ViewMode.daily) {
          return state.calendar.daysDisplayOnCalendar.daily;
        }
      },
    getReservationSalon: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationSalon.filter((item) =>
          moment(item.start_time).isSame(day, "D")
        );
      } else {
        return state.reservationSalon;
      }
    },
    getReservationRestaurant: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationRestaurant.filter((item) =>
          moment(item.start_time).isSame(day, "D")
        );
      } else {
        return state.reservationRestaurant;
      }
    },
    getReservationRestaurantByDayAndSeat:
      (state: ReservationState) => (day: Moment, seatId: number) => {
        return state.reservationRestaurant.filter(
          (item) =>
            moment(item.start_time).isSame(day, "D") && item.seat_id === seatId
        );
      },
    getReservationByDayAndStaff:
      (state: ReservationState) => (day: Moment, staffId: number) => {
        return state.reservationSalon.filter(
          (item) =>
            moment(item.start_time).isSame(day, "D") &&
            item.staff_id === staffId
        );
      },
    countTotalRestaurant: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationRestaurant.forEach((item) => {
        if (moment(item.start_time).isSame(day, "D")) {
          reservationCount++;
          peopleCount =
            peopleCount +
            item.reservation?.detail?.number_adult +
            item.reservation?.detail?.number_children;
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
    countTotalSalon: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationSalon.forEach((item) => {
        if (moment(item.start_time).isSame(day, "D")) {
          reservationCount++;
          peopleCount += Number(item.reservation?.detail?.number_people);
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
  },
  actions: {
    /**
     *
     * @param date date with type = "YYYY-MM-DD"
     */
    setActiveTime(date = moment().format(DATE_FORMAT)) {
      this.calendar.activeTime = date;
    },
    /**
     *
     * @param time time with type = "HH:mm"
     */
    setTargetTime(time = moment().format(TIME_FORMAT)) {
      this.calendar.targetTime = time;
    },
    setAppearance(value = Appearance.list): void {
      this.appearance = value;
    },
    setViewMode(viewMode = ViewMode.monthly): void {
      this.calendar.viewMode = viewMode;
    },
    setStatusBooking(data: { day: string; value: number }[]): void {
      this.calendar.status.booking = data;
    },
    setCanChangeActiveTime(value: boolean): void {
      this.calendar.status.canChangeActiveTime = value;
    },
    resetDaysDisplayOnCalendar(viewMode?: ViewMode): void {
      const viewModeCondition = viewMode || this.calendar.viewMode;
      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly = [];
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly = [];
      } else if (viewModeCondition === ViewMode.daily) {
        this.calendar.daysDisplayOnCalendar.daily = [];
      }
    },
    pushDaysDisplayOnCalendar(item: DayCalendar, viewMode?: ViewMode): void {
      const viewModeCondition = viewMode || this.calendar.viewMode;

      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly.push(item);
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly.push(item);
      } else if (viewModeCondition === ViewMode.daily) {
        this.calendar.daysDisplayOnCalendar.daily.push(item);
      }
    },
    unshiftDaysDisplayOnCalendar(item: DayCalendar, viewMode?: ViewMode): void {
      const viewModeCondition = viewMode || this.calendar.viewMode;

      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly.unshift(item);
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly.unshift(item);
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.daily.unshift(item);
      }
    },
    setReservationRestaurant(data: ReservationRestaurant[]) {
      this.reservationRestaurant = data;
    },
    setReservationSalon(data: ReservationSalon[]) {
      this.reservationSalon = data;
    },
    pushReservationRestaurant(value: ReservationRestaurant) {
      if (
        this.reservationRestaurant.length <= 0 ||
        !this.reservationRestaurant.some(
          (item: ReservationRestaurant) =>
            item.id === value.id &&
            item.start_time === value.start_time &&
            item.end_time === value.end_time
        )
      ) {
        this.reservationRestaurant.push(value);
      }
    },
    pushReservationSalon(value: ReservationSalon) {
      if (
        this.reservationSalon.length <= 0 ||
        !this.reservationSalon.some(
          (item: ReservationSalon) =>
            item.id === value.id &&
            item.start_time === value.start_time &&
            item.end_time === value.end_time
        )
      ) {
        this.reservationSalon.push(value);
      }
    },
    getDateRanger() {
      const formatDate = "YYYY-MM-DD HH:mm:ss";
      switch (this.calendar.viewMode) {
        case ViewMode.monthly:
          return [
            moment(this.calendar.activeTime)
              .startOf("month")
              .format(formatDate),
            moment(this.calendar.activeTime).endOf("month").format(formatDate),
          ];
        case ViewMode.weekly:
          return [
            moment(this.calendar.activeTime).startOf("week").format(formatDate),
            moment(this.calendar.activeTime).endOf("week").format(formatDate),
          ];
        case ViewMode.daily:
          return [
            moment(this.calendar.activeTime).startOf("day").format(formatDate),
            moment(this.calendar.activeTime).endOf("day").format(formatDate),
          ];
        default:
          return ["", ""];
      }
    },
  },
});
