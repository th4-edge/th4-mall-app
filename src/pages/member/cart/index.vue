

<template>
  <view class="cart-wrapper">
  <view class="cart-icon-wrapper" @click="showCartList">
    <view class="icon-cart">
      <!-- 购物车图标 -->
      <text style="font-size: 40rpx;">🛒</text>
      <text v-if="totalCount > 0" class="badge">{{ totalCount > 99 ? '99+' : totalCount }}</text>
    </view>
    <view class="cart-total">
      <view class="price-row">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
        <text v-if="discountAmount > 0" class="discount-tip">已优惠¥{{ discountAmount.toFixed(2) }}</text>
      </view>
      <view class="delivery-row">
        <text class="delivery-tip">配送费 ¥{{ freightFee.toFixed(2) }}</text>
        <text class="coupon-entry" @click.stop="">
          {{  '优惠券' }}
        </text>
      </view>
      <!-- 新增：权益使用提示 -->
<!--      <view v-if="selectedRights.length > 0" class="right-tip">-->
<!--        <text v-if="selectedRights.includes(1)">本月8折券已用{{ monthlyDiscountCount }}/4次</text>-->
<!--        <text v-if="selectedRights.includes(2)">周四免费淀粉肠已锁定</text>-->
<!--      </view>-->
    </view>
  </view>
  <button class="submit-btn" :class="{ disabled: totalCount === 0 }">
    {{ totalCount === 0 ? '去选购' : `¥${totalPrice.toFixed(2)} 去结算` }}
  </button>
  </view>
</template>
<script setup lang="ts">
import {CartEvent} from "@/th4/mall/cart/ICart";
import {onMounted, onUnmounted, ref} from 'vue';
const props=defineProps<{cart: mall.Cart}>();
const visible=defineModel<boolean>('visible',{required:true});
const totalCount = ref(0);
const totalPrice = ref(0);
const discountAmount = ref(0);
const freightFee = ref(0);


const showCartList=()=>{
  visible.value=true;
}
const updateCart=()=>{
  totalCount.value=props.cart.getCartItemCount();
  totalPrice.value=props.cart.totalPrice;
}
onMounted(()=>{
  props.cart.on(CartEvent.CalculatePrice,updateCart)
})
onUnmounted(()=>{
  props.cart.off(CartEvent.CalculatePrice,updateCart)
})
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
.cart-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  .cart-icon-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    .icon-cart {
      position: relative;
      background-color: #333;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .badge {
        position: absolute;
        top: -5rpx;
        right: -5rpx;
        background-color: $primary-red;
        color: #fff;
        font-size: 20rpx;
        padding: 2rpx 10rpx;
        border-radius: 20rpx;
        min-width: 30rpx;
        text-align: center;
        border: 2px solid #fff;
      }
    }

    .cart-total {
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      flex: 1;

      .price-row {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;

        .total-label {
          font-size: 24rpx;
          color: $text-main;
        }

        .total-price {
          font-size: 36rpx;
          color: $primary-red;
          font-weight: bold;
          margin-left: 10rpx;
        }

        .discount-tip {
          font-size: 20rpx;
          color: $primary-red;
          margin-left: 10rpx;
        }
      }

      .delivery-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: 5rpx;

        .delivery-tip {
          font-size: 20rpx;
          color: $text-sub;
        }

        .coupon-entry {
          font-size: 22rpx;
          color: $primary-red;
        }
      }

      .right-tip {
        display: flex;
        flex-direction: column;
        margin-top: 5rpx;

        text {
          font-size: 20rpx;
          color: $text-sub;
        }
      }
    }
  }
  .submit-btn {
    width: 220rpx;
    height: 70rpx;
    background-color: $primary-red;
    color: #fff;
    border: none;
    border-radius: 35rpx;
    font-size: 28rpx;
    font-weight: bold;
    line-height: 70rpx;
    padding: 0;
    margin: 0;

    &.disabled {
      background-color: $disabled-color;
    }
  }
}
</style>