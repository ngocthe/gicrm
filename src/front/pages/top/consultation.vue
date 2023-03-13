<template>
  <Head>
    <Title>{{ $t("site_name_title") }}{{ $t("title_screen.top") }}</Title>
  </Head>
  <ComingSoon></ComingSoon>
</template>

<script lang="ts" setup>
import { onMounted } from "#imports";
import ComingSoon from "../../components/pages/home/ComingSoon.vue";
import scrollToTop from "~/../../src/shared/utils/scroll";

onMounted(() => {
  scrollToTop();
});
</script>
