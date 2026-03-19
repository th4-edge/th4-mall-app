<template>
  <view class="content">
    <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
            :duration="duration">
      <swiper-item>
        <view class="swiper-item uni-bg-red">A</view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item uni-bg-green">B</view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item uni-bg-blue">C</view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const indicatorDots = ref(true)
const autoplay = ref(true)
const interval = ref(5000)
const duration = ref(500)
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.swiper {
  width: 100%;
  height: 560rpx;
}
.swiper-item {
  display: block;
  height: 560rpx;
  line-height: 560rpx;
  text-align: center;
}
.swiper-list {
  margin-top: 40rpx;
  margin-bottom: 0;
}
.uni-common-mt {
  margin-top: 60rpx;
  position: relative;
}
.info {
  position: absolute;
  right: 20rpx;
}
.uni-padding-wrap {
  width: 550rpx;
  padding: 0 100rpx;
}
.uni-bg-blue {
  background-color: blue;
}
.uni-bg-green {
  background-color: green;
}
.uni-bg-red {
  background-color: red;
}
</style>
