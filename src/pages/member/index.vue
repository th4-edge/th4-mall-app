

<template>
    <view class="page-container">
      <view class="top-header">
        <shop :shop="shop"/>
        <notice :shop="shop"/>
      </view>
      <view class="main-content">
        <!-- 分类菜单 -->
        <bill :data="menuData" :cart="cart"/>
      </view>
      <view class="bottom-bar">
        <!-- 购物车 -->
        <carte :cart="cart" v-model:visible="cartVisible"/>
        <!-- 购物车列表 -->
        <cart-list :cart="cart" v-model:visible="cartVisible"/>
      </view>
      <!-- 购物车插件 -->
      <view class="cart-plugin">
        <!-- 含规格商品添加到购物车时进行规格选择 -->
        <goods-item-add-sku-select :cart="cart"/>
        <!-- 规格商品减购时，弹出购物车列表进行选中对应规格数量减少 -->
        <goods-item-remove-sku-select :cart="cart" v-model:visible="cartVisible"/>
      </view>
    </view>
</template>
<script setup lang="ts">
import Shop from '@/pages/member/shop/index.vue'
import Notice from '@/pages/member/notice/index.vue'
import Bill from '@/pages/member/bill/index.vue'
import Carte from '@/pages/member/cart/index.vue'
import CartList from '@/pages/member/cart/list/index.vue'
import GoodsItemAddSkuSelect  from "@/pages/member/plugin/prepare/sku/GoodsItemAddSkuSelect.vue";
import GoodsItemRemoveSkuSelect  from "@/pages/member/plugin/prepare/sku/GoodsItemRemoveSkuSelect.vue";
import {ref} from "vue";
import {menuData} from "@/pages/member/data";
import {ICart} from "@/th4/mall/cart/ICart";
import {GoodsItemAddPreparer} from "@/th4/mall/cart/plugin/GoodsItemAddPreparer";
import {GoodsItemRemovePreparer} from "@/th4/mall/cart/plugin/GoodsItemRemovePreparer";
const shop=ref({name:'青岛店'});
const cart=new ICart();
cart.usePlugin(GoodsItemAddPreparer);
cart.usePlugin(GoodsItemRemovePreparer);
const cartVisible=ref(false);
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
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  .top-header {
    background-color: #fff;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid $border-color;
    z-index: 10;
  }
  .main-content{
    flex: 1;
    overflow: hidden;
  }
  .bottom-bar{
    height: 140rpx;
    background-color: #fff;
    padding: 0 20rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    position: relative;
    z-index: 20;
  }
}
</style>