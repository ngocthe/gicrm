<template>
  <div v-loading="loadingDetail">
    <el-form
      ref="formRef"
      :rules="planRules"
      :model="formData"
      class="form-plans"
      require-asterisk-position="right"
    >
      <div class="form-plans__left">
        <el-form-item :label="$t('admin.plans.name_plan')" required>
          <input-text v-model="namePlans" disabled="true" />
        </el-form-item>

        <el-form-item
          v-if="!hiddenDuration"
          :label="$t('admin.plans.contract_period')"
          prop="duration"
          :error="errorData.duration?.[0]"
          :inline-message="true"
        >
          <div class="plans-input">
            <el-select
              v-model="formData.duration"
              class="m-2"
              size="large"
              :disabled="notEditPlans"
            >
              <el-option
                v-for="item in durationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span class="unit-price__month text-right">{{
              $t("month_yen")
            }}</span>
          </div>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.initial_cost')"
          prop="initial_cost"
          :error="errorData.initial_cost?.[0]"
          :inline-message="true"
        >
          <div class="plans-input">
            <input-price
              v-model="formData.initial_cost"
              :max-price="MAX_VALUE_PLANS"
              :disabled="notEditPlans"
            />
            <span class="unit-price">{{ $t("yen") }}</span>
          </div>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.annual_payment')"
          required
          prop="monthly_cost_annual"
          :error="errorData.monthly_cost_annual?.[0]"
          :inline-message="true"
        >
          <div class="plans-input">
            <input-price
              v-model="formData.monthly_cost_annual"
              :max-price="MAX_VALUE_PLANS"
              :disabled="notEditPlans"
              @handle-change-input="updateValuePaymentYearTime"
            />
            <span class="unit-price">{{ $t("yen") }}</span>
          </div>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.year_time_payment')"
          prop="year_time_payment"
          :error="errorData.year_time_payment?.[0]"
          :inline-message="true"
        >
          <div class="plans-input">
            <input-price
              v-model="formData.year_time_payment"
              :max-price="MAX_VALUE_PLANS"
              disabled="true"
            />
            <span class="unit-price">{{ $t("yen") }}</span>
          </div>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.monthly_payment')"
          required
          prop="monthly_cost"
          :error="errorData.monthly_cost?.[0]"
          :inline-message="true"
        >
          <div class="plans-input">
            <input-price
              v-model="formData.monthly_cost"
              :max-price="MAX_VALUE_PLANS"
              :disabled="notEditPlans"
            />
            <span class="unit-price">{{ $t("yen") }}</span>
          </div>
        </el-form-item>
        <div class="input-payment-fee">
          <el-form-item
            :label="$t('admin.plans.credit_card')"
            prop="card_payment_fee"
            :error="errorData.card_payment_fee?.[0]"
            :inline-message="true"
          >
            <div class="plans-input">
              <div class="fee-percentage">
                {{ formData.card_payment_service_fee }}% ＋
              </div>
              <input-price
                v-model="formData.card_payment_fee"
                :max-price="MAX_VALUE_PLANS"
                :disabled="notEditPlans"
              />
              <span class="unit-price unit-percentage">{{ $t("yen") }}</span>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          :label="$t('admin.plans.number_monthly_reservation')"
          :error="errorData.monthly_booking?.[0]"
          :inline-message="true"
        >
          <div class="plans-input plans-checkbox__input">
            <div class="block-check__input">
              <el-checkbox
                v-model="bookingUnlimited"
                :disabled="notEditPlans"
                @change="setDataNumberUnlimited"
                >{{ $t("unlimited") }}</el-checkbox
              >
            </div>
            <input-price
              v-model="formData.monthly_booking"
              :min="1"
              :disabled="bookingUnlimited || notEditPlans"
              @input="setDataNumberUnlimitedInput"
            />
            <span class="unit-checkbox">{{ $t("subject_unit") }}</span>
          </div>
        </el-form-item>
        <div class="plans-input-checkbox">
          <el-form-item
            :label="$t('admin.plans.number_registered_staff_members')"
            prop="number_staff"
            :error="errorData.number_staff?.[0]"
            :inline-message="true"
          >
            <div class="plans-input">
              <div class="block-check__input">
                <el-checkbox
                  v-model="priceNumberStaff"
                  :disabled="notEditPlans"
                  @change="setDataNumberStaff"
                >
                  {{
                    $t("maximum") + " (" + priceDisplay(MAX_NUMBER_STAFF) + ")"
                  }}
                </el-checkbox>
              </div>
              <input-price
                v-model="formData.number_staff"
                :max-price="MAX_NUMBER_STAFF"
                :disabled="priceNumberStaff || notEditPlans"
                @input="setDataNumberStaffInput"
              />
              <span class="unit-checkbox">{{ $t("man") }}</span>
            </div>
          </el-form-item>

          <el-form-item
            :label="$t('admin.plans.number_photos_register_store')"
            prop="number_store_top_photo"
            :error="errorData.number_store_top_photo?.[0]"
            :inline-message="true"
          >
            <div class="plans-input">
              <div class="block-check__input">
                <el-checkbox
                  v-model="priceNumberStore"
                  :disabled="notEditPlans"
                  @change="setDataNumberStorePhoto"
                >
                  {{
                    $t("maximum") + " (" + priceDisplay(MAX_NUMBER_STORE) + ")"
                  }}
                </el-checkbox>
              </div>
              <input-price
                v-model="formData.number_store_top_photo"
                :max-price="MAX_NUMBER_STORE"
                :disabled="priceNumberStore || notEditPlans"
                @input="setDataNumberStorePhotoInput"
              />
              <span class="unit-checkbox">{{ $t("sheet") }}</span>
            </div>
          </el-form-item>

          <el-form-item
            :label="$t('admin.plans.photo_gallery')"
            prop="number_photo"
            :error="errorData.number_photo?.[0]"
            :inline-message="true"
          >
            <div class="plans-input">
              <div class="block-check__input">
                <el-checkbox
                  v-model="priceNumberPhoto"
                  :disabled="notEditPlans"
                  @change="setDataNumberPhoto"
                >
                  {{
                    $t("maximum") + " (" + priceDisplay(MAX_NUMBER_PHOTO) + ")"
                  }}
                </el-checkbox>
              </div>
              <input-price
                v-model="formData.number_photo"
                :max-price="MAX_NUMBER_PHOTO"
                :disabled="priceNumberPhoto || notEditPlans"
                @change="setDataNumberPhotoInput"
              />
              <span class="unit-checkbox">{{ $t("sheet") }}</span>
            </div>
          </el-form-item>

          <el-form-item
            :label="$t('admin.plans.number_registered_customers')"
            prop="number_customer"
            :error="errorData.number_customer?.[0]"
            :inline-message="true"
          >
            <div class="plans-input">
              <div class="block-check__input">
                <el-checkbox
                  v-model="priceNumberCustomerRegister"
                  :disabled="notEditPlans"
                  @change="setDataCustomerRegister"
                >
                  {{
                    $t("maximum") +
                    " (" +
                    priceDisplay(MAX_NUMBER_CUSTOMER) +
                    ")"
                  }}
                </el-checkbox>
              </div>
              <input-price
                v-model="formData.number_customer"
                :max-price="MAX_NUMBER_CUSTOMER"
                :disabled="priceNumberCustomerRegister || notEditPlans"
                @change="setDataCustomerRegisterInput"
              />
              <span class="unit-checkbox">{{ $t("sheet") }}</span>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          :label="$t('admin.plans.job_offer')"
          prop="job_offer"
          :error="errorData.job_offer?.[0]"
          :inline-message="true"
        >
          <el-radio-group v-model="formData.job_offer" :disabled="notEditPlans">
            <el-radio :label="STATUS_TYPE.ENABLE">{{ $t("display") }}</el-radio>
            <el-radio :label="STATUS_TYPE.DISABLE">{{
              $t("no_displayed")
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.advertisement')"
          prop="advertisement"
          :error="errorData.advertisement?.[0]"
          :inline-message="true"
        >
          <el-radio-group
            v-model="formData.advertisement"
            :disabled="notEditPlans"
          >
            <el-radio :label="STATUS_TYPE.ENABLE">{{ $t("display") }}</el-radio>
            <el-radio :label="STATUS_TYPE.DISABLE">{{
              $t("no_displayed")
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :label="$t('admin.plans.support')"
          prop="support_plans"
          :error="errorData.support_plans?.[0]"
          :inline-message="true"
        >
          <el-checkbox-group
            v-model="formData.support_plans"
            :disabled="notEditPlans"
          >
            <el-checkbox
              :label="SUPPORT_PLANS.NONE"
              :disabled="
                formData.support_plans.includes(SUPPORT_PLANS.CHAT) ||
                formData.support_plans.includes(SUPPORT_PLANS.EMAIL)
              "
              >{{ $t("none") }}</el-checkbox
            >
            <el-checkbox
              :label="SUPPORT_PLANS.CHAT"
              :disabled="formData.support_plans.includes(SUPPORT_PLANS.NONE)"
              >{{ $t("chatbox") }}</el-checkbox
            >
            <el-checkbox
              :label="SUPPORT_PLANS.EMAIL"
              :disabled="formData.support_plans.includes(SUPPORT_PLANS.NONE)"
              >{{ $t("email") }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </div>

      <div class="form-plans__right">
        <el-form-item
          class="custom-form-item"
          :label="$t('admin.booking_fee')"
          label-width="150px"
        >
          <div class="contract-period">
            <el-form-item>
              <client-only>
                <el-radio-group v-model="typeStore" @change="handleChangeTab">
                  <div v-for="type in filterDataTypeStore">
                    <el-radio-button :label="type.id">
                      {{ $t(type.name) }}
                    </el-radio-button>
                  </div>
                </el-radio-group>
              </client-only>
            </el-form-item>

            <div v-if="typeStore === RESTAURANT" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_restaurant_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_restaurant_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_restaurant_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_restaurant_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_restaurant_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_restaurant_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_restaurant_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_restaurant_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_restaurant_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_restaurant_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_restaurant_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_restaurant_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_restaurant_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_restaurant_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_restaurant_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_restaurant_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_restaurant_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_restaurant_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_restaurant_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div v-if="typeStore === SALON" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_salon_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_salon_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_salon_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_salon_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_salon_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_salon_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_salon_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_salon_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_salon_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_salon_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_salon_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_salon_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_salon_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_salon_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_salon_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_salon_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_salon_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_salon_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_salon_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div v-if="typeStore === MEDIAL_CARE" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_medical_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_medical_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_medical_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_medical_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_medical_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_medical_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_medical_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_medical_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_medical_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_medical_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_medical_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_medical_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_medical_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_medical_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_medical_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_medical_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_medical_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_medical_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_medical_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div v-if="typeStore === CLASSROOM" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_school_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_school_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_school_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_school_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_school_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_school_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_school_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_school_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_school_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_school_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_school_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_school_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_school_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_school_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_school_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_school_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_school_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_school_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_school_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div v-if="typeStore === CONSULTATION" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_consultation_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_consultation_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_consultation_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_consultation_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_consultation_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_consultation_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_consultation_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_consultation_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_consultation_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_consultation_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_consultation_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_consultation_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_consultation_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_consultation_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_consultation_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_consultation_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_consultation_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_consultation_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_consultation_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <div v-if="typeStore === EVENT" class="booking-fee">
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_events_range_1_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_events_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("less_than") }} </span>
                  <input-price
                    v-model="formData.fee_events_range_1_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_events_range_2_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_events_range_2_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_events_range_2_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_events_range_3_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_events_range_3_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_events_range_3_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_events_range_4_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_events_range_4_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_events_range_4_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="contract-period__item">
                <el-form-item
                  :label="$t('total_per_person')"
                  prop="fee_events_range_5_fee"
                  :inline-message="true"
                >
                  <input-price
                    v-model="formData.fee_events_range_5_amount"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="block-about"> {{ $t("that_all") }} </span>
                  <input-price
                    v-model="formData.fee_events_range_5_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reservation_store_reception')"
                  prop="fee_events_store_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_events_store_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
              <div class="block-contract__item">
                <el-form-item
                  :label="$t('admin.plans.reserved_seats_only')"
                  prop="fee_events_empty_booking"
                  :inline-message="true"
                >
                  <div class="plans-input">
                    <input-price
                      v-model="formData.fee_events_empty_booking"
                      :max-price="MAX_VALUE_PLANS"
                      :disabled="notEditPlans"
                    />
                    <span class="unit-price">{{ $t("yen") }}</span>
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form-item>

        <div class="block-contract">
          <el-form-item
            class="custom-form-item"
            :label="$t('admin.plans.additional_options')"
            label-width="150px"
          >
            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.zoom_monthly_fee')"
                prop="zoom_fee"
                :error="errorData.zoom_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.zoom_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.line_monthly_fee')"
                prop="line_fee"
                :error="errorData.line_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.line_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.external_monthly_fee')"
                prop="external_site_monthly_fee"
                :error="errorData.external_site_monthly_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.external_site_monthly_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.initial_monthly_fee')"
                prop="initial_support_monthly_fee"
                :error="errorData.initial_support_monthly_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.initial_support_monthly_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.customer_monthly_fee')"
                prop="customer_attraction_fee"
                :error="errorData.customer_attraction_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.customer_attraction_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.submission_monthly_fee')"
                prop="submission_agency_monthly_fee"
                :error="errorData.submission_agency_monthly_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.submission_agency_monthly_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('SMS_under_100')"
                prop="sms_under_100"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.sms_under_100"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('SMS_under_300')"
                prop="sms_under_300"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.sms_under_300"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('SMS_under_500')"
                prop="sms_under_500"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.sms_under_500"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('SMS_under_1000')"
                prop="sms_under_1000"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.sms_under_1000"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('SMS_above_1000')"
                prop="sms_above_1000"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.sms_above_1000"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>

            <div class="block-contract__item">
              <el-form-item
                :label="$t('admin.plans.custom_billing_monthly')"
                prop="custom_billing_monthly_fee"
                :error="errorData.custom_billing_monthly_fee?.[0]"
                :inline-message="true"
              >
                <div class="plans-input">
                  <input-price
                    v-model="formData.custom_billing_monthly_fee"
                    :max-price="MAX_VALUE_PLANS"
                    :disabled="notEditPlans"
                  />
                  <span class="unit-price">{{ $t("yen") }}</span>
                </div>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  onBeforeMount,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import { Plan } from "~/../../src/shared/types/plan";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import {
  updateSuccess,
  updateError,
} from "~/../../src/shared/utils/notification";
import {
  SALON,
  RESTAURANT,
  MEDIAL_CARE,
  CLASSROOM,
  CONSULTATION,
  EVENT,
} from "~/../../src/shared/constants/category";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  SUPPORT_PLANS,
  durationOptions,
} from "~/../../src/shared/constants/plan";
import priceDisplay from "~/../../src/shared/utils/price";
import {
  UNLIMITED,
  MAX_NUMBER_CUSTOMER,
  MAX_NUMBER_STORE,
  MAX_NUMBER_STAFF,
  MAX_NUMBER_PHOTO,
  NOT_UNLIMITED,
  MAX_VALUE_PLANS,
} from "~/../../src/shared/constants/plan";
import { STATUS_TYPE } from "~/../../src/shared/constants";
import { formatValuePrice } from "~/../../src/shared/utils";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import formPlanRules from "../../validates/plan";

interface Prop {
  id?: number;
}

const { t } = i18n.global;
const bookingUnlimited = ref(false);
const priceNumberStaff = ref(false);
const priceNumberStore = ref(false);
const priceNumberPhoto = ref(false);
const priceNumberCustomerRegister = ref(false);
const planData = ref<Plan>();
const props = defineProps<Prop>();
const { id } = toRefs(props);
const router = useRouter();
const formRef = ref(null);
const errorData = ref({});
const loadingDetail = ref(false);
const isLoadingAction = ref(false);
const notEditPlans = ref(true);
const PRECISION = ref(2);
const typeStore = ref(RESTAURANT);
const namePlans = ref(null);
const hiddenDuration = ref(false);

const { formData, planRules } = formPlanRules();

const support = ref(SUPPORT_PLANS.NONE);

const setDataNumberUnlimited = () => {
  formData.monthly_booking = null;
};

const setDataNumberUnlimitedInput = () => {
  if (formData.monthly_booking === "") {
    bookingUnlimited.value = true;
  }
};

const setDataNumberStaff = () => {
  formData.number_staff = priceDisplay(MAX_NUMBER_STAFF);
};

const setDataNumberStaffInput = () => {
  if (+formatValuePrice(formData.number_staff) === MAX_NUMBER_STAFF) {
    priceNumberStaff.value = true;
  }
};

const setDataNumberStorePhoto = () => {
  formData.number_store_top_photo = priceDisplay(MAX_NUMBER_STORE);
};

const setDataNumberStorePhotoInput = () => {
  if (+formatValuePrice(formData.number_store_top_photo) === MAX_NUMBER_STORE) {
    priceNumberStore.value = true;
  }
};

const setDataNumberPhoto = () => {
  formData.number_photo = priceDisplay(MAX_NUMBER_PHOTO);
};

const setDataNumberPhotoInput = () => {
  if (+formatValuePrice(formData.number_photo) === MAX_NUMBER_PHOTO) {
    priceNumberPhoto.value = true;
  }
};

const setDataCustomerRegister = () => {
  formData.number_customer = priceDisplay(MAX_NUMBER_CUSTOMER);
};

const setDataCustomerRegisterInput = () => {
  if (+formatValuePrice(formData.number_customer) === MAX_NUMBER_CUSTOMER) {
    priceNumberStaff.value = true;
  }
};
const updateValuePaymentYearTime = () => {
  return (formData.year_time_payment = priceDisplay(
    +formatValuePrice(formData.monthly_cost_annual) * 12
  ));
};

const handleChangeTab = async (tab) => {
  typeStore.value = tab;
};

const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const detailPlan = async () => {
  try {
    loadingDetail.value = true;
    planData.value = (await PlanRequest.show(id.value)).data as Plan;

    namePlans.value = t("plans_" + planData.value.name);
    if (planData.value.name === "free") {
      hiddenDuration.value = true;
    }
    formData.name = planData.value.name;
    formData.duration = planData.value.duration;
    formData.initial_cost = priceDisplay(planData.value.initial_cost);
    formData.monthly_cost_annual = priceDisplay(
      planData.value.monthly_cost_annual
    );
    formData.year_time_payment = priceDisplay(
      planData.value.monthly_cost_annual * 12
    );
    formData.monthly_cost = planData.value.monthly_cost
      ? priceDisplay(planData.value.monthly_cost)
      : 0;
    formData.card_payment_fee = priceDisplay(planData.value.card_payment_fee);
    formData.card_payment_service_fee = priceDisplay(
      planData.value.card_payment_service_fee
    );
    formData.monthly_booking =
      planData.value.monthly_booking || planData.value.monthly_booking === 0
        ? priceDisplay(planData.value.monthly_booking)
        : null;
    formData.price_plan_unlimited =
      planData.value.monthly_booking || planData.value.monthly_booking === 0
        ? NOT_UNLIMITED
        : UNLIMITED;
    formData.number_staff = priceDisplay(planData.value.number_staff);
    formData.number_store_top_photo = priceDisplay(
      planData.value.number_store_top_photo
    );
    formData.number_photo = priceDisplay(planData.value.number_photo);
    formData.number_customer = priceDisplay(planData.value.number_customer);
    formData.number_registered_customers = priceDisplay(
      planData.value.number_registered_customers
    );
    formData.job_offer = planData.value.job_offer;
    formData.advertisement = planData.value.advertisement;
    if (planData.value.support === SUPPORT_PLANS.NONE) {
      formData.support_plans.push(SUPPORT_PLANS.NONE);
    }
    if (planData.value.support === SUPPORT_PLANS.CHAT) {
      formData.support_plans.push(SUPPORT_PLANS.CHAT);
    }
    if (planData.value.support === SUPPORT_PLANS.EMAIL) {
      formData.support_plans.push(SUPPORT_PLANS.EMAIL);
    }
    if (planData.value.support === SUPPORT_PLANS.CHAT_EMAIL) {
      formData.support_plans.push(SUPPORT_PLANS.EMAIL, SUPPORT_PLANS.CHAT);
    }
    formData.zoom_fee = priceDisplay(planData.value.zoom_fee);
    formData.line_fee = priceDisplay(planData.value.line_fee);
    formData.external_site_monthly_fee = priceDisplay(
      planData.value.external_site_monthly_fee
    );
    formData.submission_agency_monthly_fee = priceDisplay(
      planData.value.submission_agency_monthly_fee
    );

    formData.sms_under_100 = priceDisplay(
      planData.value.sms_monthly_fee?.below_100
    );
    formData.sms_under_300 = priceDisplay(
      planData.value.sms_monthly_fee?.below_300
    );
    formData.sms_under_500 = priceDisplay(
      planData.value.sms_monthly_fee?.below_500
    );
    formData.sms_under_1000 = priceDisplay(
      planData.value.sms_monthly_fee?.below_1000
    );
    formData.sms_above_1000 = priceDisplay(
      planData.value.sms_monthly_fee?.unlimit
    );

    formData.custom_billing_monthly_fee = priceDisplay(
      planData.value.custom_billing_monthly_fee
    );

    formData.initial_support_monthly_fee = priceDisplay(
      planData.value.initial_support_monthly_fee
    );
    formData.customer_attraction_fee = priceDisplay(
      planData.value.customer_attraction_fee
    );

    formData.fee_restaurant_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_1.amount
    );
    formData.fee_restaurant_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_1.fee
    );
    formData.fee_restaurant_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_2.amount
    );
    formData.fee_restaurant_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_2.fee
    );
    formData.fee_restaurant_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_3.amount
    );
    formData.fee_restaurant_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_3.fee
    );
    formData.fee_restaurant_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_4.amount
    );
    formData.fee_restaurant_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_4.fee
    );
    formData.fee_restaurant_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_5.amount
    );
    formData.fee_restaurant_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.restaurant.range.range_5.fee
    );
    formData.fee_restaurant_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.restaurant.empty_booking
    );
    formData.fee_restaurant_store_booking = priceDisplay(
      planData.value.booking_fee_setting.restaurant.store_booking
    );

    formData.fee_salon_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_1.amount
    );
    formData.fee_salon_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_1.fee
    );
    formData.fee_salon_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_2.amount
    );
    formData.fee_salon_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_2.fee
    );
    formData.fee_salon_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_3.amount
    );
    formData.fee_salon_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_3.fee
    );
    formData.fee_salon_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_4.amount
    );
    formData.fee_salon_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_4.fee
    );
    formData.fee_salon_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_5.amount
    );
    formData.fee_salon_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.salon.range.range_5.fee
    );
    formData.fee_salon_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.salon.empty_booking
    );
    formData.fee_salon_store_booking = priceDisplay(
      planData.value.booking_fee_setting.salon.store_booking
    );

    formData.fee_medical_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_1.amount
    );
    formData.fee_medical_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_1.fee
    );
    formData.fee_medical_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_2.amount
    );
    formData.fee_medical_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_2.fee
    );
    formData.fee_medical_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_3.amount
    );
    formData.fee_medical_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_3.fee
    );
    formData.fee_medical_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_4.amount
    );
    formData.fee_medical_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_4.fee
    );
    formData.fee_medical_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_5.amount
    );
    formData.fee_medical_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.medical.range.range_5.fee
    );
    formData.fee_medical_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.medical.empty_booking
    );
    formData.fee_medical_store_booking = priceDisplay(
      planData.value.booking_fee_setting.medical.store_booking
    );

    formData.fee_school_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_1.amount
    );
    formData.fee_school_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_1.fee
    );
    formData.fee_school_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_2.amount
    );
    formData.fee_school_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_2.fee
    );
    formData.fee_school_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_3.amount
    );
    formData.fee_school_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_3.fee
    );
    formData.fee_school_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_4.amount
    );
    formData.fee_school_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_4.fee
    );
    formData.fee_school_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_5.amount
    );
    formData.fee_school_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.school.range.range_5.fee
    );
    formData.fee_school_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.school.empty_booking
    );
    formData.fee_school_store_booking = priceDisplay(
      planData.value.booking_fee_setting.school.store_booking
    );

    formData.fee_consultation_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_1.amount
    );
    formData.fee_consultation_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_1.fee
    );
    formData.fee_consultation_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_2.amount
    );
    formData.fee_consultation_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_2.fee
    );
    formData.fee_consultation_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_3.amount
    );
    formData.fee_consultation_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_3.fee
    );
    formData.fee_consultation_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_4.amount
    );
    formData.fee_consultation_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_4.fee
    );
    formData.fee_consultation_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_5.amount
    );
    formData.fee_consultation_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.consultation.range.range_5.fee
    );
    formData.fee_consultation_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.consultation.empty_booking
    );
    formData.fee_consultation_store_booking = priceDisplay(
      planData.value.booking_fee_setting.consultation.store_booking
    );

    formData.fee_events_range_1_amount = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_1.amount
    );
    formData.fee_events_range_1_fee = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_1.fee
    );
    formData.fee_events_range_2_amount = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_2.amount
    );
    formData.fee_events_range_2_fee = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_2.fee
    );
    formData.fee_events_range_3_amount = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_3.amount
    );
    formData.fee_events_range_3_fee = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_3.fee
    );
    formData.fee_events_range_4_amount = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_4.amount
    );
    formData.fee_events_range_4_fee = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_4.fee
    );
    formData.fee_events_range_5_amount = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_5.amount
    );
    formData.fee_events_range_5_fee = priceDisplay(
      planData.value.booking_fee_setting.events.range.range_5.fee
    );
    formData.fee_events_empty_booking = priceDisplay(
      planData.value.booking_fee_setting.events.empty_booking
    );
    formData.fee_events_store_booking = priceDisplay(
      planData.value.booking_fee_setting.consultation.store_booking
    );

    if (planData.value.monthly_booking === UNLIMITED) {
      bookingUnlimited.value = true;
    }

    if (planData.value.number_staff === MAX_NUMBER_STAFF) {
      priceNumberStaff.value = true;
    }

    if (planData.value.number_store_top_photo === MAX_NUMBER_STORE) {
      priceNumberStore.value = true;
    }

    if (planData.value.number_photo === MAX_NUMBER_PHOTO) {
      priceNumberPhoto.value = true;
    }
    if (planData.value.number_customer === MAX_NUMBER_CUSTOMER) {
      priceNumberCustomerRegister.value = true;
    }
  } catch (e) {
    return e;
  } finally {
    loadingDetail.value = false;
  }
};

