const getFullName = (first_name: string, last_name: string) => {
  if (first_name || last_name) {
    return ((first_name || "") + " " + (last_name || "")).trim();
  }
  return "";
};

export default getFullName;
