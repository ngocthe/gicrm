<template>
  <div class="select-date">
    <div class="select-tags">
      <el-input
        :model-value="customDateValue"
        :prefix-icon="IconDate"
        clearable
        :placeholder="placeholder"
        @click="addDate"
        @clear="clearData"
      >
      </el-input>
      <el-date-picker
        ref="_refDate"
        v-model="date"
        :type="typeDate"
        placeholder=" "
        class="custom-date-picker"
        :clearable="true"
        :teleported="false"
        :editable="false"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        @change="selectDate"
        @visible-change="handleVisible"
        @click="handleFocus"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, watch } from "vue";
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import { formatDate } from "../../utils";
import { TYPE_MONTH, TYPE_WEEK } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";

interface Prop {
  modelValue: string;
  placeholder?: string;
  format?: string;
  width?: string;
  clearable?: boolean;
  valueFormat?: string;
  typeDate: string;
  disabledDate?: DateFunction;
  field: string;
}

const { t } = i18n.global;

const emits = defineEmits(["update:modelValue", "clearData", "handleChange"]);
type DateFunction = (time: Date) => boolean;

const props = withDefaults(defineProps<Prop>(), {
  typeDate: "date",
  width: "134px",
  placeholder: "",
  format: "YYYY年MM月DD日",
  disabledDate: () => {
    return false;
  },
});
const { modelValue, typeDate, field, placeholder } = toRefs(props);

const _refDate = ref();
const isDelete = ref(false);
const date = ref(modelValue.value);
const TIME_OF_1_DAY = 24 * 60 * 60 * 1000;

watch(modelValue, (val) => {
  if (val) {
    date.value = val;
  }
});

watch(typeDate, (val) => {
  date.value = null;
});

let customDateValue = computed(() => {
  if (!modelValue.value) return null;
  if (typeDate.value === TYPE_WEEK) {
    return (
      getCurrentYear() +
      t("year") +
      getCurrentWeekOfDay() +
      t("week") +
      formatDate(modelValue.value, "　(MM/DD～)")
    );
  } else if (typeDate.value === TYPE_MONTH) {
    return formatDate(modelValue.value, "YYYY年MM月");
  } else {
    return formatDate(modelValue.value);
  }
});
const addDate = () => {
  _refDate.value.focus();
};

const clearData = () => {
  date.value = null;
  emits("clearData");
};

const getCurrentWeekOfDay = () => {
  const currentDate = new Date(modelValue.value);
  /* get start date of week include currentDate*/
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  /*get day of year*/
  let dayOfYear = Math.floor((currentDate - startDate) / TIME_OF_1_DAY) + 1;
  return Math.ceil(dayOfYear / 7);
};

const getCurrentYear = () => {
  const currentDate = new Date(modelValue.value);
  return currentDate.getFullYear();
};

const handleFocus = () => {
  if (isDelete.value) {
    isDelete.value = false;
    _refDate.value.handleClose();
  }
};

const handleVisible = () => {
  isDelete.value = false;
};

const selectDate = (value) => {
  if (!value) return;
  emits("update:modelValue", value);
  emits("handleChange");
};
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.select-date {
  .select-tags {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    line-height: 24px;
    padding: 4px 6px;
  }
}

:deep(.custom-date-picker) {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 40px;
  top: 0;
  left: 0;
  z-index: -1;

  .el-input__wrapper {
    z-index: -1;
  }

  .el-input__inner {
    z-index: -1;
    cursor: pointer;
    height: 40px;
  }
}
</style>
