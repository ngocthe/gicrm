<template>
  <CalendarScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("reservations") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          {{
            reservationStore.appearance === Appearance.calendar
              ? $t("store.calendar")
              : $t("reservations")
          }}</template
        >
        <template #button>
          <el-button
            v-if="reservationStore.appearance === Appearance.list"
            class="btn__add"
            @click="addNewReservation"
          >
            <IconAddCircle />
            <span>
              {{ t("create_new") }}
            </span>
          </el-button>
          <el-button
            :icon="IconCalendar"
            :class="[
              { active: reservationStore.appearance === Appearance.calendar },
            ]"
            @click="() => changeAppearance(Appearance.calendar)"
          ></el-button>
          <el-button
            :icon="IconList"
            :class="[
              { active: reservationStore.appearance === Appearance.list },
            ]"
            @click="() => changeAppearance(Appearance.list)"
          ></el-button>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div
        v-if="reservationStore.appearance === Appearance.calendar"
        class="h-100 w-100"
      >
        <HeadCalendar />
        <BodyCalendar />
      </div>
      <div
        v-else-if="reservationStore.appearance === Appearance.list"
        class="h-100 w-100"
      >
        <HeadCalendar :is-calling-api="_refListReservation?.isLoadingTable" />
        <ListReservation ref="_refListReservation" />
      </div>
    </template>
  </CalendarScreenComponent>
</template>

<script lang="ts" setup>
import { i18n } from "../../../shared/plugins/i18n";
import IconAddCircle from "../../components/Icon/IconAddCircle.vue";
import ListReservation from "../../components/reservations/ListReservation.vue";
import HeadCalendar from "../../components/reservations/HeadCalendar.vue";
import BodyCalendar from "../../components/reservations/BodyCalendar.vue";
import IconCalendar from "../../components/Icon/IconCalendar.vue";
import IconList from "../../components/Icon/IconList.vue";

import { useReservation } from "../../store/useReservation";
import { Appearance } from "../../constants";
import { useRouter } from "#imports";
import { ref } from "vue";

const { t } = i18n.global;
const reservationStore = useReservation();
const router = useRouter();
const _refListReservation = ref();

const changeAppearance = (value: Appearance) => {
  reservationStore.setAppearance(value);
};

const addNewReservation = () => {
  router.push({ name: "reservation-create" });
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss";

:deep() {
  .header-content {
    .group-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .el-button {
        border: none;
        background-color: transparent;
        margin: 0px;
        padding: 0px;
        width: 24px;
        height: 24px;

        .el-icon {
          width: 24px;
          height: 24px;
          svg {
            width: 24px;
            height: 24px;
            path {
              fill: black;
            }
          }
        }

        + .el-button {
          margin-left: 16px;
        }

        &.active {
          .el-icon {
            svg {
              path {
                fill: variables.$menuBg;
              }
            }
          }
        }

        &.btn__add {
          height: 40px;
          width: 122px;
          background-color: variables.$green-medium-color;
          color: white;

          span {
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
