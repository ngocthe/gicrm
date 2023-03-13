<template>
  <div class="detail-staff">
    <div
      class="staff-content-image"
      @click="showImage(staff?.image?.file?.url)"
    >
      <img
        v-if="staff?.image?.file?.url"
        :src="staff?.image?.file?.url"
        alt=""
      />
      <img v-else src="../../assets/images/default_store.svg" alt="" />
    </div>
    <div class="staff-content-title">{{ staff?.name }}</div>
    <div class="staff-content-name">
      <div class="stylist">
        <el-popover
          placement="top-start"
          trigger="hover"
          width="250px"
          :teleported="false"
          :title="staff.position"
        >
          <template #reference>
            <div class="notice-content">
              {{ staff?.position }}
            </div>
          </template>
        </el-popover>
      </div>
      <div v-if="staff?.year_works" class="experience">
        （{{ $t("history") }} {{ staff?.year_works }}{{ $t("year") }}）
      </div>
    </div>
    <div class="staff-content-mark">
      <el-popover
        placement="top-start"
        trigger="hover"
        width="250px"
        :title="staff.info"
        :teleported="false"
      >
        <template #reference>
          <div class="notice-content">
            {{ staff?.info }}
          </div>
        </template>
      </el-popover>
    </div>
    <div class="hr"></div>
    <div class="staff-content-action">
      <ButtonRed
        :name="$t('button.nominate_and_book')"
        @click="handleClick(staff?.id)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { StaffModel } from "~/../../src/front/models";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
interface Prop {
  staff: StaffModel;
}
const props = defineProps<Prop>();
const { staff } = toRefs(props);
const emits = defineEmits(["handleClickStaff", "showImage"]);

const showImage = (url) => {
  emits("showImage", url);
};

const handleClick = (id) => {
  emits("handleClickStaff", id);
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;

.detail-staff {
  .staff-content-image {
    width: 100%;
    cursor: pointer;

    img {
      width: 100%;
      cursor: pointer;
      object-fit: cover;
      height: 226px;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  .staff-content-title {
    text-align: center;
    font-weight: bold;
    width: 100%;
    margin-top: 8px;
  }

  .staff-content-name {
    font-size: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 20px;

    .stylist {
      color: $red-40;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      max-width: 60%;
    }
  }

  .staff-content-mark {
    height: 60px;
    text-align: center;
    line-height: 22px;
    white-space: pre-line;
    width: 100%;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-box;
  }

  .hr {
    margin-top: 16px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.5);
    opacity: 0.5;
  }

  .staff-content-action {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    justify-items: center;

    .el-button {
      font-size: 10px;
      height: 32px;
      font-weight: 700;
    }
  }
}
</style>
