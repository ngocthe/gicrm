import { useRouter } from "#imports";
import { ref } from "vue";
import { useMeStore } from "../stores/me";

export default function useHasTypeStore(typeStore: number[]) {
  const router = useRouter();
  const meStore = useMeStore();
  const hasPerm = ref(false);

  if (typeStore.includes(meStore.typeStore)) {
    hasPerm.value = true;
    return hasPerm;
  }
  return router.push({ name: "403" });
}
