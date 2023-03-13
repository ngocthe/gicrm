import {
  DATA_CANCEL_FILTER,
  RESERVATION_STATUS,
  reservationStatusOptions,
} from "~/../../src/shared/constants/reservation";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";

const { t } = i18n.global;
export const getSituation = (booking) => {
  let text = t(
    reservationStatusOptions.find((item) => item.value === booking.status)
      ?.label || ""
  );
  if (booking.status === RESERVATION_STATUS.CANCEL) {
    text = `${text}（${
      DATA_CANCEL_FILTER[booking?.cancel?.type_user_cancel]
    }）`;
  }
  return text;
};

export const totalPriceBooking = (typeStore: number, formData: any) => {
  switch (typeStore) {
    case RESTAURANT:
      return formData.priceAdult + formData.priceChildren;
    case SALON:
      const result = formData.arrMenu?.reduce((acc, item) => {
        return acc + (item.price || 0);
      }, 0);
      return result + formData.staff_fee + formData.course_price;
    default:
      return 0;
  }
};

export const wrapArrayMenu = (arrMenu) => {
  const arrCategory = [];
  arrMenu.forEach((menu) => {
    const existCategory = arrCategory.findIndex(
      (item) => item.id === menu.menu.category.id
    );
    if (existCategory > -1) {
      arrCategory[existCategory].menus.push({
        ...menu.menu,
        price: menu.menu_price,
      });
    } else {
      const category = {
        ...menu.menu.category,
        menus: [
          {
            ...menu.menu,
            price: menu.menu_price,
          },
        ],
      };
      arrCategory.push(category);
    }
  });
  return arrCategory;
};
