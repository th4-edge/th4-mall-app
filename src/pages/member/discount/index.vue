

<template>
  <view v-if="popupVisible" class="coupon-popup-mask" @click="popupVisible=false">
    <view class="coupon-popup" @click.stop>
      <view class="popup-header">
        <text class="popup-title">优惠选择</text>
        <text class="close-btn" @click="popupVisible=false">×</text>
      </view>

      <!-- tab切换：优惠券 / 会员权益 -->
      <view class="coupon-tab">
        <text
            class="tab-item"
            :class="{ active: currentTab === 'coupon' }"
            @click="currentTab = 'coupon'"
        >优惠券</text>
        <text
            class="tab-item"
            :class="{ active: currentTab === 'right' }"
            @click="currentTab = 'right'"
        >会员权益</text>
      </view>

      <!-- 优惠券列表（新增4种类型） -->
      <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'coupon'">
        <view class="coupon-title">可用优惠券</view>
        <view
            v-for="coupon in availableCoupon"
            :key="coupon.id"
            class="coupon-item"
            :class="{ selected: selectedCoupon?.id === coupon.id, combo: coupon.type === 'combo' }"
            @click="selectCoupon(coupon)"
        >
          <view class="coupon-left">
            <text class="coupon-amount">
              {{ getCouponAmountText(coupon) }}
            </text>
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-limit">{{ coupon.limit }}</text>
          </view>
          <view class="coupon-right">
            <text v-if="selectedCoupon?.id === coupon.id" class="selected-tag">已选中</text>
            <text v-else class="select-btn">立即使用</text>
          </view>
        </view>

        <view class="coupon-title">不可用优惠券</view>
        <view
            v-for="coupon in unavailableCoupon"
            :key="coupon.id"
            class="coupon-item disabled"
            :class="{ combo: coupon.type === 'combo' }"
        >
          <view class="coupon-left">
            <text class="coupon-amount">
              {{ getCouponAmountText(coupon) }}
            </text>
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-limit">{{ coupon.limit }}</text>
          </view>
          <view class="coupon-right">
            <text class="disabled-btn">不可用</text>
          </view>
        </view>

        <view v-if="couponList.length === 0" class="empty-coupon">
          <text>暂无可用优惠券</text>
        </view>
      </scroll-view>

      <!-- 会员权益列表（新增2种复杂权益） -->
      <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'right'">
        <view class="right-item" v-for="right in memberRights" :key="right.id">
          <view class="right-info">
            <text class="right-name">{{ right.name }}</text>
            <text class="right-desc">{{ right.desc }}</text>
            <!-- 新增：权益使用状态/限制提示 -->
            <text v-if="right.id === 1" class="right-status">
              本月已用{{ monthlyDiscountCount }}/4次
              <text v-if="monthlyDiscountCount >= 4" class="right-status-red">（已用完）</text>
            </text>
            <text v-if="right.id === 2" class="right-status">
              {{ isThursday ? '今天可用！' : '每周四可用' }}
            </text>
          </view>
          <switch
              :checked="selectedRights.includes(right.id)"
              @change="toggleRight(right.id, $event)"
              color="#e6212a"
              :disabled="!isRightAvailable(right.id)"
          />
        </view>
      </scroll-view>

      <!-- 底部确认按钮 -->
      <view class="coupon-footer">
        <button class="confirm-coupon-btn" @click="confirmCoupon">确认使用</button>
      </view>
    </view>
  </view>

</template>
<script setup lang="ts">
const popupVisible=defineModel('popupVisible',{required:true})
</script>
<style scoped lang="scss">

</style>