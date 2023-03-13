<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("store.basic_info") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("store.basic_info") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormStore ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonLightBlue
            :name="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            :disabled="_refForm?.loadingAvatar"
            @click="handleUpdate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";

const _refForm = ref();

const handleUpdate = async () => {
  await _refForm.value.UpdateStore(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
