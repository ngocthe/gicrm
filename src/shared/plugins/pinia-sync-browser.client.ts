import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { Pinia } from "pinia";
export default function ({ $pinia }: { $pinia: Pinia }) {
  $pinia.use(piniaPluginPersistedstate);
}
