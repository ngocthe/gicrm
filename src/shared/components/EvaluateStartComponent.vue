<template>
  <div v-if="modelValue" class="rating-star">
    <div>
      <client-only>
        <el-rate
          class="rating-star__bg"
          :disabled="disabled"
          :icons="icons"
          :void-icon="IconStarDisableReview"
          :disabled-void-icon="IconStarDisableReview"
        />
      </client-only>
    </div>
    <client-only>
      <el-rate
        :model-value="modelValue"
        :disabled="disabled"
        :show-score="showScore"
        score-template="{value}"
        :icons="icons"
        :void-icon="iconDisabled ? IconStarDisable : IconStarDisableReview"
        :disabled-void-icon="IconStarDisable"
        :class="className"
        @change="handleChange"
      />
    </client-only>
  </div>
  <div v-else>{{ $t("no_reviews") }}</div>
</template>

<script lang="ts" setup>
import IconStar from "~/../../src/front/components/Icon/Star.vue";
import IconStarDisable from "~/../../src/front/components/Icon/StarDisable.vue";
import IconStarDisableReview from "~/../../src/front/components/Icon/StarDisableReview.vue";

const emits = defineEmits(["update:modelValue"]);
const icons = [IconStar, IconStar, IconStar];

interface Prop {
  modelValue: number;
  disabled?: boolean;
  showScore?: boolean;
  iconDisabled?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: 0,
  disabled: true,
  showScore: true,
  iconDisabled: true,
  className: "",
});

const handleChange = (e: number) => {
  emits("update:modelValue", e);
};
</script>

<style lang="scss" scoped>
.rating-star {
  position: relative;

  .rating-star__bg {
    position: absolute;
  }
}

:deep(.el-rate .el-rate__item .el-icon svg) {
  width: 18px;
}

.el-rate {
  --el-rate-text-color: #ffc33a;
  --el-rate-icon-margin: 8px;

  :deep(.el-rate__text) {
    color: #ffc33a;
    font-weight: 700;
    margin-left: 8px;
  }
}

.detail-store {
  :deep(.el-rate__text) {
    color: #000000 !important;
    font-weight: 500;
    margin-left: 8px;
  }
}

.show-rate {
  :deep(.el-rate__text) {
    color: #000000 !important;
    font-weight: 500;
    margin-left: 8px;
  }
}
</style>
