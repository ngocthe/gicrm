import moment from "moment";
import { i18n } from "../../shared/plugins/i18n";
import { TYPE_WEEK, TYPE_MONTH } from "~/../../src/shared/constants";
import "moment/dist/locale/ja";

moment.locale("ja");

const { t } = i18n.global;
export const getDayByDate = (date: string) => {
  if (!date) {
    return "";
  }
  const day = Number(moment(date).format("e"));
  if (!day) {
    return t("sunday");
  }
  if (day === 1) {
    return t("monday");
  }
  if (day === 2) {
    return t("tuesday");
  }
  if (day === 3) {
    return t("wednesday");
  }
  if (day === 4) {
    return t("thursday");
  }
  if (day === 5) {
    return t("friday");
  }
  return t("saturday");
};

export const getTimeArray = (
  startTime: string,
  endTime: string,
  step: number,
  unit: "seconds" | "minutes",
  format = "HH:mm:ss",
  valueFormat = "HH:mm"
) => {
  const start = moment(startTime, format);
  const end = moment(endTime, format);
  let date = start;
  const timeRanger = [];

  if (end.format("kk:mm") === "24:00") {
    timeRanger.push("24:00");
    date = start.add(step, unit);
  }

  while (date.isSameOrBefore(end)) {
    timeRanger.push(date.format(valueFormat));
    date = start.add(step, unit);
  }
  return timeRanger.sort();
};

export const getHour = () => {
  return moment()
    .add(moment().minute() > 15 && 1, "hours")
    .minutes(moment().minute() <= 15 ? 15 : 0)
    .format("HH:mm");
};

export const getCurrentTimeBooking = () => {
  const start = moment();
  const remainder = 15 - (start.minute() % 15);
  return moment(start).add(remainder, "minutes").format("HH:mm");
};

export const getEndDate = (mode: string, end_date: string) => {
  if (mode === TYPE_WEEK && end_date) {
    return moment(end_date).endOf("week").format("YYYY-MM-DD");
  }
  if (mode === TYPE_MONTH && end_date) {
    return moment(end_date).endOf("month").format("YYYY-MM-DD");
  }
  return end_date;
};

export const getStartDate = (
  mode: string | null,
  start_date: string | null
) => {
  if (mode === TYPE_MONTH && start_date) {
    return moment(start_date).startOf("month").format("YYYY-MM-DD");
  }
  return start_date;
};

export const getShowStartDateOfWeek = (week: string | number, date: string) => {
  if (!date || !week) {
    return "";
  }
  const year = moment(date).format("YYYY");
  const firstDayOfYear = new Date(`${year}-01-01`);

  //If the first day of the week is not Sunday ==> week = week + 1
  if (firstDayOfYear.getDay() !== 0) {
    return moment(date)
      .day("sunday")
      .year(Number(year))
      .week(Number(+week + 1))
      .format("(MM/DD～)");
  } else {
    return moment(date)
      .day("sunday")
      .year(Number(year))
      .week(Number(week))
      .format("(MM/DD～)");
  }
};

export const getTimeByForm = (form: any) => {
  let stay_time = 0;
  if (form.hour) {
    stay_time += form.hour * 60;
  }
  if (form.minute) {
    stay_time += form.minute;
  }
  return stay_time;
};

export const getHourTime = (value: number) => {
  let minute = null;
  let hour = null;
  if (!value) {
    return { hour, minute };
  }
  hour = Math.floor(value / 60) ? Math.floor(value / 60) : null;
  minute = value - Number(hour) * 60 ? value - Number(hour) * 60 : null;
  return { hour, minute };
};

export const getTime = (time: number) => {
  if (!time) {
    return `0h`;
  }
  let minute = null;
  let hour = null;
  if (!time) {
    return { hour, minute };
  }
  hour = Math.floor(time / 60) ? Math.floor(time / 60) : 0;
  minute = time - hour * 60 ? time - hour * 60 : 0;
  return `${hour}h${minute}m`;
};

export const getHourAllDay = () => {
  const timeRanger = [];
  for (let i = 0; i <= 24; i++) {
    timeRanger.push(i);
  }
  return timeRanger;
};

export const getMinuteAllDay = [0, 15, 30, 45];
export const commonDisabledDateStart = (time: Date, dueDate: string) => {
  return time.getTime() > Date.parse(dueDate) || time.getTime() > Date.now();
};

export const commonDisabledDateEnd = (time: Date, startDate: string) => {
  return (
    time.getTime() >= Date.now() ||
    (startDate &&
      moment(time).isSameOrBefore(moment(startDate).subtract(1, "day")))
  );
};

export const commonDisabledDateStartMonth = (time: Date, dueDate: string) => {
  return time.getTime() >= Date.parse(dueDate) || time.getTime() >= Date.now();
};

export const commonDisabledDateEndMonth = (time: Date, startDate: string) => {
  return (
    time.getTime() >= Date.now() ||
    (startDate && moment(time).isSameOrBefore(moment(startDate)))
  );
};

export const getNthDayOfYear = (year: number, n: number) => {
  return new Date(year, 0, n);
};

export const format24HoursTo23Hours59Min = (
  arrayTime: any,
  startTime: string,
  endTime: string
) => {
  return arrayTime.map((item: any) => {
    if (item[startTime] === "24:00") {
      item[startTime] = "23:59";
    }
    if (item[endTime] === "24:00") {
      item[endTime] = "23:59";
    }
    return item;
  });
};

export const format23Hours59MinHoursTo24Hours = (
  arrayTime: any,
  endTime: string
) => {
  return arrayTime.map((item: any) => {
    item[endTime] = moment(item[endTime], "HHmmss").format("HH:mm");
    if (item[endTime] === "23:59") {
      item[endTime] = "24:00";
    }
    return item;
  });
};

export const change23Hours59MinHoursTo24Hours = (time: string) => {
  if (time === "23:59") {
    return "24:00";
  }
  return time;
};
