<template>
  <div class="multi-select-date">
    <div class="select-date cursor-pointer" @click="addDate">
      <div ref="_refElement" class="select-tags">
        <div v-for="(date, key) in modelValue" :key="key" class="tag">
          <span>{{ formatDate(date) }}</span>
          <IconClose @click="deleteHoliday(date)" />
        </div>
        <el-date-picker
          ref="_refDate"
          v-model="dateSelect"
          type="date"
          placeholder="Pick a day"
          class="custom-date-picker"
          :teleported="false"
          :editable="false"
          value-format="YYYY-MM-DD"
          @change="selectMultiDate"
          @visible-change="handleVisible"
          @focus="handleFocus"
        >
          <template #default="cell">
            <div class="cell" :class="{ current: daySelect(cell) }">
              <span class="text">{{ cell.text }}</span>
            </div>
          </template>
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconClose from "~/../../src/shared/components/icon/Close.vue";
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs } from "vue";
import moment from "moment/moment";

interface Prop {
  modelValue: string[];
}

const emits = defineEmits(["update:modelValue"]);

const props = defineProps<Prop>();
const { modelValue } = toRefs(props);

const dateSelect = ref("");
const _refElement = ref();
const _refDate = ref();
const isDelete = ref(false);
const heightInput = ref("100%");

const formatDate = (value) => {
  return moment(value).format("YYYY/MM/DD");
};

const daySelect = ({ dayjs }) => {
  return modelValue.value.includes(dayjs.format("YYYY-MM-DD"));
};

const addDate = () => {
  _refDate.value.focus();
};

const handleFocus = () => {
  if (isDelete.value) {
    isDelete.value = false;
    _refDate.value.handleClose();
  }
};

const selectMultiDate = (value) => {
  if (!value) return;
  if (modelValue.value.includes(value)) {
    deleteHoliday(value);
  } else {
    modelValue.value.push(value);
    emits("update:modelValue", modelValue.value);
    nextTick(() => {
      heightInput.value = `${_refElement.value?.offsetHeight}px`;
    });
  }
};

const deleteHoliday = (value) => {
  isDelete.value = true;
  const index = modelValue.value.findIndex((item) => item === value);
  modelValue.value.splice(index, 1);
  emits("update:modelValue", modelValue.value);
  nextTick(() => {
    heightInput.value = `${_refElement.value?.offsetHeight}px`;
  });
};

const handleVisible = () => {
  isDelete.value = false;
};

onMounted(() => {
  heightInput.value = `${_refElement.value?.offsetHeight}px`;

  window.addEventListener("resize", () => {
    heightInput.value = `${_refElement.value?.offsetHeight}px`;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    heightInput.value = `${_refElement.value?.offsetHeight}px`;
  });
});
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.multi-select-date {
  position: relative;
  width: 100%;
  height: v-bind(heightInput);
  min-height: 40px;
  background: $white-color;

  .select-date {
    position: absolute;
    width: 100%;
    min-height: 100%;
    border: 1px solid $gray-200;
    border-radius: 4px;

    .select-tags {
      position: relative;
      height: 100%;
      line-height: 24px;
      padding: 4px 6px;
      z-index: 9;

      .tag {
        background: $gray-100;
        border-radius: 4px;
        display: inline-block;
        margin: 2px 8px 2px 0;
        padding: 0 8px;

        span {
          padding-right: 8px;
        }

        :deep(svg) {
          vertical-align: -2px;

          &:hover {
            cursor: pointer;
            background: $gray-300;
            border-radius: 100%;

            path {
              fill: $white-color;
            }
          }
        }
      }
    }
  }

  :deep(.custom-date-picker) {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: v-bind(heightInput);
    top: 0;
    left: 0;
    z-index: -1;

    .el-input__wrapper {
      z-index: -1;
    }

    .el-input__inner {
      z-index: -1;
      cursor: pointer;
      height: v-bind(heightInput);
    }
  }

  .cell {
    height: 30px;
    padding: 3px 0;
    box-sizing: border-box;
  }

  .cell .text {
    width: 24px;
    height: 24px;
    display: block;
    margin: 0 auto;
    line-height: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }

  .cell.current .text {
    background: $blue;
    color: $white-color;
  }
}
</style>
