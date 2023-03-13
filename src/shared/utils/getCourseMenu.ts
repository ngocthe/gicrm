const getCourseMenuBooking = (
  course: string,
  menu: [],
  staffName?: string,
  showStaff?: boolean
) => {
  const arrayCourseMenu = [];
  if (course) {
    arrayCourseMenu.push(course);
  }
  if (menu && menu.length > 0) {
    menu.map((item: any) => {
      arrayCourseMenu.push(item?.name);
    });
  }

  if (staffName && showStaff) {
    arrayCourseMenu.push(staffName);
  }

  return arrayCourseMenu.join("、");
};

export default getCourseMenuBooking;
