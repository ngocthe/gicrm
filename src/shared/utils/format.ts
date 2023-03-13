import moment from "moment";
import _ from "lodash";
import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;
export const formatDate = (val: string, format = "YYYY年MM月DD日") => {
  if (!val) return "";
  return moment(val).format(format);
};

export const formatTime = (value: string, format = "HH:mm") => {
  if (!value) {
    return "";
  }
  const date = moment().format("YYYY-MM-DD");
  if (moment(date + " " + value).format(format) === "23:59") {
    return "24:00";
  }
  return moment(date + " " + value).format(format);
};

export const getTimeHours = (time: number) => {
  if (!time) {
    return `0${t("minute")}`;
  }

  const hour = Math.floor(time / 60) ? Math.floor(time / 60) : 0;
  const minute = time - hour * 60 ? time - hour * 60 : 0;

  if (hour === 0) {
    return `${minute}${t("minute")}`;
  }

  if (minute === 0) {
    return `${hour}${t("hour")}`;
  }
  return `${hour}${t("hour")}${minute}${t("minute")}`;
};

export const buildQuery = (obj: any, excepts = []) => {
  const str = [];
  obj = _.pickBy(obj, (value, key) => {
    return !(value === undefined || value === null || value === "");
  });
  for (const p in obj) {
    if (
      obj[p] &&
      Object.prototype.hasOwnProperty.call(obj, p) &&
      !excepts.includes(p)
    ) {
      if (_.isArray(obj[p])) {
        const array = obj[p];
        for (const key in array) {
          str.push(
            encodeURIComponent(p) + "=" + encodeURIComponent(array[key])
          );
        }
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  }
  return str.join("&");
};

export const getQuery = (obj: any) => {
  obj = _.pickBy(obj, (value, key) => {
    return !(value === undefined || value === null || value === "");
  });

  return obj;
};

export const formatPriceFromMath = (price: number, number: number) => {
  if (!price) return 0;
  return Math.round(price * Math.pow(10, number)) / Math.pow(10, number);
};

export const roundPrice = (price: number) => {
  return Math.round(price);
};

export const customIndex = (
  index: number,
  currentPage: number,
  numberRecordPerPage: number
) => {
  return (currentPage - 1) * numberRecordPerPage + 1 + index;
};
