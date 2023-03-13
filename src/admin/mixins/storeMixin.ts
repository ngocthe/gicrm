import { DataFile, ImageUpload } from "~/../../src/shared/models";
import FileRequest from "~/../../src/shared/requests/FileRequest";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { changeDataImage, searchAddressHelper } from "~/../../src/shared/utils";
import moment from "moment";
import { formatValuePrice } from "~/../../src/shared/utils/price";
import { HYPERTEXT } from "~/../../src/shared/constants";
import { uploadImageError } from "~/../../src/shared/utils/notification";
import { format23Hours59MinHoursTo24Hours } from "~/../../src/shared/utils";

export const useSearchAddress = async (formData, loadingSearch) => {
  try {
    loadingSearch.value = true;
    const { address, address_detail } = await searchAddressHelper(
      formData.postal_code
    );
    formData.address = address;
    formData.address_detail = address_detail;
  } finally {
    loadingSearch.value = false;
  }
};

export const useSetDataCancelProtected = (formData, setting_store_cancel) => {
  // Format data before call api
  formData.setting_store_cancel.seven_day_to_two_day_ago_percent =
    setting_store_cancel.seven_day_to_two_day_ago_percent !== null
      ? +setting_store_cancel.seven_day_to_two_day_ago_percent
      : null;

  formData.setting_store_cancel.no_contact_percent =
    setting_store_cancel.no_contact_percent !== null
      ? +setting_store_cancel.no_contact_percent
      : null;

  formData.setting_store_cancel.that_day_percent =
    setting_store_cancel.that_day_percent !== null
      ? +setting_store_cancel.that_day_percent
      : null;

  formData.setting_store_cancel.one_day_ago_percent =
    setting_store_cancel.one_day_ago_percent !== null
      ? +setting_store_cancel.one_day_ago_percent
      : null;
};

export const useRemoveImage = async (
  file: ImageUpload,
  fileList,
  formData,
  imagesUpload
) => {
  if (file?.id) {
    const index = formData.image_id.findIndex((item) => item === file.id);
    if (index > -1) {
      formData.image_id.splice(index, 1);
    }
  } else {
    const index = imagesUpload.value.findIndex((item) => item.uid === file.uid);
    if (index > -1) {
      imagesUpload.value.splice(index, 1);
    }
  }
};

export const useChangeImage = async (
  file,
  fileList,
  imagesUpload,
  loadingAvatar
) => {
  imagesUpload.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  body.append("model_type", MODEL_TYPE.STORE);
  try {
    loadingAvatar.value = true;
    const response = await FileRequest.post(body);
    const dataFile = response.data as DataFile;
    const index = fileList.findIndex((item) => item.uid === file.uid);
    fileList[index].id = dataFile.id;
    fileList[index].url = dataFile.url;
  } catch (error) {
    imagesUpload.value.pop();
    uploadImageError();
  } finally {
    loadingAvatar.value = false;
  }
};

export const useSetData = (
  storeDetail: any,
  formData: any,
  imagesUpload: any,
  isHoliday: any,
  multiSelectDate: any,
  arrayCheckDayOff: any,
  setting_store_cancel: any,
  optionRefund: any,
  suffixCode: any
) => {
  if (storeDetail.value) {
    formData.type_store_id = storeDetail.value?.model_has_type?.type_id;
    formData.agent_code = storeDetail.value.agent_code;
    formData.name = storeDetail.value.name;
    formData.first_company_name = storeDetail.value.first_company_name;
    formData.last_company_name = storeDetail.value.last_company_name;
    formData.first_company_name_kana =
      storeDetail.value.first_company_name_kana;
    formData.last_company_name_kana = storeDetail.value.last_company_name_kana;
    formData.introduction = storeDetail.value.introduction;
    formData.description = storeDetail.value.description;
    formData.cancellation = storeDetail.value.cancellation;
    formData.email = storeDetail.value.email;
    formData.email_for_notification_reception =
      storeDetail.value.email_for_notification_reception;
    formData.area = storeDetail.value.area;
    formData.postal_code = storeDetail.value.postal_code;
    formData.link_google_map = storeDetail.value.link_google_map;
    formData.iframe_google_map = storeDetail.value.iframe_google_map;
    formData.latitude = storeDetail.value.latitude;
    formData.longitude = storeDetail.value.longitude;
    formData.portal_site = storeDetail.value.portal_site || 0;
    formData.status_display = storeDetail.value.status_display || 0;
    formData.is_setting_cancel = storeDetail.value?.is_setting_cancel === 1;
    formData.phone_number = storeDetail.value.phone_number;
    formData.postal_code = storeDetail.value.postal_code;
    formData.address = storeDetail.value.address;
    formData.address_detail = storeDetail.value.address_detail;
    formData.note = storeDetail.value.note;
    formData.news = storeDetail.value.news;
    formData.code = storeDetail.value.code || "";
    formData.prefixCode = formData.code.substring(0, 3);
    suffixCode.value = formData.code.substring(3);

    formData.home_page = storeDetail.value?.home_page || "";
    formData.comment_opening_time = storeDetail.value.comment_opening_time;
    formData.transportation = storeDetail.value.transportation;
    formData.status = storeDetail.value.status;

    //Tag_id
    formData.tag = storeDetail.value.model_has_tag.map(
      (item: any) => item?.tag_store?.name
    );
    //
    const { imageGet, dataImage } = changeDataImage(
      storeDetail.value.model_has_file
    );
    imagesUpload.value = imageGet;
    formData.image_id = dataImage;
    //Opening time
    const arrTimeOpen = format23Hours59MinHoursTo24Hours(
      storeDetail.value.opening_times,
      "end"
    );

    formData.opening_times = arrTimeOpen.map((item) => ({
      day_of_week: item.day_of_week,
      start: moment(item.start, "HHmmss").format("HH:mm"),
      end: item.end,
    }));

    //Closing time
    formData.closing_times = storeDetail.value.closing_times.map((item) => ({
      day_off: item.day_off,
    }));
    isHoliday.value = !!formData.closing_times.length;
    multiSelectDate.value = formData.closing_times.map((item) => item.day_off);
    arrayCheckDayOff.value.forEach((item, index) => {
      const itemFind = formData.opening_times.find(
        (item) => item.day_of_week === index
      );
      if (itemFind) {
        arrayCheckDayOff.value[itemFind.day_of_week] = 0;
      } else {
        arrayCheckDayOff.value[index] = 1;
      }
    });

    //Setting cancel
    setting_store_cancel.seven_day_to_two_day_ago_percent =
      storeDetail.value.setting_store_cancel?.seven_day_to_two_day_ago_percent;

    setting_store_cancel.one_day_ago_percent =
      storeDetail.value.setting_store_cancel?.one_day_ago_percent;

    setting_store_cancel.that_day_percent =
      storeDetail.value.setting_store_cancel?.that_day_percent;

    setting_store_cancel.no_contact_percent =
      storeDetail.value.setting_store_cancel?.no_contact_percent;
  }
};
