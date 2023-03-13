import { DATA_DAY_WORKING } from "~/../../src/shared/constants/reservation";

export const DEFAULT_TIME = {
  START_TIME: "08:00",
  END_TIME: "23:00",
};

export const arrayOpenTime = [
  {
    day_of_week: DATA_DAY_WORKING.SUNDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.MONDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.TUESDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.WEDNESDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.THURSDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.FRIDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
  {
    day_of_week: DATA_DAY_WORKING.SATURDAY,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  },
];
