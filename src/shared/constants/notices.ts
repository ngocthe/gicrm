export const LIMIT_DEFAULT = 4;

export const TYPE = {
  SYSTEM: 0,
  NOTICES: 1,
};

export const noticeOptions = [
  {
    value: TYPE.SYSTEM,
    label: "notice_system",
  },
  {
    value: TYPE.NOTICES,
    label: "notice_user",
  },
];

export const LIMIT_NOTICE_TOP = 8;

export const TYPE_TEMPLATE = {
  StoreApproveTemporaryBookingStore: "store_approve_temporary_booking.store",
  StoreApproveTemporaryBookingUser: "store_approve_temporary_booking.user",
  StoreCancelNowBookingStore: "store_cancel_now_booking.store",
  StoreCancelNowBookingUser: "store_cancel_now_booking.user",
  StoreCancelTemporaryBookingStore: "store_cancel_temporary_booking.store",
  StoreCancelTemporaryBookingUser: "store_cancel_temporary_booking.user",
  UserCancelNowBookingStore: "user_cancel_now_booking.store",
  UserCancelNowBookingUser: "user_cancel_now_booking.user",
  UserCancelTemporaryBookingStore: "user_cancel_temporary_booking.store",
  UserCancelTemporaryBookingUser: "user_cancel_temporary_booking.user",
  UserNowBookingStore: "user_now_booking.store",
  UserNowBookingUser: "user_now_booking.user",
  UserTemporaryBookingUser: "user_temporary_booking.user",
  UserTemporaryBookingStore: "user_temporary_booking.store",
};
