<template>
  <div id="main-form" v-loading="!isMounted" class="main-form">
    <div v-if="isMounted">
      <el-form
        ref="_formRef"
        :model="formData"
        label-position="left"
        label-width="180px"
        :inline-message="true"
        require-asterisk-position="right"
        :rules="ruleStore"
      >
        <div class="form-data">
          <div class="left">
            <el-form-item
              v-if="route.params?.id"
              :label="$t('id_store')"
              class="align-items-center"
            >
              <el-input :model-value="storeDetail?.id" disabled />
            </el-form-item>
            <!-- START Store code -->
            <el-form-item
              v-if="route.params?.id"
              :label="$t('store_code')"
              class="align-items-center store-code"
              prop="prefixCode"
              :error="getError('code')"
            >
              <InputCodeStore
                v-model:prefixCode="formData.prefixCode"
                :suffix-code="suffixCode"
              />
            </el-form-item>
            <!-- END Store code -->
            <!-- START Agent code -->
            <el-form-item
              prop="agent_code"
              :error="getError('agent_code')"
              :label="$t('agent_code')"
              class="align-items-center"
            >
              <InputText
                v-model="formData.agent_code"
                :placeholder="$t('placeholder.agent_code')"
              />
            </el-form-item>
            <!-- END Agent code -->
            <!-- START Store name -->
            <el-form-item
              :label="$t('store_name')"
              required
              prop="name"
              :error="getError('name')"
              class="align-items-center"
            >
              <InputText
                v-model="formData.name"
                :placeholder="$t('placeholder.store_name')"
                :maxlength="MAX_LENGTH_STORE_NAME"
              />
            </el-form-item>
            <!-- END Store name -->
            <el-form-item
              :label="$t('industry')"
              required
              prop="type_store_id"
              :error="getError('type_store_id')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  v-model="formData.type_store_id"
                  class="w-100"
                  placeholder=""
                  :disabled="!!storeDetail"
                  @change="handleChangeTag"
                >
                  <el-option
                    v-for="typeStore in filterDataTypeStore"
                    :key="typeStore.id"
                    :label="typeStore.name"
                    :value="typeStore.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!--START Name Company-->
            <el-form-item :label="$t('corporate_name')" required>
              <div class="company">
                <el-row :gutter="12" class="mb-12">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('first_name_kanji')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('first_company_name')"
                      prop="first_company_name"
                    >
                      <InputText
                        v-model="formData.first_company_name"
                        :maxlength="MAX_LENGTH_FIRST_NAME"
                        :placeholder="$t('placeholder.first_name')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('last_name_kanji')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('last_company_name')"
                      prop="last_company_name"
                    >
                      <InputText
                        v-model="formData.last_company_name"
                        :maxlength="MAX_LENGTH_LAST_NAME"
                        :placeholder="$t('placeholder.last_name')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('sur_name')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('first_company_name_kana')"
                      prop="first_company_name_kana"
                    >
                      <InputText
                        v-model="formData.first_company_name_kana"
                        :maxlength="MAX_LENGTH_FIRST_NAME"
                        :placeholder="$t('placeholder.first_name_kana')"
                        @input="
                          formatInputKatakana(
                            $event,
                            'first_company_name_kana',
                            _formRef
                          )
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('may_name')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('last_company_name_kana')"
                      prop="last_company_name_kana"
                    >
                      <InputText
                        v-model="formData.last_company_name_kana"
                        :maxlength="MAX_LENGTH_LAST_NAME"
                        :placeholder="$t('placeholder.last_name_kana')"
                        @input="
                          formatInputKatakana(
                            $event,
                            'last_company_name_kana',
                            _formRef
                          )
                        "
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <!--END Name company-->
            <el-form-item
              :label="$t('email_address')"
              required
              :error="getError('email')"
              prop="email"
              class="align-items-center"
            >
              <InputText
                v-model="formData.email"
                :placeholder="$t('placeholder.email')"
                :maxlength="MAX_LENGTH_EMAIL"
                :disabled="!!storeDetail"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
              />
            </el-form-item>
            <el-form-item
              required
              label-width="auto"
              class="email-notice"
              :error="getError('email_for_notification_reception')"
              prop="email_for_notification_reception"
            >
              <div class="required-field label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("email_address") }}</p>
                  <p>({{ $t("receive_notice") }})</p>
                </div>
              </div>
              <div class="input-email">
                <InputText
                  v-model="formData.email_for_notification_reception"
                  :placeholder="
                    $t('placeholder.email_for_notification_reception')
                  "
                  :maxlength="MAX_LENGTH_EMAIL"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                />
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              required
              :error="getError('phone_number')"
              prop="phone_number"
              class="align-items-center"
            >
              <InputPhone v-model="formData.phone_number" />
            </el-form-item>
            <el-form-item
              :label="$t('postal_code')"
              prop="postal_code"
              :error="getError('postal_code')"
              class="align-items-center"
            >
              <div class="d-flex w-100 post-code">
                <InputCode v-model="formData.postal_code"></InputCode>
                <button-common
                  :icon="Search"
                  background-color="#0071BC"
                  class="btn-search-address"
                  name="search_address"
                  color="white"
                  width="128px"
                  :loading="loadingSearch"
                  :disabled="!formData.postal_code"
                  @click="handleSearchAddress"
                />
              </div>
            </el-form-item>
            <!-- START Address -->
            <el-form-item :label="$t('address')" class="align-items-center">
              <div class="w-100">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item :error="getError('address')">
                      <InputText
                        v-model="formData.address"
                        :placeholder="$t('placeholder.first_address')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :error="getError('address_detail')">
                      <InputText
                        v-model="formData.address_detail"
                        :placeholder="$t('placeholder.second_address')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <!-- END Address -->
            <!-- START Coordinates -->
            <el-form-item
              :label="$t('store_location')"
              class="align-items-start"
            >
              <div class="w-100 coordinates">
                <el-row :gutter="12">
                  <!-- START Latitude -->
                  <el-col :span="12">
                    <el-form-item :error="getError('latitude')">
                      <InputCoordinate
                        v-model="formData.latitude"
                        :placeholder="$t('latitude')"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- END Latitude -->
                  <!-- START Longitude -->
                  <el-col :span="12">
                    <el-form-item :error="getError('longitude')">
                      <InputCoordinate
                        v-model="formData.longitude"
                        :placeholder="$t('longitude')"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- END Longitude -->
                </el-row>
              </div>
              <a
                class="text-guide"
                target="_blank"
                :href="useAssetsFile('HTML_Google_Map.pdf')"
                >{{ $t("guide_link") }}</a
              >
            </el-form-item>
            <!-- END Coordinates -->
            <!-- START: Link google map -->
            <el-form-item label-width="auto" class="email-notice input-map">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("google_map_link") }}</p>
                </div>
              </div>
              <el-form-item
                class="w-100 form-item-map"
                :error="getError('link_google_map')"
                prop="link_google_map"
              >
                <div class="d-flex input post-code align-items-center flex-1">
                  <InputText
                    v-model="formData.link_google_map"
                    :placeholder="$t('placeholder.google_map_link')"
                  />
                  <a
                    class="text-guide"
                    target="_blank"
                    href="https://jp.ar-xia.com/google-map-link/"
                  >
                    {{ $t("guide_link") }}
                  </a>
                </div>
              </el-form-item>
            </el-form-item>
            <!-- END Link google map -->
            <!-- START Iframe google map -->
            <el-form-item label-width="auto" class="email-notice input-map">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("google_map") }}</p>
                </div>
              </div>
              <el-form-item
                class="w-100 form-item-map"
                :error="getError('iframe_google_map')"
                prop="iframe_google_map"
              >
                <div class="d-flex input post-code align-items-center flex-1">
                  <InputText
                    v-model="formData.iframe_google_map"
                    :placeholder="$t('placeholder.google_map')"
                    :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                  ></InputText>
                  <a
                    class="text-guide"
                    target="_blank"
                    href="https://jp.ar-xia.com/google-map-iframe/"
                    >{{ $t("guide_link") }}</a
                  >
                </div>
              </el-form-item>
            </el-form-item>
            <!-- END Iframe google map -->

            <!-- START Image -->
            <el-form-item
              :label="$t('image')"
              class="image"
              :error="getError('image')"
            >
              <InputFile
                v-loading="loadingAvatar"
                :data="imagesUpload"
                :limit="limitImage"
                :placeholder="$t('store.placeholder_category_description')"
                @handle-remove-image="handleRemoveImage"
                @handle-change-image="handleImageChange"
              />
            </el-form-item>
            <!-- END Image -->
            <!-- START Area -->
            <el-form-item :label="$t('area')" class="align-items-center">
              <el-input
                v-model="formData.area"
                v-input-trim
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('area')"
                clearable
              />
            </el-form-item>
            <!-- END Area -->
            <el-form-item :label="$t('transport')" class="align-items-center">
              <el-input
                v-model="formData.transportation"
                v-input-trim
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('placeholder.transport')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('genre')"
              class="align-items-center"
              :error="getError('tag')"
            >
              <ClientOnly>
                <SelectTag
                  v-model="formData.tag"
                  prop-key="id"
                  :options="tags"
                  value="name"
                  label="name"
                  :placeholder="$t('placeholder.enter_genre')"
                />
              </ClientOnly>
            </el-form-item>
            <el-form-item
              :label="$t('introduction2')"
              class="align-items-center"
            >
              <el-input
                v-model="formData.introduction"
                v-input-trim
                :placeholder="$t('placeholder.enter_introduction')"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('explanatory_text')">
              <el-input
                v-model="formData.description"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="$t('placeholder.enter_description')"
                :maxlength="MAX_LENGTH_DESCRIPTION"
              />
            </el-form-item>
            <el-form-item :label="$t('news')" class="align-items-center">
              <el-input
                v-model="formData.news"
                v-input-trim
                :placeholder="
                  $t('placeholder.within_character', {
                    max: MAX_LENGTH_DEFAULT,
                  })
                "
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('notes')">
              <el-input
                v-model="formData.note"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="
                  $t('placeholder.within_character', {
                    max: MAX_LENGTH_DEFAULT_TEXTAREA,
                  })
                "
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
              />
            </el-form-item>
          </div>
          <div class="right">
            <!--Home Page-->
            <el-form-item
              :label="$t('home_page')"
              prop="home_page"
              :error="getError('home_page')"
              class="align-items-center"
            >
              <el-input
                v-model="formData.home_page"
                v-input-trim
                :placeholder="$t('placeholder.home_page')"
                class="domain"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              >
              </el-input>
            </el-form-item>
            <!--END Home Page-->
            <!--WORKING DAY-->
            <el-form-item :label="$t('front.business_hour')">
              <!--Time Working-->
              <el-form-item
                :error="getError('opening_times')"
                prop="opening_times"
              >
                <div
                  v-for="item in WORKING_DAYS"
                  :key="item.value"
                  class="business-hours"
                >
                  <div class="day">
                    <div class="label">{{ item.label }}</div>
                    <el-checkbox
                      v-model="arrayCheckDayOff[item.value]"
                      :label="$t('holiday_check')"
                      :true-label="1"
                      :false-label="0"
                      @change="changeWorkingDay($event, item.value)"
                    />
                  </div>
                  <div
                    v-if="
                      !checkListTimeHoliday.includes(item.value) &&
                      !arrayCheckDayOff[item.value]
                    "
                    class="hours d-flex flex-column"
                  >
                    <div
                      v-for="(time, index) in getOpenTimeOfDay(item.value)"
                      :key="index"
                    >
                      <div class="d-flex align-items-center">
                        <div class="flex-2">
                          <TimeRanger
                            v-model:start-time="time.start"
                            v-model:end-time="time.end"
                          />
                          <p class="error-validate">
                            {{
                              getError(
                                `opening_times.${findIndexWorkingTime(
                                  item.value,
                                  index
                                )}.start`
                              )
                            }}
                          </p>
                          <p class="error-validate">
                            {{
                              getError(
                                `opening_times.${findIndexWorkingTime(
                                  item.value,
                                  index
                                )}.end`
                              )
                            }}
                          </p>
                        </div>
                        <div
                          class="delete-time cursor-pointer d-flex justify-content-center align-items-center flex-1"
                          @click="deleteWorkingTime(item.value, index)"
                        >
                          <div
                            v-if="getOpenTimeOfDay(item.value).length > 1"
                            class="d-flex justify-content-center align-items-center"
                          >
                            <IconDeleteTime />
                            <span>{{ $t("button.delete") }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="add-time cursor-pointer d-flex align-items-center"
                      @click="addWorkingTime(item.value)"
                    >
                      <IconAddTime />
                      <span>{{ $t("button.addition") }}</span>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <!--Holiday-->
              <el-form-item class="w-100">
                <div class="business-hours">
                  <div class="day holiday">
                    <div class="label">{{ $t("holiday") }}</div>
                    <el-checkbox
                      v-model="isHoliday"
                      :label="$t('holiday_check')"
                      @change="handleChangeHoliday"
                    />
                  </div>
                  <div
                    v-if="isHoliday"
                    class="multi-holiday d-flex flex-column"
                  >
                    <div class="custom-multi-date d-flex align-items-center">
                      <div class="w-100 flex-1">
                        <ClientOnly>
                          <MultiDate v-model="multiSelectDate" />
                        </ClientOnly>
                        <p
                          v-if="getError('closing_times')"
                          class="error-validate"
                        >
                          {{ getError("closing_times") }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <!--Open Store Note-->
              <div class="business-hours memo">
                <div class="day">
                  <div class="label">{{ $t("memo") }}</div>
                </div>
                <div class="multi-holiday d-flex flex-column">
                  <div class="custom-multi-date d-flex align-items-center">
                    <el-input
                      v-model="formData.comment_opening_time"
                      v-input-trim
                      type="textarea"
                      :rows="5"
                      :placeholder="$t('placeholder.enter_memo')"
                      :maxlength="MAX_LENGTH_TEXTAREA"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
            <!--Cancel Note-->
            <el-form-item :label="$t('cancellation')">
              <el-input
                v-model="formData.cancellation"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="$t('placeholder.cancellation')"
                :maxlength="MAX_LENGTH_DEFAULT"
              />
            </el-form-item>
            <!--Cancel Protected-->
            <el-form-item label-width="auto" class="cancel-protected">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p class="h-32px">{{ $t("cancel_protected") }}</p>
                </div>
              </div>
              <div class="refund">
                <div class="refund-item d-flex">
                  <!--Cancel checkbox-->
                  <el-form-item
                    prop="is_setting_cancel"
                    :error="getError('is_setting_cancel')"
                  >
                    <el-checkbox
                      v-model="formData.is_setting_cancel"
                      class="w-100"
                      :label="$t('setting_cancel_protected')"
                    />
                  </el-form-item>
                  <!--END Cancel checkbox-->
                </div>
                <template v-if="formData.is_setting_cancel">
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("7_to_2_days_before") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item
                      class="flex-1"
                      prop="setting_store_cancel.seven_day_to_two_day_ago_percent"
                      :error="
                        getError(
                          'setting_store_cancel.seven_day_to_two_day_ago_percent'
                        ) ||
                        getError(
                          'setting_store_cancel.seven_day_to_two_day_ago_percent'
                        )
                      "
                    >
                      <InputNumberText
                        v-model="
                          setting_store_cancel.seven_day_to_two_day_ago_percent
                        "
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="
                          handleFocusOut('seven_day_to_two_day_ago_percent')
                        "
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("one_day_ago") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item
                      class="flex-1"
                      prop="setting_store_cancel.one_day_ago_percent"
                      :error="
                        getError('setting_store_cancel.one_day_ago_percent')
                      "
                    >
                      <InputNumberText
                        v-model="setting_store_cancel.one_day_ago_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('one_day_ago_percent')"
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("that_day") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <!--ITEM-->
                    <el-form-item class="flex-1">
                      <InputNumberText
                        v-model="setting_store_cancel.that_day_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('that_day_percent')"
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("no_contact_cancel") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item class="flex-1">
                      <InputNumberText
                        v-model="setting_store_cancel.no_contact_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('no_contact_percent')"
                      />
                    </el-form-item>
                  </div>
                </template>
              </div>
            </el-form-item>
            <!--END Cancel Protected-->
            <!--Portal site-->
            <el-form-item
              :label="$t('portal_site')"
              :error="getError('portal_site')"
              prop="portal_site"
            >
              <el-radio-group v-model="formData.portal_site">
                <el-radio :label="1">{{ $t("display") }}</el-radio>
                <el-radio :label="0">{{ $t("no_displayed") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--END Portal site-->
            <!--Status display-->
            <el-form-item
              :label="$t('status_display')"
              :error="getError('status_display')"
              prop="status_display"
            >
              <el-radio-group v-model="formData.status_display">
                <el-radio :label="1">{{ $t("display") }}</el-radio>
                <el-radio :label="0">{{ $t("no_displayed") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--END status display-->
            <!--When update-->
            <el-form-item
              v-if="route.params?.id"
              :label="$t('status')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select v-model="formData.status" class="w-100" disabled>
                  <el-option
                    v-for="status in StatusStoreOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="route.params?.id"
              :label="$t('created')"
              class="align-items-center"
            >
              <el-input
                :model-value="
                  formatDate(storeDetail?.created_at, 'YYYY年MM月DD日 HH:mm')
                "
                disabled
                :suffix-icon="IconDate"
              />
            </el-form-item>
            <el-form-item
              v-if="route.params?.id"
              :label="$t('updated')"
              class="align-items-center"
            >
              <el-input
                :model-value="
                  formatDate(storeDetail?.updated_at, 'YYYY年MM月DD日 HH:mm')
                "
                disabled
                :suffix-icon="IconDate"
              />
            </el-form-item>
            <!--END WORKING DAY-->
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import Search from "~/../../src/store/components/Icon/Search.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import SelectTag from "~/../../src/shared/components/input/SelectTag.vue";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import MultiDate from "~/../../src/shared/components/input/MultiDate.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputCodeStore from "~/../../src/shared/components/input/InputCodeStore.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import InputCoordinate from "~/../../src/shared/components/input/InputCoordinate.vue";

import { WORKING_DAYS } from "~/../../src/shared/constants/reservation";
import {
  arrayOpenTime,
  DEFAULT_TIME,
  STATUS_STORE,
  StatusStoreOptions,
} from "~/../../src/shared/constants";
import {
  MAX_LENGTH_DEFAULT,
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_DESCRIPTION,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_STORE_NAME,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import IconDate from "~/../../src/admin/components/Icon/IconDate.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "#imports";
import { FormInstance, UploadProps } from "element-plus";
import { ImageUpload } from "~/../../src/shared/models";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { StoreInterface, TagInterface } from "~/../../src/admin/models";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { ruleStore } from "~/../../src/admin/validates/ruleStore";
import {
  useChangeImage,
  useRemoveImage,
  useSearchAddress,
  useSetData,
  useSetDataCancelProtected,
} from "~/../../src/admin/mixins/storeMixin";
import TagRequest from "~/../../src/shared/requests/TagRequest";
import {
  customTrimValue,
  formatDate,
  formatInputKatakana,
} from "~/../../src/shared/utils";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import {
  createSuccess,
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import useAssetsFile from "~/../../src/admin/composables/useAssetsFile";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { SALON } from "~/../../src/shared/constants/category";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import { Plan } from "~/../../src/shared/types/plan";
import { PLAN_NAME } from "~/../../src/shared/constants";
import { format24HoursTo23Hours59Min } from "~/../../src/shared/utils";

const PRECISION = ref(2);
const MAX_PRICE = ref(1_000_000);

const storeDetail = ref<StoreInterface | null>(null);
const route = useRoute();
const router = useRouter();
const tags = ref<TagInterface[]>([]);
const checkListTimeHoliday = ref([]);
const isHoliday = ref(false);
const multiSelectDate = ref<string[]>([]);
const loadingSearch = ref(false);
const imagesUpload = ref<ImageUpload[]>([]);
const limitImage = ref(1);
const errorsForm = ref({});
const _formRef = ref();
const isLoadingAction = ref(false);
const loadingAvatar = ref(false);
const isMounted = ref(false);

const formData = reactive({
  type_store_id: SALON,
  agent_code: "",
  name: "",
  first_company_name: "",
  last_company_name: "",
  first_company_name_kana: "",
  last_company_name_kana: "",
  introduction: "",
  description: "",
  cancellation: "",
  email: "",
  email_for_notification_reception: "",
  phone_number: "",
  area: "",
  postal_code: "",
  address: "",
  address_detail: "",
  link_google_map: "",
  iframe_google_map: "",
  latitude: "",
  longitude: "",
  tag: [],
  note: "",
  news: "",
  home_page: "",
  comment_opening_time: "",
  transportation: "",
  image_id: [],
  opening_times: JSON.parse(JSON.stringify(arrayOpenTime)),
  closing_times: [],
  setting_store_cancel: {
    seven_day_to_two_day_ago_percent: 0,
    one_day_ago_percent: 0,
    that_day_percent: 0,
    no_contact_percent: 0,
  },
  is_setting_cancel: false,
  status_display: 1,
  portal_site: 1,
  status: STATUS_STORE.STORE_STATUS_PENDING,
  created_at: "",
  updated_at: "",
  code: "",
  prefixCode: "",
});
const suffixCode = ref("");

const setting_store_cancel = reactive({
  seven_day_to_two_day_ago_percent: 0,
  one_day_ago_percent: 0,
  that_day_percent: 0,
  no_contact_percent: 0,
});

const optionRefund = reactive({
  seven_day_to_two_day_ago: false,
  one_day_ago: false,
  that_day: false,
  no_contact: false,
});

//Default inactive
const arrayCheckDayOff = ref([0, 0, 0, 0, 0, 0, 0]);

const getOpenTimeOfDay = (day: number) => {
  return formData.opening_times.filter((item) => item.day_of_week === day);
};

const handleChangeTag = async () => {
  formData.tag = [];
  await getListTags();
};

const addWorkingTime = (day) => {
  formData.opening_times.push({
    day_of_week: day,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  });
};

const resetSettingCancel = () => {
  setting_store_cancel.seven_day_to_two_day_ago_percent = null;
  setting_store_cancel.one_day_ago_percent = null;
  setting_store_cancel.that_day_percent = null;
  setting_store_cancel.no_contact_percent = null;
  optionRefund.seven_day_to_two_day_ago = false;
  optionRefund.one_day_ago = false;
  optionRefund.no_contact = false;
  optionRefund.that_day = false;
};

const findIndexWorkingTime = (day, index) => {
  const time = getOpenTimeOfDay(day)[index];
  return formData.opening_times.findIndex((item) => item === time);
};

const deleteWorkingTime = (day, index) => {
  const indexTime = findIndexWorkingTime(day, index);
  indexTime > -1 && formData.opening_times.splice(indexTime, 1);
};

const changeWorkingDay = (value, day) => {
  if (value) {
    checkListTimeHoliday.value.push(day);
    formData.opening_times = formData.opening_times.filter(
      (item) => item.day_of_week !== day
    );
  } else {
    const index = checkListTimeHoliday.value.findIndex((item) => item === day);
    index > -1 && checkListTimeHoliday.value.splice(index, 1);
    formData.opening_times.push({
      day_of_week: day,
      start: DEFAULT_TIME.START_TIME,
      end: DEFAULT_TIME.END_TIME,
    });
  }
};

const filterDataTypeStore = computed(() => {
  //TODO: phase 1
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const handleChangeHoliday = (value) => {
  if (!value) {
    multiSelectDate.value = [];
  }
};

const handleRemoveImage: UploadProps["onRemove"] = async (
  file: ImageUpload,
  fileList
) => {
  await useRemoveImage(file, fileList, formData, imagesUpload);
};

const handleImageChange: UploadProps["onChange"] = async (file, fileList) => {
  await useChangeImage(file, fileList, imagesUpload, loadingAvatar);
};

const handleSearchAddress = () => {
  useSearchAddress(formData, loadingSearch);
};

const createOrUpdateStore = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  errorsForm.value = {};
  formData.closing_times = multiSelectDate.value.map((item) => ({
    day_off: item,
  }));
  formData.image_id = imagesUpload.value.map((item) => item.id);

  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        if (!formData.is_setting_cancel) {
          resetSettingCancel();
        }
        useSetDataCancelProtected(formData, setting_store_cancel);
        formData.code = `${formData.prefixCode}${suffixCode.value}`;

        const params = {
          address: formData.address,
          address_detail: formData.address_detail,
          cancellation: formData.cancellation,
          closing_times: formData.closing_times,
          code: formData.code,
          agent_code: formData.agent_code,
          comment_opening_time: formData.comment_opening_time,
          created_at: formData.created_at,
          description: formData.description,
          email: formData.email,
          email_for_notification_reception:
            formData.email_for_notification_reception,
          first_company_name: formData.first_company_name,
          first_company_name_kana: formData.first_company_name_kana,
          home_page: formData.home_page,
          link_google_map: formData.link_google_map,
          iframe_google_map: formData.iframe_google_map,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_id: formData.image_id,
          introduction: formData.introduction,
          is_setting_cancel: formData.is_setting_cancel,
          last_company_name: formData.last_company_name,
          last_company_name_kana: formData.last_company_name_kana,
          name: formData.name,
          news: formData.news,
          note: formData.note,
          opening_times: format24HoursTo23Hours59Min(
            JSON.parse(JSON.stringify(formData.opening_times)),
            "start",
            "end"
          ),
          phone_number: formData.phone_number,
          portal_site: formData.portal_site,
          area: formData.area,
          postal_code: formData.postal_code,
          prefixCode: formData.prefixCode,
          setting_store_cancel: formData.setting_store_cancel,
          status: formData.status,
          status_display: formData.status_display,
          tag: formData.tag,
          transportation: formData.transportation,
          type_store_id: formData.type_store_id,
          updated_at: formData.updated_at,
        };

        if (isUpdate) {
          await StoreRequest.put(storeDetail.value.id, {
            ...customTrimValue(params),
            store_manager_id: storeDetail.value.store_manager_id,
          });
          updateSuccess();
        } else {
          await StoreRequest.post({
            ...customTrimValue(params),
          });
          createSuccess();
        }

        await router.push({ name: "stores" });
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
        } else {
          updateError();
          await router.push({ name: "stores" });
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const handleFocusOut = (field: string) => {
  if (!setting_store_cancel[field]) {
    setting_store_cancel[field] = "0";
  }
};

defineExpose({
  createOrUpdateStore,
  isLoadingAction,
  loadingAvatar,
  _formRef,
});

const getListTags = async () => {
  tags.value = (
    await TagRequest.getAllTagByStore<TagInterface[]>(formData.type_store_id)
  )?.data;
};

onBeforeMount(async () => {
  try {
    if (+route.params?.id) {
      storeDetail.value = (
        await StoreRequest.show<StoreInterface>(+route.params?.id as number)
      ).data;
      limitImage.value =
        storeDetail.value?.plan?.plan_data?.number_store_top_photo;
    } else {
      const response = (await PlanRequest.show<Plan>(PLAN_NAME.FREE)).data;
      limitImage.value = response?.number_store_top_photo;
    }
  } catch (_) {
    await router.push({ name: "stores" });
  }
  useSetData(
    storeDetail,
    formData,
    imagesUpload,
    isHoliday,
    multiSelectDate,
    arrayCheckDayOff,
    setting_store_cancel,
    optionRefund,
    suffixCode
  );
  await getListTags();
  isMounted.value = true;
});
</script>

<style lang="scss" scoped>
@import "~/../../src/admin/assets/scss/variables.scss";

:deep(.el-input) {
  min-height: 40px;
}

:deep(.el-form-item__error--inline) {
  margin-left: 0;
}

.main-form {
  height: 100%;

  .form-data {
    display: flex;
    gap: 90px;
  }

  .el-form {
    .right,
    .left {
      flex: 1;
    }

    .left {
      .company {
        width: 100%;

        .mb-12 {
          margin-bottom: 12px;
        }
      }

      :deep(.store-code) {
        .el-form-item__content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .email-notice {
        .required-field {
          width: 100px;
          margin-right: 80px;
        }

        p {
          display: inline-block;
          width: 100px;
          margin-right: 80px;
          line-height: 20px;
        }

        .input-email {
          width: calc(100% - 180px);
        }

        :deep(.el-form-item__error--inline) {
          margin-left: 180px;
        }

        .el-input {
          flex: 1;
        }
      }

      .post-code {
        gap: 12px;
      }

      .text-guide {
        width: 98px;
      }

      :deep(.input-map) {
        & > .el-form-item__content {
          flex-wrap: nowrap;
        }

        .form-item-map {
          & > .el-form-item__content {
            flex-direction: column;
            align-items: flex-start;

            .input {
              width: 100%;
            }

            .el-form-item__error.el-form-item__error--inline {
              margin: 0;
            }
          }
        }
      }

      :deep(.image) {
        .el-form-item__label {
          height: auto;
          align-items: center;
        }

        .el-form-item__content {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      :deep(.el-select) {
        .el-popper {
          &.is-pure {
            width: 100%;
          }
        }
      }
    }

    .right {
      :deep(.domain) {
        .el-input-group__prepend {
          color: $black-90;
          background: $gray-80;
        }
      }

      .business-hours {
        width: 100%;
        display: flex;
        gap: 20px;

        .day {
          display: flex;
          align-items: center;
          gap: 21px;
          height: 40px;

          &.holiday {
            width: 113px;
            justify-content: space-between;
          }
        }

        .hours {
          flex: 1;
          gap: 4px;

          .add-time {
            gap: 8px;
            color: $menuBg;
            font-weight: 500;
            height: 40px;
            max-width: 53px;
            width: 100%;
          }

          .delete-time {
            color: $red-100;
            font-weight: 500;
            max-width: 80px;
            width: 100%;

            & > div {
              gap: 10px;
            }
          }
        }

        .multi-holiday {
          flex: 1;
        }

        .custom-multi-date {
          width: 100%;
          min-height: 40px;

          .delete-time {
            max-width: 80px;
            width: 100%;
          }
        }

        &.memo {
          margin-top: 10px;
          gap: 35px;
        }
      }

      .cancel-protected {
        .label {
          align-self: flex-start;
          margin-right: 54px;
          line-height: 20px;
        }

        .refund {
          width: calc(100% - 180px);
          display: flex;
          flex-direction: column;
          gap: 20px;

          .refund-item {
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;

            .label-item {
              margin: 0;
              width: 112px;
            }

            .money {
              width: 78px;
            }

            .percent {
              width: 120px;
            }

            :deep(.custom-input-price) {
              flex: 1;
              min-width: 120px;
            }

            :deep(.custom-input-number) {
              flex: 1;
              min-width: 120px;
            }

            .el-radio-group {
              gap: 20px;
            }

            .el-radio {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
