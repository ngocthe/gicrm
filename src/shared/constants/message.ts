import {
  SALON,
  RESTAURANT,
  MEDIAL_CARE,
  CLASSROOM,
  CONSULTATION,
  EVENT,
} from "./category";

export const MESSAGE_TYPE = {
  MAIL: 1,
  LINE: 2,
  SMS: 3,
};

export const messageTypes = [
  {
    label: "admin.messages.sms",
    value: MESSAGE_TYPE.SMS,
  },
  {
    label: "admin.messages.mail",
    value: MESSAGE_TYPE.MAIL,
  },
  {
    label: "admin.messages.line",
    value: MESSAGE_TYPE.LINE,
  },
];

export const STATUS_SENT = {
  UN_SENT: 1,
  SENT: 2,
};

export const bussinessOptions = [
  {
    label: "all",
    value: null,
  },
  {
    label: "beauty_salon",
    value: SALON,
  },
  {
    label: "restaurant",
    value: RESTAURANT,
  },
  // {
  //   label: "medial_care",
  //   value: MEDIAL_CARE,
  // },
  // {
  //   label: "classroom",
  //   value: CLASSROOM,
  // },
  // {
  //   label: "consultation",
  //   value: CONSULTATION,
  // },
  // {
  //   label: "event",
  //   value: EVENT,
  // },
];
