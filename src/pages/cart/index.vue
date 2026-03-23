<template>
  <view class="page-container">

    <!-- 1. 顶部：店招与公告 -->
    <view class="top-header">
      <view class="store-info">
        <text class="store-name">炸串(青岛店)</text>
        <text class="store-desc">月售1200+ 炸串界的扛把子</text>
      </view>
      <!-- 公告滚动 -->
      <view class="notice-bar">
        <text class="notice-icon">📢</text>
        <swiper class="notice-swiper" circular vertical :autoplay="true" :interval="3000">
          <swiper-item v-for="(item, i) in notices" :key="i">
            <text class="notice-text">{{ item }}</text>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 2. 主体：左右联动列表 -->
    <view class="main-content">
      <!-- 左侧：分类 -->
      <scroll-view
          scroll-y
          class="left-nav"
          :scroll-into-view="leftScrollId"
          scroll-with-animation
      >
        <view
            v-for="(cat, index) in menuData"
            :key="index"
            :id="'nav-' + index"
            class="nav-item"
            :class="{ active: currentIndex === index }"
            @click="clickLeftNav(index)"
        >
          <!-- 分类角标（如热销、新品） -->
          <text v-if="cat.tag" class="cat-tag">{{ cat.tag }}</text>
          <text class="cat-name">{{ cat.name }}</text>
          <view v-if="currentIndex === index" class="active-bar"></view>
        </view>
      </scroll-view>

      <!-- 右侧：商品列表 -->
      <scroll-view
          scroll-y
          class="right-goods"
          :scroll-into-view="goodsScrollId"
          scroll-with-animation
          @scroll="onRightScroll"
      >
        <view
            v-for="(cat, cIndex) in menuData"
            :key="cIndex"
            :id="'goods-' + cIndex"
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
            <image :src="item.image" mode="aspectFill" class="goods-img"></image>
            <view class="goods-info">
              <view class="goods-name">
                <text>{{ item.name }}</text>
                <text v-if="item.hot" class="hot-tag">爆款</text>
              </view>
              <text class="goods-desc">{{ item.desc }}</text>
              <view class="goods-bottom">
                <text class="price">¥{{ item.price }}</text>
                <text class="sales">月销{{ item.sales }}</text>
                <!-- 加购按钮 -->
                <view class="cart-btn-group">
                  <text
                      v-if="getCartCount(item.id) > 0"
                      class="icon-btn minus"
                      @click="updateCart(item, -1)"
                  >-</text>
                  <text v-if="getCartCount(item.id) > 0" class="cart-num">{{ getCartCount(item.id) }}</text>
                  <text
                      class="icon-btn plus"
                      :class="{ bounce: item.isAdding }"
                      @click="openSpecPopup(item)"
                  >+</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 底部占位 -->
        <view style="height: 120rpx;"></view>
      </scroll-view>
    </view>

    <!-- 3. 底部：购物车+结算栏（新增优惠券/优惠信息） -->
    <view class="bottom-bar">
      <view class="cart-icon-wrapper" @click="showCart = true">
        <view class="icon-cart">
          <!-- 购物车图标 -->
          <text style="font-size: 40rpx;">🛒</text>
          <text v-if="totalCount > 0" class="badge">{{ totalCount > 99 ? '99+' : totalCount }}</text>
        </view>
        <view class="cart-total">
          <view class="price-row">
            <text class="total-label">合计</text>
            <text class="total-price">¥{{ payPrice.toFixed(2) }}</text>
            <text v-if="discountAmount > 0" class="discount-tip">已优惠¥{{ discountAmount.toFixed(2) }}</text>
          </view>
          <view class="delivery-row">
            <text class="delivery-tip">配送费 ¥{{ freightFee.toFixed(2) }}</text>
            <text class="coupon-entry" @click.stop="openCouponPopup">
              {{ selectedCoupon ? '已选1张券' : '优惠券' }}
            </text>
          </view>
        </view>
      </view>
      <button class="submit-btn" :class="{ disabled: totalCount === 0 }">
        {{ totalCount === 0 ? '去选购' : `¥${payPrice.toFixed(2)} 去结算` }}
      </button>
    </view>

    <!-- 4. 购物车弹窗（新增规格显示） -->
    <view v-if="showCart" class="cart-popup-mask" @click="showCart = false">
      <view class="cart-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">购物车</text>
          <text class="clear-btn" @click="clearCart">清空</text>
        </view>
        <scroll-view scroll-y class="popup-list">
          <view v-for="item in cartList" :key="item.cartKey" class="popup-item">
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text v-if="item.specDesc" class="item-spec">{{ item.specDesc }}</text>
            </view>
            <view class="item-control">
              <text class="item-price">¥{{ (item.price * item.count).toFixed(2) }}</text>
              <view class="btn-group">
                <text class="icon-btn minus" @click="updateCart(item, -1)">-</text>
                <text class="num">{{ item.count }}</text>
                <text class="icon-btn plus" @click="updateCart(item, 1)">+</text>
              </view>
            </view>
          </view>
          <view v-if="cartList.length === 0" class="empty-cart">
            <text>购物车还是空的，快去选购吧~</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 5. 商品规格选择弹窗（新增核心功能） -->
    <view v-if="specPopupVisible" class="spec-popup-mask" @click="closeSpecPopup">
      <view class="spec-popup" @click.stop>
        <!-- 商品头部信息 -->
        <view class="spec-header">
          <image :src="currentSpecGoods.image" class="spec-goods-img"></image>
          <view class="spec-goods-info">
            <text class="spec-goods-name">{{ currentSpecGoods.name }}</text>
            <text class="spec-goods-price">¥{{ currentSpecGoods.price }}</text>
          </view>
          <text class="close-spec" @click="closeSpecPopup">×</text>
        </view>

        <!-- 规格选项列表 -->
        <scroll-view scroll-y class="spec-content">
          <view
              v-for="(spec, sIndex) in currentSpecGoods.specs"
              :key="sIndex"
              class="spec-group"
          >
            <text class="spec-title">{{ spec.name }}</text>
            <view class="spec-options">
              <text
                  v-for="(option, oIndex) in spec.options"
                  :key="oIndex"
                  class="spec-option"
                  :class="{ active: selectedSpecs[spec.name] === option }"
                  @click="selectSpec(spec.name, option)"
              >{{ option }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 底部数量选择+确认按钮 -->
        <view class="spec-footer">
          <view class="num-control">
            <text>购买数量</text>
            <view class="btn-group">
              <text class="icon-btn minus" :class="{ disabled: specBuyNum <= 1 }" @click="specBuyNum > 1 && specBuyNum--">-</text>
              <text class="num">{{ specBuyNum }}</text>
              <text class="icon-btn plus" :class="{ disabled: specBuyNum >= 99 }" @click="specBuyNum < 99 && specBuyNum++">+</text>
            </view>
          </view>
          <button
              class="confirm-spec-btn"
              :class="{ disabled: !isSpecSelected }"
              @click="confirmAddCart"
          >
            加入购物车
          </button>
        </view>
      </view>
    </view>

    <!-- 6. 优惠券&权益选择弹窗（新增核心功能） -->
    <view v-if="couponPopupVisible" class="coupon-popup-mask" @click="closeCouponPopup">
      <view class="coupon-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">优惠选择</text>
          <text class="close-btn" @click="closeCouponPopup">×</text>
        </view>

        <!-- tab切换：优惠券 / 会员权益 -->
        <view class="coupon-tab">
          <text
              class="tab-item"
              :class="{ active: currentTab === 'coupon' }"
              @click="currentTab = 'coupon'"
          >优惠券</text>
          <text
              class="tab-item"
              :class="{ active: currentTab === 'right' }"
              @click="currentTab = 'right'"
          >会员权益</text>
        </view>

        <!-- 优惠券列表 -->
        <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'coupon'">
          <view class="coupon-title">可用优惠券</view>
          <view
              v-for="coupon in availableCoupon"
              :key="coupon.id"
              class="coupon-item"
              :class="{ selected: selectedCoupon?.id === coupon.id }"
              @click="selectCoupon(coupon)"
          >
            <view class="coupon-left">
              <text class="coupon-amount">
                {{ coupon.type === 'discount' ? `${coupon.discount}折` : `¥${coupon.amount}` }}
              </text>
              <text class="coupon-name">{{ coupon.name }}</text>
              <text class="coupon-limit">{{ coupon.limit }}</text>
            </view>
            <view class="coupon-right">
              <text v-if="selectedCoupon?.id === coupon.id" class="selected-tag">已选中</text>
              <text v-else class="select-btn">立即使用</text>
            </view>
          </view>

          <view class="coupon-title">不可用优惠券</view>
          <view
              v-for="coupon in unavailableCoupon"
              :key="coupon.id"
              class="coupon-item disabled"
          >
            <view class="coupon-left">
              <text class="coupon-amount">
                {{ coupon.type === 'discount' ? `${coupon.discount}折` : `¥${coupon.amount}` }}
              </text>
              <text class="coupon-name">{{ coupon.name }}</text>
              <text class="coupon-limit">{{ coupon.limit }}</text>
            </view>
            <view class="coupon-right">
              <text class="disabled-btn">不可用</text>
            </view>
          </view>

          <view v-if="couponList.length === 0" class="empty-coupon">
            <text>暂无可用优惠券</text>
          </view>
        </scroll-view>

        <!-- 会员权益列表 -->
        <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'right'">
          <view class="right-item" v-for="right in memberRights" :key="right.id">
            <view class="right-info">
              <text class="right-name">{{ right.name }}</text>
              <text class="right-desc">{{ right.desc }}</text>
            </view>
            <switch
                :checked="selectedRights.includes(right.id)"
                @change="toggleRight(right.id, $event)"
                color="#e6212a"
            />
          </view>
        </scroll-view>

        <!-- 底部确认按钮 -->
        <view class="coupon-footer">
          <button class="confirm-coupon-btn" @click="confirmCoupon">确认使用</button>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup >
import { ref, computed, onMounted, nextTick } from 'vue';

// --- 1. 基础模拟数据 ---
import {notices,menuData,couponList,memberRights} from "@/pages/cart/data";



// 会员权益数据


// --- 2. 基础状态定义 ---
const currentIndex = ref(0);
const leftScrollId = ref('');
const goodsScrollId = ref('');
const groupTops = ref([]);
const cartList = ref([]); // 购物车结构：{ cartKey, id, name, price, count, image, specDesc, specs }
const showCart = ref(false);
const freightFee = ref(2); // 基础配送费

// --- 3. 规格选择弹窗状态 ---
const specPopupVisible = ref(false);
const currentSpecGoods = ref({});
const selectedSpecs = ref({});
const specBuyNum = ref(1);

// --- 4. 优惠券&权益弹窗状态 ---
const couponPopupVisible = ref(false);
const currentTab = ref('coupon');
const selectedCoupon = ref(null);
const selectedRights = ref([]);

// --- 5. 核心计算属性 ---
// 购物车总数量
const totalCount = computed(() => {
  return cartList.value.reduce((sum, item) => sum + item.count, 0);
});

// 商品原价总和（未优惠）
const originalTotalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => sum + item.price * item.count, 0);
});

