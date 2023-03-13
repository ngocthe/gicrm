import { ref, watch } from "vue";
import { useReservation } from "../../store/useReservation";
import { TypeTime, ViewMode } from "../../constants";
import moment, { Moment } from "moment";
import {
  DayCalendar,
  ReservationRestaurant,
  ReservationSalon,
} from "../../models/reservation";
import { DATE_FORMAT } from "../../../shared/constants";
import ReservationCalendarRequest from "../../../shared/requests/ReservationCalendarRequest";
import StoreRequest from "../../../shared/requests/StoreRequest";
import { useMeStore } from "../../../shared/stores/me";

/**
 * Build calendar monthly
 */
export const useBuildCalendarMonthly = () => {
  const reservationStore = useReservation();
  reservationStore.resetDaysDisplayOnCalendar(ViewMode.monthly);
  const calendarType = "month";

  const firstDayCurrentMonth = moment(reservationStore.getActiveTime).startOf(
    calendarType
  );
  const lastDayCurrentMonth = moment(reservationStore.getActiveTime).endOf(
    calendarType
  );

  for (
    let i = firstDayCurrentMonth.clone();
    i.isBefore(lastDayCurrentMonth.clone());
    i.add(1, "days")
  ) {
    const today = moment(moment().format(DATE_FORMAT));
    const pointer = moment(moment(i).format(DATE_FORMAT));
    const diff = today.diff(pointer);

    const day: DayCalendar = {
      type: TypeTime.currentMonth,
      time: i.toISOString(),
      isLessToday: diff > 0,
      isToday: diff === 0,
    };

    reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.monthly);
  }

  const orderStartDayOnCalendar = moment(reservationStore.getActiveTime)
    .startOf("month")
    .day();
  // Add day of preview month from sunday to previous first day of current month
  for (let i = 1; i <= orderStartDayOnCalendar; i++) {
    reservationStore.unshiftDaysDisplayOnCalendar({
      type: TypeTime.previousMonth,
      time: firstDayCurrentMonth.clone().subtract(i, "days").toISOString(),
      isLessToday:
        moment(
          firstDayCurrentMonth.clone().subtract(i, "days").format(DATE_FORMAT)
        ).diff(moment().format(DATE_FORMAT)) < 0,
      isToday: false,
    } as DayCalendar);
  }

  // Add day of next month from next last day of current month to saturday
  const orderEndDayOnCalendar = moment(reservationStore.getActiveTime)
    .endOf("month")
    .day();
  const daysNeedAdd = 6 - orderEndDayOnCalendar;
  if (daysNeedAdd) {
    for (let i = 1; i <= daysNeedAdd; i++) {
      const day: DayCalendar = {
        type: TypeTime.nextMonth,
        time: lastDayCurrentMonth.clone().add(i, "days").toISOString(),
        isLessToday:
          moment(
            lastDayCurrentMonth.clone().add(i, "days").format(DATE_FORMAT)
          ).diff(moment().format(DATE_FORMAT)) < 0,
        isToday: false,
      };

      reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.monthly);
    }
  }
};

/**
 * Get calendar monthly
 *
 * @returns
 */
export const useGetCalendarMonthly = () => {
  const reservationStore = useReservation();
  useBuildCalendarMonthly();

  watch(
    () => reservationStore.getActiveTime,
    () => {
      useBuildCalendarMonthly();
    }
  );

  const daysDisplayOnCalendarMonthly = ref(
    reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly)
  );

  watch(
    () => reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly),
    () => {
      daysDisplayOnCalendarMonthly.value =
        reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly);
    }
  );

  return { daysDisplayOnCalendarMonthly };
};

/**
 * Build calendar weekly
 */
export const useBuildCalendarWeekly = () => {
  const reservationStore = useReservation();
  reservationStore.resetDaysDisplayOnCalendar(ViewMode.weekly);

  const calendarType = "week";

  const firstDayCurrentWeek = moment(reservationStore.getActiveTime).startOf(
    calendarType
  );
  const lastDayCurrentWeek = moment(reservationStore.getActiveTime).endOf(
    calendarType
  );

  for (
    let i = firstDayCurrentWeek.clone();
    i.isBefore(lastDayCurrentWeek.clone());
    i.add(1, "days")
  ) {
    const today = moment(moment().format(DATE_FORMAT));
    const pointer = moment(moment(i).format(DATE_FORMAT));
    const diff = today.diff(pointer);

    const day: DayCalendar = {
      type: TypeTime.currentWeek,
      time: i.toISOString(),
      isLessToday: diff > 0,
      isToday: diff === 0,
    };
    reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.weekly);
  }
};

/**
 * Get calendar weekly
 *
 * @returns
 */
export const useGetCalendarWeekly = () => {
  const reservationStore = useReservation();
  useBuildCalendarWeekly();

  watch(
    () => reservationStore.getActiveTime,
    () => {
      useBuildCalendarWeekly();
    }
  );

  const daysDisplayOnCalendarWeekly = ref(
    reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly)
  );
  watch(
    () => reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly),
    () =>
      (daysDisplayOnCalendarWeekly.value =
        reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly))
  );

  return { daysDisplayOnCalendarWeekly };
};

/**
 * Calculator hours in day
 *
 * @returns
 */
