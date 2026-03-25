<template>
  <view class="menu">
    <!-- 左侧：分类 -->
    <scroll-view :scroll-into-view="leftScrollId" class="left-nav" scroll-with-animation scroll-y>
      <view
          v-for="(cat, index) in data"
          :id="'nav-' + index"
          :key="index"
          :class="{ active: currentIndex === index }"
          class="nav-item"
          @click="clickLeftNav(index)"
      >
        <!-- 分类角标（如热销、新品） -->
        <text v-if="cat.tag" class="cat-tag">{{ cat.tag }}</text>
        <text class="cat-name">{{ cat.name }}</text>
        <view v-if="currentIndex === index" class="active-bar"></view>
      </view>
    </scroll-view>

    <!-- 右侧：商品列表 -->
    <scroll-view :scroll-into-view="goodsScrollId" class="right-goods" scroll-with-animation scroll-y
                 @scroll="onRightScroll">
      <view
          v-for="(cat, cIndex) in data"
          :id="'goods-' + cIndex"
          :key="cIndex"
          class="category-box"
      >
        <!-- 分类标题 -->
        <view class="category-title">{{ cat.name }}</view>

        <!-- 商品列表 -->
        <view
            v-for="(item, gIndex) in cat.items"
            :key="item.id"
            class="goods-item"
        >
                  <goods-item :goodsItem="item" :cart="cart"></goods-item>
        </view>
      </view>
      <!-- 底部占位 -->
      <view style="height: 120rpx;">

      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import GoodsItem from '@/pages/member/bill/goods/index.vue'
import {nextTick, onMounted, ref} from "vue";

const props=defineProps<{ data: any[],cart:mall.Cart }>();
const currentIndex = ref(0);
const goodsScrollId = ref();
const groupTops = ref<any[]>([]);
const leftScrollId = ref('');
const clickLeftNav = (index: number) => {
  currentIndex.value = index;
  goodsScrollId.value = `goods-${index}`;
};
const onRightScroll = (e: any) => {
  const scrollTop = e.detail.scrollTop;
  const scrollVal = scrollTop + 20;

  for (let i = 0; i < groupTops.value.length; i++) {
    let height1 = groupTops.value[i];
    let height2 = groupTops.value[i + 1];

    if (!height2) {
      if (scrollVal >= height1) {
        currentIndex.value = i;
        leftScrollId.value = `nav-${i}`;
      }
      continue;
    }

    if (scrollVal >= height1 && scrollVal < height2) {
      currentIndex.value = i;
      leftScrollId.value = `nav-${i}`;
      return;
    }
  }
};
// 初始化计算右侧分类高度
const initHeights = () => {
  nextTick(() => {
    const query = uni.createSelectorQuery().in(getCurrentPages()[getCurrentPages().length - 1]);
    query.selectAll('.category-box').boundingClientRect(data => {
      let tops: any[] = [];
      let top = 0;
      // @ts-ignore
      data.forEach((rect: any) => {
        tops.push(top);
        top += rect.height;
      });
      groupTops.value = tops;
    }).exec();
  });
};
onMounted(() => {
  setTimeout(() => {
    initHeights();
  }, 300);
});
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
.menu {
  display: flex;
  height: 100%;
  background-color: red;

  .left-nav {
    width: 180rpx;
    height: 100%;
    background-color: $light-bg;

    .nav-item {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      color: #666;
      position: relative;
      background-color: $light-bg;

      &.active {
        background-color: #fff;
        color: $primary-red;
        font-weight: bold;

        .active-bar {
          position: absolute;
          left: 0;
          top: 30rpx;
          bottom: 30rpx;
          width: 6rpx;
          background-color: $primary-red;
          border-radius: 0 4rpx 4rpx 0;
        }
      }

      .cat-tag {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        font-size: 16rpx;
        background-color: $primary-red;
        color: #fff;
        padding: 2rpx 6rpx;
        border-radius: 4rpx;
        transform: scale(0.8);
      }
    }
  }

  .right-goods {
    flex: 1;
    height: 100%;
    padding: 0 20rpx;
    background-color: #fff;

    .category-box {
      padding-bottom: 20rpx;

      .category-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $text-main;
        padding: 20rpx 0;
        background-color: #fff;
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .goods-item {
        margin-bottom: 30rpx;
        position: relative;
      }
    }
  }
}
</style>