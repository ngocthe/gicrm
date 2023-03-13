import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from "echarts/components";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  use([
    CanvasRenderer,
    LineChart,
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    PieChart,
    MarkLineComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
  ]);
});
