<template>
  <scroll-view scroll-y class="coupon-content">
    <view class="coupon-title">可用优惠券</view>
    <view
        v-for="coupon in canUseCoupons"
        :key="coupon.id"
        class="coupon-item"
        :class="{ selected: selectedCoupons.some(item => item.id === coupon.id), combo: coupon.type === 'combo' }"
        @click="selectCoupon(coupon)"
    >
      <view class="coupon-left">
        <text class="coupon-amount">
          {{ coupon.discount }}
        </text>
        <text class="coupon-name">{{ coupon.name }}</text>
        <text class="coupon-limit">{{ coupon.limit }}</text>
      </view>
      <view class="coupon-right">
        <text v-if="selectedCoupons.some(item =>item.id===coupon.id)" class="selected-tag">已选中</text>
        <text v-else class="select-btn">立即使用</text>
      </view>
    </view>

    <view class="coupon-title">不可用优惠券</view>
    <view
        v-for="coupon in couponList.filter(coupon => canUseCoupons.some(coupon => coupon.id === coupon.id))"
        :key="coupon.id"
        class="coupon-item disabled"
        :class="{ combo: coupon.type === 'combo' }"
    >
      <view class="coupon-left">
        <text class="coupon-amount">
          {{ coupon.name }}
        </text>
        <text class="coupon-name">{{ coupon.name }}</text>
        <text class="coupon-limit">{{ coupon.limit||0 }}</text>
      </view>
      <view class="coupon-right">
        <text class="disabled-btn">不可用</text>
      </view>
    </view>

    <view v-if="couponList.length === 0" class="empty-coupon">
      <text>暂无可用优惠券</text>
    </view>
  </scroll-view>

</template>
<script setup lang="ts">
import {ref} from 'vue';
const couponList = ref([]);
const canUseCoupons = ref([]);
const selectedCoupons = ref([]);

const selectCoupon = (coupon) => {
  // 优惠券选择逻辑
};
</script>
<style scoped lang="scss">
$primary-red: #e6212a;
$light-bg: #f7f8fa;
$text-main: #333;
$text-sub: #999;
$border-color: #eee;
$disabled-color: #ccc;
$special-yellow: #ff9900;
$combo-purple: #9933ff;
.coupon-content {
  flex: 1;
  padding: 0 30rpx;
  overflow-y: auto;
  box-sizing: border-box;
  .coupon-title {
    font-size: 26rpx;
    color: $text-sub;
    padding: 20rpx 0 10rpx;
  }

  .coupon-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background: linear-gradient(90deg, #fff5f5 0%, #fff 100%);
    border: 1px solid #ffe0e0;
    border-radius: 12rpx;
    position: relative;
    overflow: hidden;

    &::before, &::after {
      content: '';
      position: absolute;
      left: -10rpx;
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background-color: #fff;
    }
    &::before {
      top: -10rpx;
    }
    &::after {
      bottom: -10rpx;
    }

    &.selected {
      border-color: $primary-red;
      background: linear-gradient(90deg, #ffe0e0 0%, #fff 100%);
    }
    &.disabled {
      opacity: 0.5;
      background: #f9f9f9;
      border-color: #eee;
    }
    &.combo {
      background: linear-gradient(90deg, #f5f0ff 0%, #fff 100%);
      border-color: #e0d0ff;
      &.selected {
        border-color: $combo-purple;
        background: linear-gradient(90deg, #e0d0ff 0%, #fff 100%);
      }
    }

    .coupon-left {
      flex: 1;
      .coupon-amount {
        font-size: 40rpx;
        font-weight: bold;
        color: $primary-red;
        .combo & {
          color: $combo-purple;
        }
      }
      .coupon-name {
        display: block;
        font-size: 28rpx;
        color: $text-main;
        margin: 5rpx 0;
      }
      .coupon-limit {
        font-size: 22rpx;
        color: $text-sub;
      }
    }
    .coupon-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .select-btn {
        width: 120rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        background-color: $primary-red;
        color: #fff;
        border-radius: 25rpx;
        font-size: 24rpx;
        .combo & {
          background-color: $combo-purple;
        }
      }
      .selected-tag {
        font-size: 24rpx;
        color: $primary-red;
        font-weight: 500;
        .combo & {
          color: $combo-purple;
        }
      }
      .disabled-btn {
        width: 120rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        background-color: $disabled-color;
        color: #fff;
        border-radius: 25rpx;
        font-size: 24rpx;
      }
    }
  }

  .right-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1px solid $border-color;
    .right-info {
      flex: 1;
      .right-name {
        font-size: 28rpx;
        color: $text-main;
        font-weight: 500;
      }
      .right-desc {
        display: block;
        font-size: 24rpx;
        color: $text-sub;
        margin-top: 5rpx;
      }
      .right-status {
        display: block;
        font-size: 22rpx;
        color: $text-sub;
        margin-top: 5rpx;
        .right-status-red {
          color: $primary-red;
        }
      }
    }
  }
}
</style>