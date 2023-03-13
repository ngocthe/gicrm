export const GENDER = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

const MIN_AGE_USER = 1;
const MAX_AGE_USER = 200;
const MIN_MONTH_USER = 1;
const MAX_MONTH_USER = 12;
const MIN_DATE_USER = 1;
const MAX_DATE_USER = 31;

export const USER = "user";
export const CUSTOMER = "customer";

export const genderOptions = [
  {
    value: GENDER.MALE,
    label: "male",
  },
  {
    value: GENDER.FEMALE,
    label: "female",
  },
  {
    value: GENDER.OTHER,
    label: "gender_other",
  },
];

export const statusSendOptions = [
  {
    value: 2,
    label: "admin.messages.send",
  },
  {
    value: 1,
    label: "admin.messages.un_send",
  },
];

export const STATUS = {
  IN_ACTIVE: 0,
  ACTIVE: 1,
};

export const statusOptions = [
  {
    label: "active",
    value: STATUS.ACTIVE,
  },
  {
    label: "in_active",
    value: STATUS.IN_ACTIVE,
  },
];

export const arrayAge = [
  {
    type: 0,
    value: [0, 9],
  },
  {
    type: 1,
    value: [10, 19],
  },
  {
    type: 2,
    value: [20, 29],
  },
  {
    type: 3,
    value: [30, 39],
  },
  {
    type: 4,
    value: [40, 49],
  },
  {
    type: 5,
    value: [50, 59],
  },
  {
    type: 6,
    value: [60, 69],
  },
  {
    type: 7,
    value: [70, 200],
  },
];

export const ageOptions = [
  {
    label: "10代未満",
    value: 0,
  },
  {
    label: "10代",
    value: 1,
  },
  {
    label: "20代",
    value: 2,
  },
  {
    label: "30代",
    value: 3,
  },
  {
    label: "40代",
    value: 4,
  },
  {
    label: "50代",
    value: 5,
  },
  {
    label: "60代",
    value: 6,
  },
  {
    label: "70代",
    value: 7,
  },
];

export const dateOptions = [];
export const monthOptions = [];

for (let i = MIN_MONTH_USER; i <= MAX_MONTH_USER; i++) {
  monthOptions.push({
    value: i,
    label: i,
  });
}

for (let i = MIN_DATE_USER; i <= MAX_DATE_USER; i++) {
  dateOptions.push({
    value: i,
    label: i,
  });
}
