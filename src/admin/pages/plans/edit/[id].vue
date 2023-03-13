<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.detail_plan") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.detail_plan") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormPlan :id="id" ref="_formRef" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            v-if="isEdit"
            :loading="_formRef?.isLoadingAction"
            :title="$t('button.save')"
            @click="savePlans"
          />
          <ButtonCreateOrUpdate v-else :title="$t('to_edit')" @click="toEdit" />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "nuxt/app";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";

definePageMeta({
  name: "plans-edit-id",
  title: "title_screen.detail_plan",
});

const route = useRoute();

const _formRef = ref();
const isEdit = ref(false);
const id = ref(Number(route.params.id));

const toEdit = () => {
  isEdit.value = true;
  _formRef.value.toEditPlans();
};

const savePlans = async () => {
  await _formRef.value.editPlans(_formRef.value.formRef);
};
</script>

<style lang="scss" scoped>
:deep(.footer) .group-button {
  justify-content: flex-end;
}
</style>
