<template>
  <div
    class="time-frame time-frame__salon"
    :start-time="props.data.start_time"
    :end-time="props.data.end_time"
    @click="handleClick"
    @mouseover="() => (isShowToolTip = true)"
    @mouseleave="() => (isShowToolTip = false)"
  >
    <div class="user-name">
      {{ props.data.reservation?.order_name }}
    </div>
    <div class="staff-number">
      {{
        `${t("number_of_people")}：${
          props.data.reservation.detail.number_people
        }${t("name_2")}`
      }}
    </div>
    <div v-show="props.data.reservation?.detail?.course?.name" class="course">
      {{
        `${t("store.course_name")}：${
          props.data.reservation?.detail?.course?.name
        }`
      }}
    </div>
    <div
      v-show="
        props.data.reservation?.detail?.menu_details &&
        props.data.reservation?.detail?.menu_details.length > 0
      "
      class="menu"
    >
      {{
        `${t(
          "store.menu_title"
        )}：${props.data.reservation?.detail?.menu_details
          ?.map((item) => item.menu.name)
          .join("、 ")}`
      }}
    </div>
    <!-- START Tooltip -->
    <div v-show="isShowToolTip" class="tooltip">
      <div class="user-name">
        {{ props.data.reservation?.order_name }}
      </div>
      <div class="staff-number">
        {{
          `${t("number_of_people")}：${
            props.data.reservation.detail.number_people
          }${t("name_2")}`
        }}
      </div>
      <div v-show="props.data.reservation?.detail?.course?.name" class="course">
        {{
          `${t("store.course_name")}：${
            props.data.reservation?.detail?.course?.name
          }`
        }}
      </div>
      <div
        v-show="
          props.data.reservation?.detail?.menu_details &&
          props.data.reservation?.detail?.menu_details.length > 0
        "
        class="menu"
      >
        {{
          `${t(
            "store.menu_title"
          )}：${props.data.reservation?.detail?.menu_details
            ?.map((item) => item.menu.name)
            .join("、 ")}`
        }}
      </div>
    </div>
    <!-- END Tooltip -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "nuxt/app";
import { ReservationSalon } from "../../../models/reservation";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

type PropsType = {
  data: ReservationSalon;
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
