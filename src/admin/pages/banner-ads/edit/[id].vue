<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.banner_ads_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.banner_ads_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-banner :id="id" ref="_formRef"></form-banner>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="_formRef?.isLoadingAction"
            @click="editBanner"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "nuxt/app";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";

const route = useRoute();
const id = ref(null);
id.value = Number(route.params.id);
const _formRef = ref();

const editBanner = async () => {
  await _formRef.value?.updateBanner(_formRef.value?.formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end;
  }
}
</style>
