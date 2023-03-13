import { defineStore } from "pinia";
import { User } from "../models";

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore("user", {
  state: () =>
    ({
      user: null,
    } as UserState),
});
