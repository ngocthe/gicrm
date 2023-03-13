<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("store.course_create") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("store.course_create") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-course ref="_formRef" @change-loading-data="updateLoading" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <div />
          <ButtonCreateOrUpdate
            title="button.save"
            :loading="loading"
            @click="createCourse"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";

useHasTypeStore([RESTAURANT, SALON]);

const loading = ref(false);
const _formRef = ref();

const createCourse = async () => {
  await _formRef.value.createCourse(_formRef.value.formRef);
};

const updateLoading = (value) => {
  loading.value = value;
};
</script>

<style lang="scss" scoped></style>
