

<template>
  <view class="notice-bar">
    <text class="notice-icon">📢</text>
    <swiper class="notice-swiper" circular vertical :autoplay="true" :interval="3000">
      <swiper-item v-for="(item, i) in notices" :key="i">
        <text class="notice-text">{{ item }}</text>
      </swiper-item>
    </swiper>
  </view>
</template>
<script setup lang="ts">
import {ref} from "vue";
defineProps<{shop:any}>()

const notices=ref([
    "新人专享：满30减5元！",
  "招牌炸年糕，外酥里嫩超好吃！",
  "每周四会员免费吃淀粉肠！",
  "每月4次8折券，最高减10元！"])
</script>
<style scoped lang="scss">
.notice-bar {
  display: flex;
  align-items: center;
  background-color: #fff8e8;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;

  .notice-icon {
    font-size: 24rpx;
    margin-right: 10rpx;
  }
  .notice-swiper {
    height: 36rpx;
    flex: 1;

    text {
      font-size: 22rpx;
      color: #ff8c00;
      line-height: 36rpx;
    }
  }
}
</style>