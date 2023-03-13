<template>
  <div ref="_wrapper">
    <div :key="tableKey">
      <slot name="tableName" :set-ref="setSlotRef"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sortable from "sortablejs";
import { defineProps, toRefs, onMounted, watch, nextTick } from "vue";

interface Prop {
  handle: string;
  animate: number;
}
const props = withDefaults(defineProps<Prop>(), {
  handle: "",
  animate: 100,
});
const _wrapper = ref(null);
const tableKey = ref(0);
const slotRef = ref(null);
const setSlotRef = (el) => {
  slotRef.value = el;
};

const { handle, animate } = toRefs(props);

import { ref } from "vue";

const emits = defineEmits(["drop", "drag", "changeIndex"]);

const makeTableSortAble = () => {
  const table = slotRef.value.$el.querySelector(
    ".el-table__body-wrapper tbody"
  );
  Sortable.create(table, {
    handle: handle.value,
    animation: animate.value,
    onStart: () => {
      emits("drag");
    },
    onEnd: ({ newIndex, oldIndex }) => {
      keepWrapperHeight(true);
      tableKey.value = Math.random();
      const arr = slotRef.value.data;
      const id = arr[oldIndex].id;
      const index = arr[newIndex].index;
      const targetRow = arr.splice(oldIndex, 1)[0];
      arr.splice(newIndex, 0, targetRow);
      if (newIndex !== oldIndex) {
        emits("changeIndex", { id: id, index: index });
        emits("drop", { targetObject: targetRow, list: arr });
      }
    },
  });
};

const keepWrapperHeight = (keep) => {
  if (keep) {
    _wrapper.value.style.minHeight = `${_wrapper.value.clientHeight}px`;
  } else {
    _wrapper.value.style.minHeight = "auto";
  }
};

onMounted(() => {
  makeTableSortAble();
});

watch(tableKey, () => {
  nextTick(() => {
    makeTableSortAble();
    keepWrapperHeight(false);
  });
});
</script>

<style lang="scss" scoped>
.drag-container {
  display: inline-block;
  width: 100%;
}

.empty-checked {
  margin: 0;
  color: #f56c6c;
  font-size: 12px;
}

::v-deep.drag-table {
  width: 100%;
  border: 1px solid #d0d0d0;

  .el-form-item {
    margin-bottom: 0;
  }

  .is-error {
    margin-bottom: 22px;
  }

  th.el-table__cell.is-leaf {
    border-bottom: 1px solid #d0d0d0;
  }

  td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #d0d0d0;
  }

  .el-table__cell,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #d0d0d0;
  }

  .el-table__cell {
    padding: 8px 0;
  }

  .el-table__header {
    tr {
      th {
        background-color: #dfeef3;
        height: 35px;
        color: #333333;
        padding: 2px;
        text-align: center;
        font-size: 14px;

        .el-checkbox {
          display: none;
        }
      }
    }
  }

  .el-table__row {
    font-size: 16px;
    td:last-child {
      background: #f7f7f7;
    }
  }

  .el-input__inner {
    background: #f7f7f7;
    height: 45px;
    font-size: 16px;
  }

  .input-price {
    display: inline;
    margin-right: 6px;
    width: 92px;
    height: 45px;
    border: 1px solid #acacac;
    border-radius: 4px;
    text-align: right;
    padding-right: 8px;
    font-size: 16px;
    color: #333333;
  }

  .input-price:focus {
    outline: none;
  }

  .remove {
    font-size: 18px;
    cursor: pointer;
  }

  .handle {
    cursor: grabbing;

    svg {
      font-size: 28px;
    }
  }
}

.summary {
  border: 1px solid #d0d0d0;
  margin: 0;
  padding: 13px;
  border-top: 0;
  display: flex;
  font-size: 16px;
  justify-content: space-between;

  p {
    margin: 0;
    font-weight: bold;
  }

  .price-detail {
    display: flex;
  }
}

.btn-add {
  font: normal normal bold 14px/24px Noto Sans JP;
  letter-spacing: 0.42px;
  color: #368ea8;
  opacity: 1;
  width: 131px;
  height: 45px;
  border: 1px solid #b7b7b7;
  border-radius: 3px;
  padding: 0;
  margin-top: 28px;
  float: right;
}
</style>
