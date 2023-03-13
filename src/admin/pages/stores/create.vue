<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") + $t("title_screen.store_create") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.store_create") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormStore ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="_refForm?.isLoadingAction"
            :disabled="_refForm?.loadingAvatar"
            :title="$t('register')"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import { ref } from "vue";

const _refForm = ref();

const handleCreate = async () => {
  await _refForm.value.createOrUpdateStore(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end;
  }
}
</style>