export const calculatorHoursInDay = () => {
  const formatHours = "HH:mm";
  const hoursInDay = ref<string[]>([]);

  for (
    let i = moment().startOf("day");
    i.isSameOrBefore(moment().endOf("day"));
    i.add(1, "hour")
  ) {
    hoursInDay.value.push(i.format(formatHours));
  }

  return { hoursInDay };
};

/**
 * Fetch data reservation restaurant calendar
 *
 * @param forceFetch
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationRestaurantCalendar = async (
  forceFetch = false,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();

  reservationStore.setCanChangeActiveTime(false);

  const formatDateQuery = "YYYY-MM-DD";

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() ||
        moment().subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() ||
        moment().add(1, "month").endOf("month"),
  };

  const result =
    await ReservationCalendarRequest.fetchRestaurant<ReservationRestaurant>(
      query.fromDate.format(formatDateQuery),
      query.toDate.format(formatDateQuery),
      getAll
    );

  if (result && result.data && result.data.length > 0) {
    if (forceFetch) {
      reservationStore.setReservationRestaurant([]);
    }
    result.data.forEach((item) => {
      if (moment(item.end_time).isAfter(moment(item.start_time), "D")) {
        // COMPLETE: Check if start time to end time of item in 2 day, we must break it to 2 reservation
        const temp = {
          ...item,
        };
        while (moment(temp.end_time).isAfter(moment(temp.start_time), "D")) {
          reservationStore.pushReservationRestaurant({
            ...temp,
            end_time: moment(temp.start_time)
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
          });
          temp.start_time = moment(temp.start_time)
            .add(1, "day")
            .startOf("D")
            .format("YYYY-MM-DD");
        }

        // COMPLETE: Add last segment reservation
        reservationStore.pushReservationRestaurant({
          ...temp,
        });
      } else if (moment(item.end_time).isSame(moment(item.start_time), "D")) {
        reservationStore.pushReservationRestaurant(item);
      }
    });
  }

  reservationStore.setCanChangeActiveTime(true);
};

/**
 * Fetch data reservation salon calendar
 *
 * @param forceFetch
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationSalonCalendar = async (
  forceFetch = false,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();

  reservationStore.setCanChangeActiveTime(false);

  const formatDateQuery = "YYYY-MM-DD";

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() ||
        moment().subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() ||
        moment().add(1, "month").endOf("month"),
  };

  const result = await ReservationCalendarRequest.fetchSalon<ReservationSalon>(
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    getAll
  );

  if (result && result.data && result.data.length > 0) {
    if (forceFetch) {
      reservationStore.setReservationSalon([]);
    }
    result.data.forEach((item) => {
      if (moment(item.end_time).isAfter(moment(item.start_time), "D")) {
        // COMPLETE: Check if start time to end time of item in 2 day, we must break it to 2 reservation
        const temp = {
          ...item,
        };
        while (moment(temp.end_time).isAfter(moment(temp.start_time), "D")) {
          reservationStore.pushReservationSalon({
            ...temp,
            end_time: moment(temp.start_time)
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
          });
          temp.start_time = moment(temp.start_time)
            .add(1, "day")
            .startOf("D")
            .format("YYYY-MM-DD");
        }

        // COMPLETE: Add last segment reservation
        reservationStore.pushReservationSalon({
          ...temp,
        });
      } else if (moment(item.end_time).isSame(moment(item.start_time), "D")) {
        reservationStore.pushReservationSalon(item);
      }
    });
  }

  reservationStore.setCanChangeActiveTime(true);
};

/**
 * Fetch data status booking
 *
 * @param timeTarget
 * @param storeId
 * @param fromDate
 * @param toDate
 * @returns
 */
export const fetchDataStatusBooking = async (
  timeTarget: string,
  storeId?: number,
  fromDate?: string,
  toDate?: string
) => {
  const formatDateQuery = "YYYY-MM-DD";
  const meStore = useMeStore();

  if (!meStore.getStoreId) throw new Error("Can't get store ID from pinia");

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() || moment(),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() || moment(),
  };

  const result = await StoreRequest.getStatusBooking<{
    data: { day: string; value: number }[];
  }>(
    storeId ?? meStore.getStoreId,
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    timeTarget
  );

  if (
    result &&
    result.data &&
    result.data.data &&
    result.data.data.length > 0
  ) {
    return result.data.data;
  }
};

/**
 * Get time start day display on calendar
 *
 * @returns
 */
export const getTimeStartDaysDisplayOnCalendar = (): Moment | undefined => {
  const reservationStore = useReservation();
  const dayCalendar = reservationStore.getDaysDisplayOnCalendar();

  if (dayCalendar && dayCalendar.length > 0) {
    const firstDate = dayCalendar[0].time;

    return moment().set({
      year: moment(firstDate).year(),
      month: moment(firstDate).month(),
      date: moment(firstDate).date(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
};

/**
 * Get time end day display on calendar
 *
 * @returns
 */
export const getTimeEndDaysDisplayOnCalendar = (): Moment | undefined => {
  const reservationStore = useReservation();
  const dayCalendar = reservationStore.getDaysDisplayOnCalendar();

  if (dayCalendar && dayCalendar.length > 0) {
    const lastDate = dayCalendar[dayCalendar.length - 1].time;
    return moment().set({
      year: moment(lastDate).year(),
      month: moment(lastDate).month(),
      date: moment(lastDate).date(),
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });
  }
};
