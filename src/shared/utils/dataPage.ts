import {
  DATA_LABEL_MONTH,
  DATA_LABEL_WEEK,
  STATUS_PLACE,
} from "~/../../src/shared/constants";
import moment from "moment/moment";

const FORMAT = "YYYY-MM-DD";
const TIME_OF_1_DAY = 24 * 60 * 60 * 1000;

export const getPageDelete = (page: number, data = []) => {
  if (page === 1) {
    return 1;
  }
  const count = data.length - 1;
  if (count === 0) {
    page = page - 1;
  }
  return page;
};

export const getDataMap = async (
  data = [],
  start_date: string,
  end_date: string
) => {
  const dataMap = [];
  const dataTable = [];
  data.forEach((item) => {
    const indexMap = dataMap.findIndex((map) => map.year === item.label);
    if (indexMap === -1) {
      dataTable.push({
        average: item.average,
        year: item.label,
        data: item.data,
      });

      dataMap.push({
        average: item.average,
        year: item.label,
        data: getDataYear(item.data, start_date, end_date),
      });
    }
  });
  return { dataMap, dataTable };
};

const getDataYear = (data = [], start_date: string, end_date: string) => {
  const dataYear = [];
  let dataAll = DATA_LABEL_MONTH;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment(end_date).format("MM"))
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment().format("MM"))
      );
    });
  }
  dataAll.filter((item) => {
    const index = data.findIndex((obj) => obj.key === item.id);
    if (index !== -1) {
      dataYear.push(data[index].value);
    } else {
      dataYear.push(0);
    }
  });
  return dataYear;
};

export const getDataTitleMonth = async (
  start_date: string,
  end_date: string
) => {
  const dataTitle = [];
  let dataAll = DATA_LABEL_MONTH;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment(end_date).format("MM"))
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment().format("MM"))
      );
    });
  }
  dataAll.filter((item) => {
    const index = dataTitle.findIndex((title) => title === item.name);
    if (index === -1) {
      dataTitle.push(item.name);
    }
  });
  return dataTitle;
};

export const getDataTableMonth = (start_date: string, end_date: string) => {
  let dataAll = DATA_LABEL_MONTH;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment(end_date).format("MM"))
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataAll = DATA_LABEL_MONTH.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("MM")) &&
        item.id <= Number(moment().format("MM"))
      );
    });
  }

  return dataAll;
};

export const getDataMapWeek = async (
  data = [],
  start_date = null,
  end_date = null
) => {
  const dataMap = [];
  const dataTable = [];
  data.forEach((item) => {
    const indexMap = dataMap.findIndex((map) => map.year === item.label);
    if (indexMap === -1) {
      dataTable.push({
        average: item.average,
        year: item.label,
        data: item.data,
      });

      dataMap.push({
        average: item.average,
        year: item.label,
        data: getDataWeek(item.data, start_date, end_date),
      });
    }
  });
  return { dataMap, dataTable };
};

const getDataWeek = (data = [], start_date = null, end_date = null) => {
  const dataWeek = [];
  let dataAll = DATA_LABEL_WEEK;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataAll = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= getCurrentWeekOfDay(start_date) &&
        item.id <= getCurrentWeekOfDay(end_date)
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataAll = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= getCurrentWeekOfDay(start_date) &&
        item.id <= getCurrentWeekOfDay(end_date)
      );
    });
  }

  dataAll.filter((item) => {
    const index = data.findIndex((obj) => obj.key === item.id);
    if (index !== -1) {
      dataWeek.push(data[index].value);
    } else {
      dataWeek.push(0);
    }
  });
  return dataWeek;
};

export const getDataMapDay = async (data = []) => {
  let dataMap = [];
  const dataTable = [];
  data.forEach((item) => {
    const indexMap = dataMap.findIndex((map) => map.year === item.label);
    if (indexMap === -1) {
      dataMap = [...dataMap, ...item.data];
    }

    if (dataTable.length === 0) {
      dataTable.push({
        average: item.average,
        data: item.data,
      });
    } else {
      dataTable[0].average += item.average;
      dataTable[0].data = [...dataTable[0].data, ...item.data];
    }
  });
  return { dataMap, dataTable };
};

