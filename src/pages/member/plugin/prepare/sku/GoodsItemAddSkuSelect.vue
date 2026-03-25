<template>
  <view v-if="goodsItem" class="spec-popup-mask" @click="close">
    <view class="spec-popup" @click.stop>
      <!-- 商品头部信息 -->
      <view class="spec-header">
        <image :src="goodsItem.image" class="spec-goods-img"></image>
        <view class="spec-goods-info">
          <text class="spec-goods-name">{{ goodsItem.name }}</text>
          <text class="spec-goods-price">¥{{ goodsItem.price.toFixed(2) }}</text>
        </view>
        <text class="close-spec" @click="close">×</text>
      </view>

      <!-- 规格选项列表 -->
      <scroll-view scroll-y="true" class="spec-content">
        <view
            v-for="(spec, sIndex) in goodsItem.specs"
            :key="sIndex"
            class="spec-group"
        >
          <text class="spec-title">{{ spec.name }}</text>
          <view class="spec-options">
            <text
                v-for="(option, oIndex) in spec.options"
                :key="oIndex"
                class="spec-option"
                :class="{ active: options[spec.name] === option }"
                @click="options[spec.name]=option"
            >{{ option }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 底部数量选择+确认按钮 -->
      <view class="spec-footer">
        <view class="num-control">
          <text>购买数量</text>
          <view class="btn-group">
            <text class="icon-btn minus" :class="{ disabled: num <= 1 }" @click="num > 1 && num--">-</text>
            <text class="num">{{ stock+num }}</text>
            <text class="icon-btn plus" :class="{ disabled: num >= 99 }" @click="num < 99 && num++">+</text>
          </view>
        </view>
        <button
            class="confirm-spec-btn"
            :class="{ disabled: !isSpecSelected }"
            @click="addCart"
        >
          加入购物车
        </button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
const props=defineProps<{cart:mall.Cart}>();
const goodsItem=ref<any>();
const options=ref<any>({});
const num=ref<number>(0)
const stock=computed(()=>{
  Object.keys(options.value).forEach(() => {})
  return props.cart.loadCartItem(goodsItem.value, options.value)?.num||0
})
/**
 * 验证规格是否选中
 */
const isSpecSelected = computed(() => {
  if (!goodsItem.value.specs || goodsItem.value.specs.length === 0) return true;
  for (let spec of goodsItem.value.specs) {
    if (!options.value[spec.name]) return false;
  }
  return true;
});
const addCart=()=>{
  if (isSpecSelected.value){
    props.cart.addGoodsItem(goodsItem.value, num.value, options.value);
    close();
  }
}
/**
 * 商品添加到购物车时未选择规格拦截器
 * @param _goodsItem
 * @param _num
 * @param _options
 */
const skuGoodsItemPrepare=(_goodsItem:any, _num:number, _options?:any)=>{
  // 判断商品规格
  if(_goodsItem.specs&&_goodsItem.specs.length>0){
    if(!_options){
      // 没有选规格
      goodsItem.value=_goodsItem;
      options.value={};
      num.value=1;
      return false;
    }
  }
  return true;
}
const close=()=>{
  goodsItem.value=null;
}
onMounted(()=>{
  if(props.cart.addGoodsItemAddPreparer){
    props.cart.addGoodsItemAddPreparer(skuGoodsItemPrepare)
  }
})
onUnmounted(()=>{
  if(props.cart.removeGoodsItemAddPreparer){
    props.cart.removeGoodsItemAddPreparer(skuGoodsItemPrepare)
  }
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
.spec-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .spec-popup {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    animation: slideUp 0.3s ease;
    max-height: 70vh;
    display: flex;
    flex-direction: column;

    .spec-header {
      display: flex;
      padding: 30rpx;
      position: relative;
      border-bottom: 1px solid $border-color;

      .spec-goods-img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        background-color: #eee;
      }
      .spec-goods-info {
        flex: 1;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .spec-goods-name {
          font-size: 30rpx;
          font-weight: bold;
          color: $text-main;
          margin-bottom: 10rpx;
        }
        .spec-goods-price {
          font-size: 32rpx;
          color: $primary-red;
          font-weight: bold;
        }
      }
      .close-spec {
        position: absolute;
        top: 20rpx;
        right: 30rpx;
        font-size: 40rpx;
        color: $text-sub;
        line-height: 1;
      }
    }

    .spec-content {
      flex: 1;
      padding: 0 30rpx;
      overflow-y: auto;

      .spec-group {
        padding: 30rpx 0;
        border-bottom: 1px solid #f5f5f5;
        .spec-title {
          font-size: 28rpx;
          font-weight: 500;
          color: $text-main;
          margin-bottom: 20rpx;
        }
        .spec-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20rpx;
          .spec-option {
            min-width: 120rpx;
            padding: 10rpx 20rpx;
            border: 1px solid $border-color;
            border-radius: 8rpx;
            text-align: center;
            font-size: 26rpx;
            color: $text-main;
            background-color: #f9f9f9;

            &.active {
              border-color: $primary-red;
              background-color: #fff5f5;
              color: $primary-red;
              font-weight: 500;
            }
          }
        }
      }
    }

    .spec-footer {
      padding: 30rpx;
      border-top: 1px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .num-control {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: $text-main;
        .btn-group {
          display: flex;
          align-items: center;
          margin-left: 20rpx;
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
            &.disabled {
              background-color: $disabled-color;
              color: #fff;
              border-color: $disabled-color;
            }
          }
          .num {
            width: 50rpx;
            text-align: center;
            font-size: 26rpx;
          }
        }
      }

      .confirm-spec-btn {
        width: 240rpx;
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
  }
}
</style>