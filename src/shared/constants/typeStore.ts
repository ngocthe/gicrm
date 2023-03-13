import typeStoreCategory from "~/../../src/shared/constants/category";
export const LIMIT_CATEGORY_STORE = [
  typeStoreCategory.RESTAURANT,
  typeStoreCategory.SALON,
  typeStoreCategory.MEDIAL_CARE,
  typeStoreCategory.CLASSROOM,
  typeStoreCategory.CONSULTATION,
  typeStoreCategory.EVENT,
];

export const PEOPLE_STORE_BOOKING = [typeStoreCategory.RESTAURANT];
export const COURSE_STORE_BOOKING = [
  typeStoreCategory.RESTAURANT,
  typeStoreCategory.SALON,
];
export const SEAT_STORE_BOOKING = [typeStoreCategory.RESTAURANT];
export const STAFF_STORE_BOOKING = [typeStoreCategory.SALON];
export const MENU_STORE_BOOKING = [typeStoreCategory.SALON];

export const COUPON_STORE_BOOKING = [
  typeStoreCategory.RESTAURANT,
  typeStoreCategory.EVENT,
];

export const isRestaurant = (id: number) => {
  return id === typeStoreCategory.RESTAURANT;
};

export const isSalon = (id: number) => {
  return id === typeStoreCategory.SALON;
};

export const isMedialCare = (id: number) => {
  return id === typeStoreCategory.MEDIAL_CARE;
};

export const isClassRoom = (id: number) => {
  return id === typeStoreCategory.CLASSROOM;
};

export const isConsultation = (id: number) => {
  return id === typeStoreCategory.CONSULTATION;
};

export const isEvent = (id: number) => {
  return id === typeStoreCategory.EVENT;
};

export const checkTypeStore = (data = [], item: number) => {
  return data.includes(item);
};
