export const TYPE = {
  SYSTEM: 0,
  GOOGLE: 1,
  FACE_BOOK: 2,
  TWITTER: 3,
  LINE: 4,
  YAHOO: 5,
};

export const typeLoginOptions = [
  {
    value: TYPE.SYSTEM,
    label: "login_system",
  },
  {
    value: TYPE.GOOGLE,
    label: "login_google",
  },
  {
    value: TYPE.FACE_BOOK,
    label: "login_face_book",
  },
  {
    value: TYPE.TWITTER,
    label: "login_twitter",
  },
  {
    value: TYPE.LINE,
    label: "login_line",
  },
  {
    value: TYPE.YAHOO,
    label: "login_yahoo",
  },
];

export default typeLoginOptions;
