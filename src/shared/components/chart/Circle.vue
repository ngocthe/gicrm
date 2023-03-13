<template>
  <div>
    <client-only>
      <v-chart
        v-if="checkData"
        ref="_refCircle"
        class="chart"
        :option="option"
      />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import VChart from "vue-echarts";
import { ref, toRefs, watch, computed } from "vue";

const _refCircle = ref(null);

interface Prop {
  dataTitle: any[];
  data: any[];
  height: string;
  name: string;
  color?: string[];
}
const props = withDefaults(defineProps<Prop>(), {
  height: "320px",
  color: () => [
    "#7CB342",
    "#03A9F4",
    "#d234eb",
    "#F44336",
    "#3F51B5",
    "#fc781d",
    "#33415c",
  ],
});

const { dataTitle, data, height, name, color } = toRefs(props);
const checkData = computed(() => {
  let total = 0;
  data.value.filter((item: any) => {
    total += item.value;
  });
  return total !== 0;
});

const option = ref({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    right: "left",
    top: "center",
    data: dataTitle,
    itemGap: 20,
    selectedMode: false,
  },
  xAxis: {
    show: false,
    lineStyle: {
      type: "solid",
    },
  },
  series: [
    {
      name: name.value,
      type: "pie",
      left: "0",
      width: "320px",
      height: height,
      radius: ["40%", "80%"],
      label: {
        show: false,
      },
      data: data,
      color: color.value,
    },
  ],
});

watch(data, () => {
  _refCircle.value?.clear();
  _refCircle.value?.setOption(option.value);
});
</script>

<style scoped lang="scss">
.chart {
  width: 500px;
  height: v-bind(height);
}
</style>
