<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.profile") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.profile") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-profile ref="_formRef" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :disabled="_formRef?.upLoadImage"
            :loading="_formRef?.isLoadingSave"
            @click="saveProfile"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "../../../shared/components/button/CreateOrUpdate";

const _formRef = ref();
const loadingSave = ref(false);
const saveProfile = async () => {
  try {
    loadingSave.value = true;
    await _formRef.value.saveProfile(_formRef.value.formRef);
  } catch (e) {
    return e;
  } finally {
    loadingSave.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.content) {
  padding: 32px 32px 0 32px;
}

:deep(.footer) .group-button {
  justify-content: flex-end;
}
</style>
