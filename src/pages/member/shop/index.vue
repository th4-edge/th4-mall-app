<template>
  <view class="store-info">
    <text class="store-name">炸串({{ shop.name || '测试门店' }})</text>
    <text class="store-desc">月售1200+ 炸串界的扛把子</text>
  </view>
</template>
<script lang="ts" setup>
defineProps<{ shop: any }>()
</script>
<style lang="scss" scoped>
$primary-red: #e6212a;
$light-bg: #f7f8fa;
$text-main: #333;
$text-sub: #999;
$border-color: #eee;
$disabled-color: #ccc;
$special-yellow: #ff9900;
$combo-purple: #9933ff;
.store-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 15rpx;

  .store-name {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-main;
  }

  .store-desc {
    font-size: 22rpx;
    color: $text-sub;
    margin-top: 5rpx;
  }
}
</style>