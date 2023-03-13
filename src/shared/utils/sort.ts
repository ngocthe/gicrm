import { SORT_ORDER } from "~/../../src/shared/constants";

export const getTypeSort = (typeSort: string) => {
  switch (typeSort) {
    case SORT_ORDER.ASC:
      return "ascending";
    case SORT_ORDER.DESC:
      return "descending";
    default:
      return "";
  }
};
