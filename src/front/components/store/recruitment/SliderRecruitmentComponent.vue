<template>
  <div class="slider-recruitment">
    <div class="slider-body">
      <div class="slider-body__images">
        <img :src="dataSlider.image?.url" alt="" />
      </div>
      <div class="slider-body__title">
        {{ dataSlider.recruitment_title }}
      </div>
      <div class="slider-body__text">
        {{ dataSlider.recruitment_overview }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
interface Prop {
  dataSlider?: any;
}

const props = withDefaults(defineProps<Prop>(), {
  dataSlider: null,
});

toRefs(props);
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.slider-body {
  &__images img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  &__title {
    color: #8a6d3b;
    font-weight: bold;
    text-align: justify;
    padding: 16px 0;
    font-size: 16px;
    white-space: break-spaces;
  }

  &__text {
    text-align: justify;
    margin-bottom: 16px;
    font-size: 14px;
    white-space: break-spaces;
  }

  img:hover {
    opacity: 0.6;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .slider-body {
    padding: 0 24px;

    &__images img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }
}
</style>