// 会员权益优惠金额
const rightDiscountAmount = computed(() => {
  let discount = 0;
  // 会员9折权益
  if (selectedRights.value.includes(1)) {
    discount += originalTotalPrice.value * (1 - memberRights.value[0].discount);
  }
  // 免配送费权益
  if (selectedRights.value.includes(2)) {
    discount += freightFee.value;
  }
  return discount;
});

// 优惠券优惠金额
const couponDiscountAmount = computed(() => {
  if (!selectedCoupon.value) return 0;
  const coupon = selectedCoupon.value;
  const basePrice = originalTotalPrice.value;

  // 无门槛券
  if (coupon.type === 'normal') {
    return Math.min(coupon.amount, basePrice);
  }
  // 满减券
  if (coupon.type === 'full') {
    if (basePrice >= coupon.threshold) {
      return Math.min(coupon.amount, basePrice);
    }
  }
  // 折扣券
  if (coupon.type === 'discount') {
    const discount = basePrice * (1 - coupon.discount / 10);
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  }
  return 0;
});

// 总优惠金额
const discountAmount = computed(() => {
  // 规则：会员权益和优惠券互斥，取优惠最大的（可自行修改为叠加规则）
  return Math.max(rightDiscountAmount.value, couponDiscountAmount.value);
});

