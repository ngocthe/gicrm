import { TagStoreModel } from "../../admin/models";

export const getTagStore = (tag: TagStoreModel[]) => {
  if (tag.length <= 0) {
    return "";
  } else {
    const result: string[] = [];
    tag.forEach((item: TagStoreModel) => {
      result.push(item.tag_store.name);
    });
    return result.join("、 ");
  }
};
