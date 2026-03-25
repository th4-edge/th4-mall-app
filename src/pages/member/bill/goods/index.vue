

<template>
  <view class="goods-item">
  <image :src="goodsItem.image" mode="aspectFill" class="goods-img"></image>
  <view class="goods-info">
    <view class="goods-name">
      <text>{{ goodsItem.name }}</text>
      <text v-if="goodsItem.hot" class="hot-tag">爆款</text>
      <!-- 新增：特价标签 -->
      <text v-if="goodsItem.specialPrice" class="special-tag">特价</text>
    </view>
    <text class="goods-desc">{{ goodsItem.desc }}</text>
    <view class="goods-bottom">
      <!-- 新增：显示原价+特价 -->
      <view class="price-group">
        <text class="price">¥{{ goodsItem.price.toFixed(2) }}</text>
        <text v-if="true" class="original-price">¥{{ goodsItem.price.toFixed(2) }}</text>
      </view>
<!--      <text class="sales">月销{{ goodsItem.sales }}</text>-->
      <!-- 加购按钮 -->
      <view class="cart-btn-group">
        <text
            v-if="num > 0"
            class="icon-btn minus"
            @click="minusCart"
        >-</text>
        <text v-if="num > 0" class="cart-num">{{ num }}</text>
        <text
            class="icon-btn plus"
            :class="{ bounce: goodsItem.isAdding }"
            @click="plusCart"
        >+</text>
      </view>
    </view>
  </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref} from 'vue';
import {CartEvent} from "@/th4/mall/cart/ICart";

const props=defineProps<{goodsItem:any,cart:mall.Cart }>();

const num=ref<number>(0);

const loadCartItem=(_cartItem:mall.CartItem)=>{
    if(_cartItem&&_cartItem.data.id===props.goodsItem.id){
      num.value=props.cart.groupCartItem(props.goodsItem).reduce((total,item)=>total+item.num,0);
    }
}
const plusCart=()=>{
  props.cart.addGoodsItem(props.goodsItem,1);
}
const minusCart=()=>{
  props.cart.removeGoodsItem(props.goodsItem,1);
}
onMounted(()=>{
  props.cart.on(CartEvent.CartItemChange,loadCartItem)
})
onUnmounted(()=>{
  props.cart.off(CartEvent.CartItemChange,loadCartItem)
})
</script>
<style lang="scss" scoped>
.goods-item {
  display: flex;
  margin-bottom: 30rpx;
  position: relative;
  width: 100%;
  .goods-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    background-color: #eee;
  }

  .goods-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 28rpx;
      color: $text-main;
      font-weight: 500;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .hot-tag {
        font-size: 20rpx;
        color: $primary-red;
        border: 1px solid $primary-red;
        padding: 0 6rpx;
        border-radius: 4rpx;
        margin-left: 10rpx;
        transform: scale(0.9);
      }
      .special-tag {
        font-size: 20rpx;
        color: #fff;
        background-color: $special-yellow;
        padding: 0 6rpx;
        border-radius: 4rpx;
        margin-left: 10rpx;
        transform: scale(0.9);
      }
    }

    .goods-desc {
      font-size: 22rpx;
      color: $text-sub;
      margin-top: 5rpx;
    }

    .goods-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .price-group {
        display: flex;
        align-items: baseline;
        .price {
          font-size: 32rpx;
          color: $primary-red;
          font-weight: bold;
        }
        .original-price {
          font-size: 22rpx;
          color: $text-sub;
          text-decoration: line-through;
          margin-left: 10rpx;
        }
      }
      .sales {
        font-size: 20rpx;
        color: $text-sub;
        margin-left: 10rpx;
        flex: 1;
      }

      .cart-btn-group {
        display: flex;
        align-items: center;

        .cart-num {
          font-size: 26rpx;
          margin: 0 10rpx;
          min-width: 30rpx;
          text-align: center;
        }

        .icon-btn {
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32rpx;
          font-weight: bold;
          line-height: 1;

          &.plus {
            background-color: $primary-red;
            color: #fff;
            &.bounce {
              animation: bounceIn 0.3s;
            }
          }
          &.minus {
            background-color: #fff;
            color: $text-main;
            border: 1px solid #ddd;
          }
          &.disabled {
            background-color: $disabled-color;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>