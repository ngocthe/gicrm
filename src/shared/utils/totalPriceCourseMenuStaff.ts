export const totalPriceCourseMenuStaff = (
  course?: { price: number },
  menus?: [{ price: number }],
  staff?: { fee: number; request_staff: number }
) => {
  let totalPrice = 0;

  if (course) {
    totalPrice += course?.price;
  }

  if (menus) {
    menus.forEach((item) => {
      totalPrice += item?.price;
    });
  }

  if (staff?.request_staff) {
    totalPrice += staff.fee;
  }

  return totalPrice;
};
