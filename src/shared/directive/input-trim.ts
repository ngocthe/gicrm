export const vInputTrim = {
  mounted: async (el: Element) => {
    let inputEl;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      inputEl = el;
    } else {
      inputEl =
        el.getElementsByTagName("input")[0] ||
        el.getElementsByTagName("textarea")[0];
    }
    if (!inputEl) {
      return;
    }

    function dispatch(el, type) {
      const e = document.createEvent("HTMLEvents");
      e.initEvent(type, true, false);
      el.dispatchEvent(e);
    }
    inputEl.addEventListener("blur", () => {
      inputEl.value = inputEl.value.trim();
      dispatch(inputEl, "input");
    });
  },
};
