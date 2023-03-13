export const changeDataImage = (image = []) => {
  const imageGet = [];
  const dataImage = [];
  if (image.length !== 0) {
    for (const obj of image) {
      if (obj.file) {
        imageGet.push(obj.file);
        dataImage.push(obj.file.id);
      }
    }
  }
  return { imageGet, dataImage };
};
