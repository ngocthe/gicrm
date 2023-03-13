<template>
  <div class="line-chart-vue">
    <client-only>
      <div v-if="data.length > 0" class="title">{{ title }}</div>
      <v-chart
        v-if="data.length > 0"
        ref="_refChart"
        class="chart-line"
        :option="option"
      />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import VChart from "vue-echarts";
import { onBeforeMount, onBeforeUnmount, ref, toRefs, watch } from "vue";
import { useNuxtApp } from "nuxt/app";

interface dataTitle {
  name: string;
  id: number | string;
}
const _refChart = ref(null);
const { $bus } = useNuxtApp();

interface propData {
  key: string;
  value: number | string;
  data: dataTitle[];
  color: string;
}
interface Prop {
  height?: string;
  dataTitle: dataTitle[];
  data: propData[];
  title: string;
}

const props = withDefaults(defineProps<Prop>(), {
  height: "327px",
  dataTitle: () => {
    return [];
  },
  data: () => {
    return [];
  },
});
$bus.$on("resizeHeader", () => {
  _refChart.value?.resize();
});
const { data, height, dataTitle } = toRefs(props);

const option = ref({
  xAxis: {
    data: dataTitle,
    type: "category",
    axisTick: {
      show: false,
    },
  },
  tooltip: {
    trigger: "axis",
    // formatter: "{a} <br/>{b} : {c}",
  },
  yAxis: {
    type: "value",
  },
  dataZoom: {
    type: "inside",
  },
  legend: {
    show: !0,
    x: "right",
    y: "top",
    selectedMode: false,
  },
  grid: {
    left: "5%",
    height: 250,
    bottom: 10,
    top: 40,
    right: 0,
  },
  series: data,
});

watch(data, () => {
  _refChart.value?.clear();
  _refChart.value?.setOption(option.value);
});

onBeforeMount(() => {
  window.addEventListener("resize", () => {
    _refChart.value?.resize();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    _refChart.value?.resize();
  });
  $bus.$off("resizeHeader");
});
</script>

<style scoped lang="scss">
@use "../../assets/scss/variables" as *;

.line-chart-vue {
  display: flex;
  align-items: flex-start;

  .title {
    width: 25px;
    margin-top: 40px;
    height: 200px;
    writing-mode: vertical-lr;
    text-orientation: sideways;
    color: $gray-text;
  }

  .chart-line {
    min-height: v-bind(height);
    width: 100%;
  }
}
</style>
