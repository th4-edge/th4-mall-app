<template>
  <view v-if="visible" class="cart-popup-mask" @click="close">
    <view class="cart-popup" @click.stop>
      <view class="popup-header">
        <text class="popup-title">购物车</text>
        <text class="clear-btn" @click="clear">清空</text>
      </view>
      <scroll-view scroll-y="true" class="popup-list">
        <view v-for="item in cartItems" :key="item.id" class="popup-item">
          <view class="item-info">
            <text class="item-name">{{ item.data.name }}</text>
            <text v-if="item.sku" class="item-spec">{{ item.sku }}</text>
<!--            <text v-if="item.isCombo" class="combo-tag">组合商品</text>-->
          </view>
          <view class="item-control">
            <text class="item-price">¥{{ item.getTotalPrice().toFixed(2) }}</text>
            <view class="btn-group">
              <text class="icon-btn minus" @click="cartItemMinus(item, 1)">-</text>
              <text class="num">{{ item.num }}</text>
              <text class="icon-btn plus" @click="cartItemPlus(item, 1)">+</text>
            </view>
          </view>
        </view>
        <view v-if="cartItems.length === 0" class="empty-cart">
          <text>购物车还是空的，快去选购吧~</text>
        </view>
      </scroll-view>
    </view>
  </view>

</template>
<script setup lang="ts">
import {CartEvent} from "@/th4/mall/cart/ICart";
import {onMounted,onUnmounted, shallowRef, watch} from "vue";

const props=defineProps<{cart:mall.Cart}>();
const visible=defineModel<boolean>('visible',{required:true});
const cartItems=shallowRef<(mall.CartItem&{sku?:string})[]>([]);

const cartItemPlus=(cartItem:mall.CartItem,num:number)=>{
  props.cart.addGoodsItem(cartItem.data,num,cartItem.options)
}
const cartItemMinus=(cartItem:mall.CartItem,num:number)=>{
  props.cart.removeGoodsItem(cartItem.data,num,cartItem.options)
}

const clear=()=>{
  props.cart.clear();
}
const close=()=>{
  visible.value=false;
}
const updateCart=()=>{
  cartItems.value=props.cart.getCartItems();
}
onMounted(()=>{
  props.cart.on(CartEvent.CalculatePrice,updateCart)
})
onUnmounted(()=>{
  props.cart.off(CartEvent.CalculatePrice,updateCart)
})
watch(()=>visible.value,(visible)=>{
  if(visible){
    cartItems.value=props.cart.getCartItems();
  }
})
</script>
<style scoped lang="scss">
.cart-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .cart-popup {
    background-color: #fff;
    max-height: 60vh;
    border-radius: 20rpx 20rpx 0 0;
    animation: slideUp 0.3s ease;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1px solid $border-color;

      .popup-title {
        font-size: 30rpx;
        font-weight: bold;
        color: $text-main;
      }
      .clear-btn {
        font-size: 24rpx;
        color: $text-sub;
      }
      .close-btn {
        font-size: 40rpx;
        color: $text-sub;
        line-height: 1;
      }
    }

    .popup-list {
      max-height: 50vh;
      padding: 0 30rpx;
      box-sizing: border-box;
      .popup-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 1px solid #f5f5f5;

        .item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: flex-start;
          .item-name {
            font-size: 28rpx;
            color: $text-main;
            display: flex;
            align-items: center;
          }
          .item-spec {
            font-size: 22rpx;
            color: $text-sub;
            margin-top: 5rpx;
          }
          .combo-tag {
            font-size: 18rpx;
            color: #fff;
            background-color: $combo-purple;
            padding: 2rpx 8rpx;
            border-radius: 4rpx;
            margin-left: 10rpx;
            transform: scale(0.9);
          }
        }

        .item-control {
          display: flex;
          align-items: center;

          .item-price {
            font-size: 28rpx;
            color: $primary-red;
            font-weight: bold;
            margin-right: 30rpx;
          }

          .btn-group {
            display: flex;
            align-items: center;

            .icon-btn {
              width: 44rpx;
              height: 44rpx;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32rpx;
              font-weight: bold;
              border: 1px solid #ddd;
              background-color: #fff;
            }
            .num {
              width: 50rpx;
              text-align: center;
              font-size: 26rpx;
            }
          }
        }
      }
      .empty-cart, .empty-coupon {
        padding: 100rpx 0;
        text-align: center;
        font-size: 26rpx;
        color: $text-sub;
      }
    }
  }
}
</style>