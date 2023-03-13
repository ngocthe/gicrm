<template>
  <div>
    <div v-if="listMenu.length">
      <p>{{ $t("menu") }}： {{ getCourseMenuBooking("", listMenu) }}</p>
    </div>
    <p v-if="requestStaff">{{ $t("staff_nomination") }}：{{ staffName }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
interface Prop {
  staffName?: string;
  listMenu?: [];
  requestStaff?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  staffName: null,
  listMenu: null,
  requestStaff: 0,
});

toRefs(props);
</script>

<style scoped lang="scss">
.group-menu {
  padding-left: 10px;

  &__item {
    word-break: break-all;
  }
}
</style>
