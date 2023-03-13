<template>
  <div
    class="time-frame time-frame__restaurant"
    :start-time="props.data.start_time"
    :end-time="props.data.end_time"
    @click="handleClick"
    @mouseover="() => (isShowToolTip = true)"
    @mouseleave="() => (isShowToolTip = false)"
  >
    <div class="user-name">
      {{ props.data.reservation?.order_name }}
    </div>
    <div class="seat-number">
      {{
        `${t("number_of_people")}：${
          Number(props.data.reservation.detail.number_adult) +
          Number(props.data.reservation.detail.number_children)
        }${t("name_2")}`
      }}
    </div>
    <div class="course">
      {{
        `${t("store.course_name")}：${
          props.data.reservation?.detail?.course?.name
        }`
      }}
    </div>
    <!-- START Tooltip -->
    <div v-show="isShowToolTip" class="tooltip">
      <div class="user-name">
        {{ props.data.reservation?.order_name }}
      </div>
      <div class="seat-number">
        {{
          `${t("number_of_people")}：${
            Number(props.data.reservation.detail.number_adult) +
            Number(props.data.reservation.detail.number_children)
          }${t("name_2")}`
        }}
      </div>
      <div class="course">
        {{
          `${t("store.course_name")}：${
            props.data.reservation?.detail?.course?.name
          }`
        }}
      </div>
    </div>
    <!-- END Tooltip -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ReservationRestaurant } from "../../../models/reservation";
import { useI18n } from "vue-i18n";
import { useRouter } from "nuxt/app";

const { t } = useI18n();
const router = useRouter();

type PropsType = {
  data: ReservationRestaurant;
};

const props = defineProps<PropsType>();
const isShowToolTip = ref<boolean>(false);

const handleClick = () => {
  router.push({
    name: "reservation-detail-id",
    params: { id: props.data.reservation_id },
  });
};
</script>

<style lang="scss" scoped>
@use "./day.scss";
</style>
