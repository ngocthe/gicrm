import IconFacebook from "~/../../src/shared/components/icon/Facebook.vue";
import IconGoogle from "~/../../src/shared/components/icon/Google.vue";
import IconYahoo from "~/../../src/shared/components/icon/Yahoo.vue";
import IconTwitter from "~/../../src/shared/components/icon/Twitter.vue";
import IconLine from "~/../../src/shared/components/icon/Line.vue";
import { TYPE } from "~/../../src/shared/constants/typeLogin";

import { shallowRef } from "vue";
const iconLogin = shallowRef();

export const checkIconLogin = (typeLogin) => {
  if (typeLogin == TYPE.SYSTEM) {
    return (iconLogin.value = "");
  }

  if (typeLogin == TYPE.GOOGLE) {
    return (iconLogin.value = IconGoogle);
  }

  if (typeLogin == TYPE.FACE_BOOK) {
    return (iconLogin.value = IconFacebook);
  }

  if (typeLogin == TYPE.TWITTER) {
    return (iconLogin.value = IconTwitter);
  }

  if (typeLogin == TYPE.LINE) {
    return (iconLogin.value = IconLine);
  }

  if (typeLogin == TYPE.YAHOO) {
    return (iconLogin.value = IconYahoo);
  }
};
