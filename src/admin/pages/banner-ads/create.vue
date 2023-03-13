<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.banner_ads_create") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.banner_ads_create") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-banner ref="_formRef"></form-banner>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="_formRef?.isLoadingAction"
            @click="createBanner"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";

const _formRef = ref();
const isLoadingAction = ref(false);

const createBanner = async () => {
  try {
    isLoadingAction.value = true;
    await _formRef.value.createBanner(_formRef.value.formRef);
  } catch (e) {
  } finally {
    isLoadingAction.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.footer) .group-button {
  justify-content: flex-end;
}
</style>
