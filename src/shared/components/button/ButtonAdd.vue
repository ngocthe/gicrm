<template>
  <div>
    <button-green :name="name" :loading="loading" @click="onclick">
      <template #icon>
        <IconPlus />
      </template>
    </button-green>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import IconPlus from "../../../store/components/Icon/Plus";
import ButtonGreen from "../../../shared/components/button/ButtonGreen.vue";

interface Prop {
  name?: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  name: "",
  loading: false,
});
const { name, loading } = toRefs(props);
const emits = defineEmits(["click"]);

const onclick = () => {
  emits("click");
};
</script>
