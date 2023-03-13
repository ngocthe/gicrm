<template>
  <div :class="getClass()">
    <div v-if="!idCourse" class="list-course">
      <div v-for="item in data" :key="item.id" class="course-header">
        <div class="course-photo" @click="handleClickDetail(item.id)">
          <img
            v-if="item.model_has_file[0]?.file?.url"
            :src="item.model_has_file[0]?.file?.url"
            alt=""
          />
          <img v-else src="../../assets/images/default_store.svg" alt="" />
        </div>
        <div class="course-body">
          <div class="course-body__name" @click="handleClickDetail(item.id)">
            <span>◆</span>
            {{ item.name }}
          </div>
          <div class="course-body__compare">
            {{ item.contents }}
          </div>
          <div class="course-body__menu">
            <div
              v-if="
                (item.min_capacity || item.max_capacity) &&
                typeStore === RESTAURANT
              "
              class="course-body__menu-people"
            >
              <icon-people />
              <span>{{ item.min_capacity }}</span>
              <span v-if="item.max_capacity"
                >～{{ item.max_capacity }}{{ $t("people") }}</span
              >
            </div>
            <div class="course-body__menu-time">
              <icon-lock-blue />
              <span>{{ formatTime(item.start_time) }}</span>
              <span>～{{ formatTime(item.end_time) }}</span>
            </div>
            <div class="course-body__menu-money">
              <icon-money />
              <span class="money">{{ priceDisplay(item.price) }}</span>
              <span class="text-money"
                >{{ $t("yen") }} ({{ $t("tax_include") }})</span
              >
            </div>
          </div>
        </div>
        <div class="course-action">
          <button-red
            :name="$t('button.add_store')"
            @click="handleClick(item.id)"
          ></button-red>
          <ButtonCommon
            v-if="typeStore === SALON"
            :name="$t('button.add_menu')"
            background-color="#FEA497"
            border-radius="3px"
            color="#FFFFFF"
            @click="handleClickMenuCourse(item.id)"
          />
        </div>
      </div>
    </div>
    <div v-else class="detail-course">
      <div class="detail-course__header">
        <div class="detail-course__header-image">
          <img
            v-if="detailCourse?.model_has_file[0]?.file?.url"
            :src="detailCourse?.model_has_file[0]?.file?.url"
            alt=""
          />
          <img v-else src="../../assets/images/default_store.svg" alt="" />
        </div>
        <div class="detail-course__header-content">
          <div class="name">{{ detailCourse?.name }}</div>
          <div class="content">{{ detailCourse?.contents }}</div>
        </div>
      </div>
      <div class="detail-course__body">
        <div class="table-cell">
          <div class="detail-course__body-title">
            {{ $t("front.course_fee") }}
          </div>
          <div class="detail-course__body-content money">
            <span>{{ priceDisplay(detailCourse?.price) }}</span>
            <span>{{ $t("yen") }} ({{ $t("tax_include") }})</span>
          </div>
        </div>
        <div class="table-cell">
          <div class="detail-course__body-title">
            {{ $t("front.length_of_stay") }}
          </div>
          <div class="detail-course__body-content">
            {{ getTimeHours(detailCourse?.stay_time) }}
          </div>
        </div>
        <div class="table-cell">
          <div class="detail-course__body-title">
            {{ $t("front.course_content") }}
          </div>
          <div class="detail-course__body-content">
            {{ detailCourse?.contents }}
          </div>
        </div>
      </div>
      <div class="detail-course__footer">
        <ButtonCommon
          v-if="typeStore === SALON"
          :name="$t('button.add_menu')"
          background-color="#FEA497"
          border-radius="3px"
          color="#FFFFFF"
          @click="handleClickMenuCourse(detailCourse?.id)"
        />
        <button-red
          :name="$t('button.add_store')"
          @click="handleClick(detailCourse?.id)"
        ></button-red>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonRed from "../../../shared/components/button/ButtonRed.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { defineProps, toRefs } from "vue";