// 最终实付金额
const payPrice = computed(() => {
  // 实付 = 商品原价 + 配送费 - 总优惠
  let pay = originalTotalPrice.value + freightFee.value - discountAmount.value;
  // 最低实付0元
  return pay < 0 ? 0 : pay;
});

// 可用优惠券列表
const availableCoupon = computed(() => {
  return couponList.value.filter(coupon => {
    if (coupon.status !== 1) return false;
    // 满减券门槛判断
    if (coupon.type === 'full' && originalTotalPrice.value < coupon.threshold) return false;
    return true;
  });
});

// 不可用优惠券列表
const unavailableCoupon = computed(() => {
  return couponList.value.filter(coupon => {
    if (coupon.status !== 1) return true;
    if (coupon.type === 'full' && originalTotalPrice.value < coupon.threshold) return true;
    return false;
  });
});

// 规格是否全部选中
const isSpecSelected = computed(() => {
  if (!currentSpecGoods.value.specs || currentSpecGoods.value.specs.length === 0) return true;
  // 检查所有规格是否都有选中值
  for (let spec of currentSpecGoods.value.specs) {
    if (!selectedSpecs.value[spec.name]) return false;
  }
  return true;
});

// --- 6. 基础联动逻辑 ---
// 左侧点击 -> 右侧滚动
const clickLeftNav = (index) => {
  currentIndex.value = index;
  goodsScrollId.value = `goods-${index}`;
};

