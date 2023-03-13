<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.notice_create") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.notice_create") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-notice ref="_formRef" class="form-category-add" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="_formRef?.isLoadingAction"
            @click="createNotice"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";

definePageMeta({
  name: "notices-create",
  title: "title_screen.create_notice",
});

const _formRef = ref();
const createNotice = async () => {
  await _formRef.value.createNotices(_formRef.value.formRef);
};
</script>

<style lang="scss" scoped>
:deep(.footer) .group-button {
  justify-content: flex-end;
}
</style>
