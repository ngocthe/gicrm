import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const PAYMENT_TYPE = {
  CARD: 1,
  CASH: 2,
  CONTACTLESS: 3,
};

export const PAYMENT_TYPE_DATA = {
  1: t("credit_payment"),
  2: t("cash_payment"),
  3: t("contactless"),
};

export const PaymentMethod = [
  {
    label: t("credit_payment"),
    value: PAYMENT_TYPE.CARD,
  },
  {
    label: t("cash_payment"),
    value: PAYMENT_TYPE.CASH,
  },
  {
    label: t("contactless"),
    value: PAYMENT_TYPE.CONTACTLESS,
  },
];

export const LINK_STATUS = {
  UNLINKED: 0,
  LINKED: 1,
};

export const LINK_STATUS_TEXT = {
  [LINK_STATUS.UNLINKED]: "not_linked",
  [LINK_STATUS.LINKED]: "already_linked",
};

export const PAYMENT_STATUS_BOOKING = {
  PAID: 1,
  UNPAID: 2,
  REFUND: 3,
  WAITING: 4,
};

export const paymentStatusBookingOptions = [
  {
    value: PAYMENT_STATUS_BOOKING.UNPAID,
    label: t("booking.unsettled"),
  },
  {
    value: PAYMENT_STATUS_BOOKING.WAITING,
    label: t("booking.waiting_payment"),
  },
  {
    value: PAYMENT_STATUS_BOOKING.PAID,
    label: t("booking.payment_completed2"),
  },
  {
    value: PAYMENT_STATUS_BOOKING.REFUND,
    label: t("booking.refunded"),
  },
];

export const searchDatePayment = {
  DATE_TIME: 1,
  DATE_VISIT: 2,
};