export const getDataMapDayAdmin = async (
  data = [],
  from: string,
  end: string
) => {
  let start_time = null;
  let end_time = null;
  if (!from && !end) {
    end_time = moment().format("YYYY-MM-DD");
    start_time = moment(end_time).subtract(2, "month").format("YYYY-MM-DD");
  } else if (from && !end) {
    start_time = moment(from).format("YYYY-MM-DD");
    if (moment(start_time).add(2, "month") > moment()) {
      end_time = moment().format("YYYY-MM-DD");
    } else {
      end_time = moment(start_time).add(2, "month").format("YYYY-MM-DD");
    }
  } else if (!from && end) {
    end_time = moment(end).format("YYYY-MM-DD");
    start_time = moment(end_time).subtract(2, "month").format("YYYY-MM-DD");
  } else {
    end_time = moment(end).format("YYYY-MM-DD");
    start_time = moment(from).format("YYYY-MM-DD");
  }
  const dataDay = getArrayDate(start_time, end_time);
  const dataMap = [];
  const dataTable = [];
  const dataResponse = [];
  data.forEach((item) => {
    if (dataResponse.length === 0) {
      dataResponse.push({
        average: item.average,
        data: item.data,
      });
    } else {
      dataResponse[0].average += item.average;
      dataResponse[0].data = [...dataResponse[0].data, ...item.data];
    }
  });

  dataResponse.forEach((response) => {
    dataTable.push({
      average: response.average,
      data: response.data,
    });
    dataMap.push({
      average: response.average,
      year: "test",
      data: getDataDay(response.data, dataDay),
    });
  });
  return { dataMap, dataTable, dataDay };
};

const getArrayDate = (start: string, end: string) => {
  const allDates = [];
  let i = 0;
  const FORMAT = "YYYY-MM-DD";
  while (i <= moment(end).diff(start, "days")) {
    const date = moment(start).add(i, "days").format(FORMAT);
    allDates.push(date);
    i++;
  }
  allDates.sort((a, b) => {
    return moment(a).diff(moment(b), "days");
  });
  return allDates;
};

const getDataDay = (data = [], arrayDay = []) => {
  const dataDay = [];
  arrayDay.filter((item) => {
    const index = data.findIndex((obj) => obj.key === item);
    if (index !== -1) {
      dataDay.push(data[index].value);
    } else {
      dataDay.push(0);
    }
  });
  return dataDay;
};

export const getCurrentWeekOfDay = (date: string) => {
  const currentDate = new Date(date);
  /* get start date of week include currentDate*/
  const startDateOfWeek = new Date(currentDate.getFullYear(), 0, 1);
  /*get day of year*/
  const dayOfYear =
    Math.floor((currentDate - startDateOfWeek) / TIME_OF_1_DAY) + 1;
  return Math.ceil(dayOfYear / 7);
};

export const getDataTableWeek = (start_date: string, end_date: string) => {
  let dataAll = DATA_LABEL_WEEK;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataAll = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= getCurrentWeekOfDay(start_date) &&
        item.id <= getCurrentWeekOfDay(end_date)
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataAll = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= Number(moment(start_date).format("ww")) &&
        item.id <= Number(moment().format("ww"))
      );
    });
  }

  return dataAll;
};

export const getDataTitleWeekLine = (
  start_date: string | null,
  end_date: string
) => {
  let dataWeek = DATA_LABEL_WEEK;
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    dataWeek = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= getCurrentWeekOfDay(start_date) &&
        item.id <= getCurrentWeekOfDay(end_date)
      );
    });
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    dataWeek = DATA_LABEL_WEEK.filter((item) => {
      return (
        item.id >= getCurrentWeekOfDay(start_date) &&
        item.id <= getCurrentWeekOfDay(moment().format("YYYY-MM-DD"))
      );
    });
  }
  const dataTitle = [];
  dataWeek.filter((item) => {
    const index = dataTitle.findIndex((title) => title === item.name);
    if (index === -1) {
      dataTitle.push(item.name);
    }
  });
  return dataTitle;
};

export const checkDateWeek = (start_date: string, end_date: string) => {
  if (
    start_date &&
    end_date &&
    moment(start_date).format("YYYY") === moment(end_date).format("YYYY")
  ) {
    return true;
  }
  if (
    start_date &&
    !end_date &&
    moment(start_date).format("YYYY") === moment().format("YYYY")
  ) {
    return true;
  }
  return false;
};
