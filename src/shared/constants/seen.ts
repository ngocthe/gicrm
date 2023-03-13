import { i18n } from "../../shared/plugins/i18n";

const { t } = i18n.global;

export const STATUS = {
  NOT_SEEN: 0,
  IS_SEEN: 1,
};

export const statusSeenOptions = [
  {
    value: STATUS.NOT_SEEN,
    label: t("not_seen"),
  },
  {
    value: STATUS.IS_SEEN,
    label: t("is_seen"),
  },
];

export default statusSeenOptions;
