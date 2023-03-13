import { useRouter } from "nuxt/app";
import { ref } from "vue";
import { useMeStore } from "../stores/me";

export default function useHavePermission(perm: string, routerBack = true) {
  const router = useRouter();
  const me = useMeStore();
  const hasPerm = ref(false);

  if (me.permissions?.includes(perm)) {
    hasPerm.value = true;
  } else {
    console.warn(`have not permission ${perm}`);
    // TODO: need work more
    // router.back();
  }

  return hasPerm;
}