// 右侧滚动 -> 左侧高亮
const onRightScroll = (e) => {
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
      let tops = [];
      let top = 0;
      data.forEach(rect => {
        tops.push(top);
        top += rect.height;
      });
      groupTops.value = tops;
    }).exec();
  });
};

// --- 7. 商品规格选择核心逻辑 ---
// 打开规格弹窗
const openSpecPopup = (goods) => {
  // 无规格商品，直接加购
  if (!goods.specs || goods.specs.length === 0) {
    updateCart(goods, 1);
    return;
  }

  // 有规格商品，打开弹窗
  currentSpecGoods.value = goods;
  specBuyNum.value = 1;
  // 初始化默认规格
  selectedSpecs.value = {};
  goods.specs.forEach(spec => {
    selectedSpecs.value[spec.name] = spec.default;
  });
  specPopupVisible.value = true;
};

// 关闭规格弹窗
const closeSpecPopup = () => {
  specPopupVisible.value = false;
  currentSpecGoods.value = {};
  selectedSpecs.value = {};
  specBuyNum.value = 1;
};

// 选择规格
const selectSpec = (specName, option) => {
  selectedSpecs.value[specName] = option;
};

// 确认加购
const confirmAddCart = () => {
  if (!isSpecSelected.value) return;

  const goods = currentSpecGoods.value;
  // 生成规格描述文本
  const specDesc = Object.values(selectedSpecs.value).join(' · ');
  // 生成购物车唯一key（商品id+规格，不同规格分开存储）
  const cartKey = `${goods.id}-${JSON.stringify(selectedSpecs.value)}`;

  // 查找购物车中是否已有同规格商品
  const existedItem = cartList.value.find(item => item.cartKey === cartKey);
  if (existedItem) {
    // 已有则累加数量
    existedItem.count += specBuyNum.value;
  } else {
    // 没有则新增
    cartList.value.push({
      cartKey,
      id: goods.id,
      name: goods.name,
      price: goods.price,
      count: specBuyNum.value,
      image: goods.image,
      specDesc,
      specs: { ...selectedSpecs.value }
    });
  }

  // 加购动画
  goods.isAdding = true;
  setTimeout(() => goods.isAdding = false, 300);

  // 关闭弹窗
  closeSpecPopup();
};

