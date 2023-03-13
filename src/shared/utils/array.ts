/**
 * @param array
 * @param keyMap: value
 * @param valueMap: property
 */
export const findObj = (array, keyMap, valueMap) => {
  if (array && array.length) {
    return array.find((item) => item[keyMap] === valueMap);
  }
  return "";
};