import priceDisplay from "../../../shared/utils/price";
import { Course } from "~/../../src/front/models";
import { formatTime } from "~/../../src/shared/utils/format";
import { getTimeHours } from "~/../../src/shared/utils/format";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";

interface Prop {
  data?: Course[];
  detailCourse?: Course;
  idCourse?: number;
  typeStore: number;
}

const props = defineProps<Prop>();

const { data, detailCourse, idCourse, typeStore } = toRefs(props);

const emits = defineEmits([
  "handleClick",
  "handleDetail",
  "handleClickMenuCourse",
]);

const handleClickDetail = (id) => {
  emits("handleDetail", id);
};

const handleClick = (id) => {
  emits("handleClick", id);
};

const handleClickMenuCourse = (id) => {
  emits("handleClickMenuCourse", id);
};

const getClass = () => {
  if (typeStore.value === SALON) {
    return "course-salon";
  }
  return "course";
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@mixin course-header {
  display: flex;
  border-bottom: 1px solid $grey-small-color;
  padding: 24px 0;
  flex-wrap: wrap;

  &:first-child {
    padding: 0 0 24px;
  }

  .course-photo {
    cursor: pointer;
    margin-right: 24px;
    width: 25%;

    :hover {
      opacity: 0.5;
    }

    img {
      width: 100%;
      object-fit: cover;
      height: 120px;
    }
  }
}

@mixin detail-course {
  .detail-course__header {
    display: flex;
    margin-bottom: 16px;

    .detail-course__header-image {
      width: 40%;
      margin-right: 24px;

      img {
        width: 100%;
        object-fit: cover;
      }
    }

    .detail-course__header-content {
      .name {
        font-weight: bold;
      }

      .content {
        white-space: pre-line;
      }
    }
  }

  .detail-course__body {
    .table-cell {
      display: flex;
      border-top: 1px solid $border-table;

      &:last-child {
        border-bottom: 1px solid $border-table;
      }

      .detail-course__body-title {
        display: flex;
        align-items: flex-start;
        width: 155px;
        padding: 12px;
        background-color: $grey-low-color;
      }

      .detail-course__body-content {
        padding: 12px;
        white-space: pre-line;
        width: calc(100% - 155px);
      }

      .money {
        font-weight: bold;
        color: $btn-red;
        font-size: 16px;
      }
    }
  }
}

@mixin detail-course-mobile {
  .detail-course__header {
    display: flex;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .detail-course__header-image {
      width: 100%;
      margin-right: 0;

      img {
        width: 100%;
        height: 260px;
        object-fit: cover;
      }
    }

    .detail-course__header-content {
      .name {
        font-weight: bold;
      }

      .content {
        white-space: pre-line;
      }
    }
  }

  .detail-course__body {
    .table-cell {
      display: flex;
      border-top: 1px solid $border-table;

      &:last-child {
        border-bottom: 1px solid $border-table;
      }

      .detail-course__body-title {
        display: flex;
        align-items: flex-start;
        width: 155px;
        padding: 12px;
        background-color: $grey-low-color;
      }

      .detail-course__body-content {
        padding: 12px;
        white-space: pre-line;
        width: calc(100% - 155px);
      }

      .money {
        font-weight: bold;
        color: $btn-red;
        font-size: 16px;
      }
    }
  }
}

@mixin course-body {
  .course-body__name {
    color: $black-85;
    font-weight: 600;
    cursor: pointer;
  }

  .course-body__compare {
    color: rgba(0, 0, 0, 0.6);
    white-space: pre-line;
  }

  .course-body__menu {
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    padding: 14px 0 22px;
    flex-wrap: wrap;

    .course-body__menu-people,
    .course-body__menu-time,
    .course-body__menu-money {
      display: flex;
      align-items: center;

      svg {
        margin-right: 5px;
      }
    }

    .course-body__menu-money {
      color: $red-color;
      font-size: 12px;

      .money {
        font-size: 18px;
        font-weight: 400;
        margin-right: 5px;
      }

      .text-money {
        font-size: 10px;
      }
    }
  }
}

.course {
  .list-course {
    .course-header {
      @include course-header;

      .course-body {
        width: calc(75% - 164px);

        @include course-body;
      }

      .course-action {
        width: 140px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

  .detail-course {
    @include detail-course;

    .detail-course__footer {
      display: flex;
      width: 100%;
      justify-content: center;
      margin: 24px 0;

      button {
        width: 224px;
      }
    }
  }
}

// SALON
.course-salon {
  .list-course {
    .course-header {
      @include course-header;

      .course-body {
        width: calc(75% - 164px);

        @include course-body;

        .course-body__menu {
          justify-content: flex-start;

          .course-body__menu-time {
            margin-right: 18px;
          }
        }
      }

      .course-action {
        display: block;
        float: right;
        width: 140px;

        .el-button {
          font-weight: 700;
          height: 32px;
          margin-top: 8px;
          float: right;
          width: 114px;
          font-size: 10px;
        }
      }
    }
  }

  .detail-course {
    @include detail-course;

    .detail-course__footer {
      display: flex;
      width: 100%;
      justify-content: center;
      margin: 24px 0;

      button {
        font-weight: 700;
        width: 224px;
      }
    }
  }
}

@include res("md-only", $breakpoints-spec) {
  .course {
    .list-course {
      .course-header {
        .course-photo {
          width: 100%;
          margin-right: 0;

          img {
            width: 100%;
            max-width: 300px;
            object-fit: cover;
            height: 120px;
          }
        }

        .course-body {
          width: 100%;

          .course-body__menu {
            display: flex;
            font-size: 12px;
            justify-content: space-between;
          }
        }

        .course-action {
          display: flex;
          justify-content: flex-start;
        }
      }
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .course {
    padding: 0;

    .list-course {
      .course-header {
        .course-photo {
          width: 100%;
          margin-bottom: 16px;

          img {
            width: 80%;
            object-fit: cover;
            height: 120px;
          }
        }

        .course-body {
          width: 100%;

          .course-body__menu {
            display: flex;
            font-size: 12px;
            justify-content: space-between;

            .course-body__menu-money {
              color: $red-color;
              font-size: 12px;

              .money {
                font-size: 18px;
                font-weight: 400;
                margin-right: 5px;
              }
            }
          }
        }

        .course-action {
          display: flex;
          justify-content: flex-start;
        }
      }
    }
  }

  //SALON

  .course-salon {
    padding: 0;

    .list-course {
      .course-header {
        .course-photo {
          width: 100%;
          margin-bottom: 16px;

          img {
            max-width: 300px;
            width: 100%;
            height: 120px;
          }
        }

        .course-body {
          width: 100%;
        }

        .course-action {
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .course {
    .list-course {
      padding: 0 16px;

      .course-header {
        .course-photo {
          width: 100%;

          img {
            max-width: 240px;
            width: 100%;
            height: 120px;
          }
        }

        .course-body {
          width: 100%;
        }

        .course-action {
          justify-content: flex-start;
        }
      }
    }

    .detail-course {
      @include detail-course-mobile;
    }
  }

  .course-salon {
    padding: 0 16px;

    .detail-course {
      @include detail-course-mobile;

      .detail-course__footer {
        button {
          width: 114px;
          font-size: 10px;
          height: 32px;
        }
      }
    }
  }
}

@media screen and (max-width: 420px) {
  .course-salon {
    padding: 0 16px;

    .list-course {
      .course-header {
        .course-photo {
          width: 100%;

          img {
            width: 100%;
            max-width: 240px;
            height: 120px;
          }
        }

        .course-body {
          width: 100%;

          .course-body__menu {
            justify-content: flex-start;

            .course-body__menu-time {
              margin-right: 18px;
            }
          }
        }

        .course-action {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 100%;

          .el-button {
            width: 114px;
          }
        }
      }
    }
  }
}
</style>