const editPlans = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;

        const settingFeeObj = {
          restaurant: {
            range: {
              range_1: {
                amount: +formatValuePrice(
                  formData.fee_restaurant_range_1_amount
                ),
                fee: +formatValuePrice(formData.fee_restaurant_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(
                  formData.fee_restaurant_range_2_amount
                ),
                fee: +formatValuePrice(formData.fee_restaurant_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(
                  formData.fee_restaurant_range_3_amount
                ),
                fee: +formatValuePrice(formData.fee_restaurant_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(
                  formData.fee_restaurant_range_4_amount
                ),
                fee: +formatValuePrice(formData.fee_restaurant_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(
                  formData.fee_restaurant_range_5_amount
                ),
                fee: +formatValuePrice(formData.fee_restaurant_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(
              formData.fee_restaurant_empty_booking
            ),
            store_booking: +formatValuePrice(
              formData.fee_restaurant_store_booking
            ),
          },
          salon: {
            range: {
              range_1: {
                amount: +formatValuePrice(formData.fee_salon_range_1_amount),
                fee: +formatValuePrice(formData.fee_salon_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(formData.fee_salon_range_2_amount),
                fee: +formatValuePrice(formData.fee_salon_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(formData.fee_salon_range_3_amount),
                fee: +formatValuePrice(formData.fee_salon_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(formData.fee_salon_range_4_amount),
                fee: +formatValuePrice(formData.fee_salon_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(formData.fee_salon_range_5_amount),
                fee: +formatValuePrice(formData.fee_salon_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(formData.fee_salon_empty_booking),
            store_booking: +formatValuePrice(formData.fee_salon_store_booking),
          },
          medical: {
            range: {
              range_1: {
                amount: +formatValuePrice(formData.fee_medical_range_1_amount),
                fee: +formatValuePrice(formData.fee_medical_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(formData.fee_medical_range_2_amount),
                fee: +formatValuePrice(formData.fee_medical_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(formData.fee_medical_range_3_amount),
                fee: +formatValuePrice(formData.fee_medical_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(formData.fee_medical_range_4_amount),
                fee: +formatValuePrice(formData.fee_medical_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(formData.fee_medical_range_5_amount),
                fee: +formatValuePrice(formData.fee_medical_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(
              formData.fee_medical_empty_booking
            ),
            store_booking: +formatValuePrice(
              formData.fee_medical_store_booking
            ),
          },
          school: {
            range: {
              range_1: {
                amount: +formatValuePrice(formData.fee_school_range_1_amount),
                fee: +formatValuePrice(formData.fee_school_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(formData.fee_school_range_2_amount),
                fee: +formatValuePrice(formData.fee_school_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(formData.fee_school_range_3_amount),
                fee: +formatValuePrice(formData.fee_school_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(formData.fee_school_range_4_amount),
                fee: +formatValuePrice(formData.fee_school_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(formData.fee_school_range_5_amount),
                fee: +formatValuePrice(formData.fee_school_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(formData.fee_school_empty_booking),
            store_booking: +formatValuePrice(formData.fee_school_store_booking),
          },
          consultation: {
            range: {
              range_1: {
                amount: +formatValuePrice(
                  formData.fee_consultation_range_1_amount
                ),
                fee: +formatValuePrice(formData.fee_consultation_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(
                  formData.fee_consultation_range_2_amount
                ),
                fee: +formatValuePrice(formData.fee_consultation_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(
                  formData.fee_consultation_range_3_amount
                ),
                fee: +formatValuePrice(formData.fee_consultation_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(
                  formData.fee_consultation_range_4_amount
                ),
                fee: +formatValuePrice(formData.fee_consultation_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(
                  formData.fee_consultation_range_5_amount
                ),
                fee: +formatValuePrice(formData.fee_consultation_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(
              formData.fee_consultation_empty_booking
            ),
            store_booking: +formatValuePrice(
              formData.fee_consultation_store_booking
            ),
          },
          events: {
            range: {
              range_1: {
                amount: +formatValuePrice(formData.fee_events_range_1_amount),
                fee: +formatValuePrice(formData.fee_events_range_1_fee),
              },
              range_2: {
                amount: +formatValuePrice(formData.fee_events_range_2_amount),
                fee: +formatValuePrice(formData.fee_events_range_2_fee),
              },
              range_3: {
                amount: +formatValuePrice(formData.fee_events_range_3_amount),
                fee: +formatValuePrice(formData.fee_events_range_3_fee),
              },
              range_4: {
                amount: +formatValuePrice(formData.fee_events_range_4_amount),
                fee: +formatValuePrice(formData.fee_events_range_4_fee),
              },
              range_5: {
                amount: +formatValuePrice(formData.fee_events_range_5_amount),
                fee: +formatValuePrice(formData.fee_events_range_5_fee),
              },
            },
            empty_booking: +formatValuePrice(formData.fee_events_empty_booking),
            store_booking: +formatValuePrice(formData.fee_events_store_booking),
          },
        };

        if (
          formData.support_plans.includes(SUPPORT_PLANS.EMAIL) &&
          formData.support_plans.includes(SUPPORT_PLANS.CHAT)
        ) {
          support.value = SUPPORT_PLANS.CHAT_EMAIL;
        } else if (formData.support_plans.includes(SUPPORT_PLANS.EMAIL)) {
          support.value = SUPPORT_PLANS.EMAIL;
        } else if (formData.support_plans.includes(SUPPORT_PLANS.CHAT)) {
          support.value = SUPPORT_PLANS.CHAT;
        } else if (formData.support_plans.includes(SUPPORT_PLANS.NONE)) {
          support.value = SUPPORT_PLANS.NONE;
        }

        const params = {
          name: formData.name,
          duration: formData.duration,
          initial_cost: +formatValuePrice(formData.initial_cost),
          monthly_cost_annual: +formatValuePrice(formData.monthly_cost_annual),
          year_time_payment: +formatValuePrice(formData.year_time_payment),
          monthly_cost: +formatValuePrice(formData.monthly_cost),
          card_payment_fee: +formatValuePrice(formData.card_payment_fee),
          monthly_booking: formData.monthly_booking
            ? +formatValuePrice(formData.monthly_booking)
            : null,
          number_staff: +formatValuePrice(formData.number_staff),
          number_store_top_photo: +formatValuePrice(
            formData.number_store_top_photo
          ),
          number_photo: +formatValuePrice(formData.number_photo),
          number_customer: +formatValuePrice(formData.number_customer),
          number_registered_customers: +formatValuePrice(
            formData.number_registered_customers
          ),
          job_offer: +formatValuePrice(formData.job_offer),
          advertisement: +formatValuePrice(formData.advertisement),

          zoom_fee: +formatValuePrice(formData.zoom_fee),
          line_fee: +formatValuePrice(formData.line_fee),
          external_site_monthly_fee: +formatValuePrice(
            formData.external_site_monthly_fee
          ),
          submission_agency_monthly_fee: +formatValuePrice(
            formData.submission_agency_monthly_fee
          ),
          sms_monthly_fee: {
            below_100: +formatValuePrice(formData.sms_under_100),
            below_300: +formatValuePrice(formData.sms_under_300),
            below_500: +formatValuePrice(formData.sms_under_500),
            below_1000: +formatValuePrice(formData.sms_under_1000),
            unlimit: +formatValuePrice(formData.sms_above_1000),
          },
          custom_billing_monthly_fee: +formatValuePrice(
            formData.custom_billing_monthly_fee
          ),
          initial_support_monthly_fee: +formatValuePrice(
            formData.initial_support_monthly_fee
          ),
          customer_attraction_fee: +formatValuePrice(
            formData.customer_attraction_fee
          ),
          booking_fee_setting: settingFeeObj,
          support: support.value,
        };
        errorData.value = {};
        await PlanRequest.put(id.value, params);
        updateSuccess();
        await router.push("/plans");
      } catch (error) {
        if (errorData.value) {
          errorData.value = error?.data?.errors;
        } else {
          updateError();
        }
      } finally {
        loadingDetail.value = false;
        isLoadingAction.value = false;
      }
    }
  });
};

const toEditPlans = () => {
  notEditPlans.value = false;
  return false;
};

defineExpose({
  toEditPlans,
  editPlans,
  formRef,
  isLoadingAction,
});

onBeforeMount(() => {
  if (id.value) {
    detailPlan();
  }
});

onMounted(() => {
  const Element = document.querySelector("#main-admin-layout .main-container");
  if (Element) {
    Element.classList.add("screen-plans");
  }
});

onBeforeUnmount(() => {
  const Element = document.querySelector("#main-admin-layout .main-container");
  if (Element) {
    Element.classList.remove("screen-plans");
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-plans) {
  display: flex;
  min-width: 1096px;
  gap: 96px;

  .form-plans__left .custom-input-price {
    flex: 1;
    min-width: 60px;
  }

  .form-plans__left .el-form-item .el-form-item__label {
    min-width: 180px;
  }

  .form-plans__left,
  .form-plans__right {
    flex: 1;
  }

  .form-plans__left,
  .form-plans__right {
    .el-form-item__label {
      height: 40px;
      line-height: 40px;
    }

    .plans-input {
      display: flex;
      align-items: center;
      width: 100%;

      .fee-percentage {
        min-width: 60px;
      }

      .custom-input-number {
        display: inline-block;
        width: calc(100% - 20px);
      }

      .block-check__input {
        width: 115px;
      }

      .unit-checkbox {
        width: 30px;
      }

      .unit-price {
        width: 23px;

        &__month {
          width: 36px;
        }
      }

      .unit-price,
      .unit-checkbox {
        text-align: right;
      }
    }
  }

  .form-plans__right {
    .booking-fee {
      .el-form-item__content {
        min-width: 233px;

        .el-input {
          width: calc(50% - 22px);
        }
      }
    }

    .el-radio-group {
      margin-bottom: 5px;
      background-color: $gray-90;

      .el-radio-button {
        padding: 2px;
        border-radius: 4px;
      }

      .el-radio-button__inner {
        background-color: $gray-90;
        padding: 9px 11px;
        border-radius: 3px;
        border: 0;
        box-shadow: none;
      }

      .el-radio-button__original-radio:checked + .el-radio-button__inner {
        background-color: $white-color;
        color: $black-80;
      }
    }
  }

  .el-form-item {
    .el-form-item__label {
      width: 210px;
      justify-content: flex-start;
    }

    .el-form-item__content {
      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .contract-period {
        width: 100%;

        &__item {
          margin: 13px 0;

          .el-form-item__content {
            width: 100%;
          }
        }

        .block-about {
          padding: 0 8px;
        }
      }

      .block-contract {
        .el-form-item__content {
          display: block;
        }

        &__item {
          margin-bottom: 13px;
          width: 100%;

          .el-input {
            width: 100%;
          }
        }
      }

      .el-textarea {
        min-height: 80px;

        .el-textarea__inner {
          min-height: 80px !important;
        }
      }
    }
  }
}

:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
  height: 40px;
  .el-input__wrapper {
    flex-direction: row-reverse;
    padding-right: 0;
  }
}

:deep(.el-checkbox__input.is-disabled + span.el-checkbox__label),
:deep(.el-radio__input.is-disabled + span.el-radio__label) {
  color: $black-80;
}
</style>
