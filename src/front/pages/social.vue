<template>
  <div v-loading="loading" class="social"></div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, ref } from "vue";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { useCookie, useRoute, useRouter } from "#imports";
import { useMeStore } from "~/../../src/shared/stores/me";
import { BOOKING_SOURCE } from "~/../../src/shared/constants/reservation";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";

const loading = ref(true);
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
const meStore = useMeStore();
const router = useRouter();
const route = useRoute();
const bookingSource = useCookie(persistKeys.BOOKING_SOURCE);
const redirect = useCookie(persistKeys.REDIRECT);
const storeBooking = useCookie(persistKeys.STORE_LINE);
const typeBooking = useCookie(persistKeys.STORE_TYPE);

const handleReceiveCallback = async (e: any) => {
  loading.value = true;
  const data = JSON.parse(e);

  if (
    data.source &&
    (!bookingSource.value ||
      Number(bookingSource.value) !== BOOKING_SOURCE.LINE)
  ) {
    bookingSource.value = data.source;
  }

  if (data.token) {
    cookieToken.value = data.token;
    await nextTick(async () => {
      await meStore.fetchUpdate();
    });
    if (
      data.source &&
      Number(bookingSource.value) === BOOKING_SOURCE.LINE &&
      data.store_id
    ) {
      storeBooking.value = data.store_id;
      if (data.store_type && Number(data.store_type) === SALON) {
        typeBooking.value = data.store_type;
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
            query: {
              tab: menuRestaurant.COURSE_MENU,
              menu: menuRestaurant.COURSE_MENU,
            },
          });
        });
      } else if (data.store_type && Number(data.store_type) === RESTAURANT) {
        typeBooking.value = data.store_type;
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
            query: {
              tab: menuRestaurant.COURSE_MENU,
              menu: menuRestaurant.COURSE_MENU_TAB_COURSE,
            },
          });
        });
      } else {
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
          });
        });
      }
      return;
    }
    if (redirect.value) {
      await router.push(redirect.value);
      redirect.value = null;
    } else {
      await router.push({ path: "/" });
    }
  }
  // else if (data.sns_info) {
  //   localStorage.setItem(persistKeys.SNS_INFO, JSON.stringify(data.sns_info));
  //   await router.push({
  //     path: `/register`,
  //     query: { from: persistKeys.SNS_INFO },
  //   });
  // }
};

onBeforeMount(async () => {
  if (route.query.data) {
    await handleReceiveCallback(route.query.data);
  }
});
</script>

<style lang="scss" scoped>
.social {
  height: 100vh;
  justify-content: center;
  display: flex;
  width: 100%;
}
</style>