// --- 8. 购物车核心逻辑 ---
// 获取商品在购物车中的总数量（忽略规格）
const getCartCount = (id) => {
  return cartList.value.filter(item => item.id === id).reduce((sum, item) => sum + item.count, 0);
};

// 更新购物车数量（加减操作）
const updateCart = (item, num) => {
  // 购物车列表中的item，直接操作
  if (item.cartKey) {
    const target = cartList.value.find(i => i.cartKey === item.cartKey);
    if (target) {
      target.count += num;
      if (target.count <= 0) {
        cartList.value = cartList.value.filter(i => i.cartKey !== item.cartKey);
      }
    }
    return;
  }

  // 商品列表中的无规格商品，直接操作
  const cartKey = `${item.id}-${JSON.stringify({})}`;
  const target = cartList.value.find(i => i.cartKey === cartKey);
  if (target) {
    target.count += num;
    if (target.count <= 0) {
      cartList.value = cartList.value.filter(i => i.cartKey !== cartKey);
    }
  } else {
    if (num > 0) {
      cartList.value.push({
        cartKey,
        id: item.id,
        name: item.name,
        price: item.price,
        count: 1,
        image: item.image,
        specDesc: '',
        specs: {}
      });
    }
  }

  // 加购动画
  if (num > 0) {
    item.isAdding = true;
    setTimeout(() => item.isAdding = false, 300);
  }
};

// 清空购物车
const clearCart = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空购物车吗？',
    success: (res) => {
      if (res.confirm) {
        cartList.value = [];
        showCart.value = false;
        // 清空优惠选择
        selectedCoupon.value = null;
        selectedRights.value = [];
      }
    }
  });
};

// --- 9. 优惠券&权益核心逻辑 ---
// 打开优惠券弹窗
const openCouponPopup = () => {
  if (totalCount.value === 0) {
    uni.showToast({ title: '请先选购商品', icon: 'none' });
    return;
  }
  couponPopupVisible.value = true;
  currentTab.value = 'coupon';
};

// 关闭优惠券弹窗
const closeCouponPopup = () => {
  couponPopupVisible.value = false;
};

// 选择优惠券
const selectCoupon = (coupon) => {
  // 取消选中
  if (selectedCoupon.value?.id === coupon.id) {
    selectedCoupon.value = null;
  } else {
    // 选中新的，清空权益（互斥规则）
    selectedCoupon.value = coupon;
    selectedRights.value = [];
  }
};

// 切换会员权益
const toggleRight = (rightId, e) => {
  const isChecked = e.detail.value;
  if (isChecked) {
    selectedRights.value.push(rightId);
    // 选中权益，清空优惠券（互斥规则）
    selectedCoupon.value = null;
  } else {
    selectedRights.value = selectedRights.value.filter(id => id !== rightId);
  }
};

// 确认优惠选择
const confirmCoupon = () => {
  closeCouponPopup();
  uni.showToast({
    title: discountAmount.value > 0 ? `已优惠¥${discountAmount.toFixed(2)}` : '已选择优惠',
    icon: 'success'
  });
};

// --- 10. 生命周期 ---
onMounted(() => {
  setTimeout(() => {
    initHeights();
  }, 300);
});
</script>

<style src="./index.scss" lang="scss" scoped>

</style>