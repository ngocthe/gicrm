import { ref, watch } from "vue";
import { useReservation } from "../../store/useReservation";
import { Moment } from "moment";

export const getReservationsRestaurant = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationRestaurant(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationRestaurant(day);
    }
  );

  return { reservations };
};

export const getReservationsSalon = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationSalon(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationSalon(day);
    }
  );

  return { reservations };
};

export const getReservationRestaurantByDayAndSeat = (
  day: Moment,
  seatId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationRestaurantByDayAndSeat(day, seatId)
  );

  watch(
    () => seatId,
    () => {
      reservations.value =
        reservationStore.getReservationRestaurantByDayAndSeat(day, seatId);
    }
  );

  return { reservations };
};

export const getReservationSalonByDayAndStaff = (
  day: Moment,
  staffId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationByDayAndStaff(day, staffId)
  );

  watch(
    () => staffId,
    () => {
      reservations.value = reservationStore.getReservationByDayAndStaff(
        day,
        staffId
      );
    }
  );

  return { reservations };
};
