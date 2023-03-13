<template>
  <ClientOnly>
    <div class="custom-time-ranger">
      <el-select
        :model-value="startTime"
        :editable="false"
        class="mr-4"
        placeholder="08:00"
        @change="handleChangeStartTime"
      >
        <el-option
          v-for="time in arrTime"
          :key="time"
          :label="time"
          :value="time"
          :disabled="time >= endTime"
        />
      </el-select>
      <div class="ranger">-</div>
      <el-select
        :model-value="endTime"
        :editable="false"
        class="mr-4"
        placeholder="08:00"
        @change="handleChangeEndTime"
      >
        <el-option
          v-for="time in arrTime"
          :key="time"
          :label="time"
          :value="time"
          :disabled="time <= startTime"
        />
      </el-select>
      <IconTimeRanger class="icon-suffix" />
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import IconTimeRanger from "~/../../src/shared/components/icon/TimeRanger.vue";
import { ref } from "vue";
import { getTimeArray } from "~/../../src/shared/utils";

interface Prop {
  startTime: string;
  endTime: string;
  defaultStart?: string;
  defaultEnd?: string;
  defaultStep?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  defaultStart: "00:00",
  defaultEnd: "24:00",
  defaultStep: "00:15",
});

const emits = defineEmits(["update:startTime", "update:endTime"]);
const arrTime = ref([]);

const handleChangeStartTime = (value) => {
  emits("update:startTime", value);
};

const handleChangeEndTime = (value) => {
  emits("update:endTime", value);
};

arrTime.value = getTimeArray(
  props.defaultStart,
  props.defaultEnd,
  15,
  "minutes"
);
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.custom-time-ranger {
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid $gray-200;
  border-radius: 4px;
  padding: 0 8px;
  background: $white-color;

  .icon-suffix {
    width: 16px;
  }

  :deep(.el-select) {
    --el-select-border-color-hover: "";
    --el-select-input-focus-border-color: "";
    flex: 1;

    .el-input__inner {
      text-align: center;
    }

    &:hover {
    }

    .el-input__wrapper {
      box-shadow: none;
      height: 40px;
      padding: 0;

      .el-input__suffix {
        display: none;
      }

      .el-input__prefix {
        display: none;
      }
    }
  }
}
</style>
