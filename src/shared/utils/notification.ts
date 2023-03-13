import { ElMessage } from "element-plus";
import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

export const messageSuccess = (title: string) => {
  ElMessage({
    message: t(title),
    type: "success",
    grouping: true,
  });
};

export const messageError = (title: string) => {
  ElMessage({
    message: t(title),
    type: "error",
    grouping: true,
  });
};

export const uploadImageError = () => {
  ElMessage({
    message: t("errors.cant_upload_image"),
    type: "error",
    grouping: true,
  });
};

export const removeImageError = () => {
  ElMessage({
    message: t("errors.cant_remove_image"),
    type: "error",
    grouping: true,
  });
};

export const updateSuccess = () => {
  ElMessage({
    message: t("success.edit"),
    type: "success",
    grouping: true,
  });
};

export const deleteSuccess = () => {
  ElMessage({
    message: t("success.delete"),
    type: "success",
    grouping: true,
  });
};

export const createSuccess = () => {
  ElMessage({
    message: t("success.create"),
    type: "success",
    grouping: true,
  });
};

export const importSuccess = () => {
  ElMessage({
    message: t("success.import"),
    type: "success",
    grouping: true,
  });
};

export const updateError = () => {
  ElMessage({
    message: t("errors.edit"),
    type: "error",
    grouping: true,
  });
};

export const deleteError = () => {
  ElMessage({
    message: t("errors.delete"),
    type: "error",
    grouping: true,
  });
};

export const createError = () => {
  ElMessage({
    message: t("errors.create"),
    type: "error",
    grouping: true,
  });
};

export const addressNotFound = () => {
  ElMessage({
    message: t("errors.not_found_address"),
    type: "error",
    grouping: true,
  });
};

export const noReserveBooking = () => {
  ElMessage({
    message: t("store.no_seat_reverse"),
    type: "warning",
    grouping: true,
  });
};

export const toastApproveBooking = () => {
  ElMessage({
    message: t("success.email_sent_confirm_booking"),
    type: "success",
    grouping: true,
    duration: 3000,
  });
};

export const forgotPasswordFailed = () => {
  ElMessage({
    message: t("errors.reset_password_failed"),
    type: "error",
    grouping: true,
    duration: 3000,
  });
};

export const resetPasswordFailed = () => {
  ElMessage({
    message: t("errors.token_failed"),
    type: "error",
    grouping: true,
    duration: 3000,
  });
};

export const loginFailed = () => {
  ElMessage({
    message: t("errors.login_failed"),
    type: "error",
    grouping: true,
    duration: 3000,
    customClass: "message-override",
  });
};

export const warningChangePrice = () => {
  ElMessage({
    message: t("warning.change_price"),
    type: "warning",
    grouping: true,
    duration: 5000,
  });
};

export const loginFailedSocial = (message: string) => {
  ElMessage({
    message: t(message),
    type: "error",
    grouping: true,
    duration: 3000,
    customClass: "message-override",
  });
};

export const messageWarning = (title: string) => {
  ElMessage({
    message: t(title),
    type: "warning",
    grouping: true,
    customClass: "message-override",
  });
};

export const customMessageErrorRow = (
  messageRowOne: string,
  messageRowTwo: string
) => {
  ElMessage({
    message: t(messageRowOne) + "</br>" + t(messageRowTwo),
    dangerouslyUseHTMLString: true,
    type: "error",
    grouping: true,
    duration: 3000,
    customClass: "message-override error-booking-override",
  });
};
