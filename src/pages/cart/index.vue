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
                <!-- 新增：特价标签 -->
                <text v-if="getSpecialPrice(item) !== null" class="special-tag">特价</text>
              </view>
              <text class="goods-desc">{{ item.desc }}</text>
              <view class="goods-bottom">
                <!-- 新增：显示原价+特价 -->
                <view class="price-group">
                  <text class="price">¥{{ getFinalGoodsPrice(item).toFixed(2) }}</text>
                  <text v-if="getSpecialPrice(item) !== null" class="original-price">¥{{ item.price.toFixed(2) }}</text>
                </view>
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

    <!-- 3. 底部：购物车+结算栏（新增权益使用次数提示） -->
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
          <!-- 新增：权益使用提示 -->
          <view v-if="selectedRights.length > 0" class="right-tip">
            <text v-if="selectedRights.includes(1)">本月8折券已用{{ monthlyDiscountCount }}/4次</text>
            <text v-if="selectedRights.includes(2)">周四免费淀粉肠已锁定</text>
          </view>
        </view>
      </view>
      <button class="submit-btn" :class="{ disabled: totalCount === 0 }">
        {{ totalCount === 0 ? '去选购' : `¥${payPrice.toFixed(2)} 去结算` }}
      </button>
    </view>

    <!-- 4. 购物车弹窗（新增规格显示、组合商品标识） -->
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
              <text v-if="item.isCombo" class="combo-tag">组合商品</text>
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
            <text class="spec-goods-price">¥{{ getFinalGoodsPrice(currentSpecGoods).toFixed(2) }}</text>
          </view>
          <text class="close-spec" @click="closeSpecPopup">×</text>
        </view>

        <!-- 规格选项列表 -->
        <scroll-view scroll-y="true" class="spec-content">
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

        <!-- 优惠券列表（新增4种类型） -->
        <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'coupon'">
          <view class="coupon-title">可用优惠券</view>
          <view
              v-for="coupon in availableCoupon"
              :key="coupon.id"
              class="coupon-item"
              :class="{ selected: selectedCoupon?.id === coupon.id, combo: coupon.type === 'combo' }"
              @click="selectCoupon(coupon)"
          >
            <view class="coupon-left">
              <text class="coupon-amount">
                {{ getCouponAmountText(coupon) }}
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
              :class="{ combo: coupon.type === 'combo' }"
          >
            <view class="coupon-left">
              <text class="coupon-amount">
                {{ getCouponAmountText(coupon) }}
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

        <!-- 会员权益列表（新增2种复杂权益） -->
        <scroll-view scroll-y class="coupon-content" v-if="currentTab === 'right'">
          <view class="right-item" v-for="right in memberRights" :key="right.id">
            <view class="right-info">
              <text class="right-name">{{ right.name }}</text>
              <text class="right-desc">{{ right.desc }}</text>
              <!-- 新增：权益使用状态/限制提示 -->
              <text v-if="right.id === 1" class="right-status">
                本月已用{{ monthlyDiscountCount }}/4次
                <text v-if="monthlyDiscountCount >= 4" class="right-status-red">（已用完）</text>
              </text>
              <text v-if="right.id === 2" class="right-status">
                {{ isThursday ? '今天可用！' : '每周四可用' }}
              </text>
            </view>
            <switch
                :checked="selectedRights.includes(right.id)"
                @change="toggleRight(right.id, $event)"
                color="#e6212a"
                :disabled="!isRightAvailable(right.id)"
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

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

// --- 1. 基础模拟数据（新增组合商品、淀粉肠、复杂优惠券/权益） ---
const notices = ref([
  "新人专享：满30减5元！",
  "招牌炸年糕，外酥里嫩超好吃！",
  "每周四会员免费吃淀粉肠！",
  "每月4次8折券，最高减10元！"
]);

// 商品数据（新增组合商品、淀粉肠、特价商品标识）
const menuData = ref([
  {
    name: '必点招牌',
    tag: ' HOT ',
    items: [
      {
        id: 1,
        name: '招牌五花肉',
        desc: '肥而不腻 外焦里嫩',
        price: 12,
        sales: 999,
        hot: true,
        image: 'https://via.placeholder.com/200x200/ffcccc/ffffff?text=Pork',
        specs: [
          { name: '辣度', options: ['不辣', '微辣', '中辣', '特辣', '爆辣'], default: '微辣' }
        ]
      },
      {
        id: 2,
        name: '喜姐掌中宝',
        desc: '嘎嘣脆 鸡肉味',
        price: 15,
        sales: 856,
        hot: true,
        image: 'https://via.placeholder.com/200x200/ccffcc/333333?text=Cartilage',
        specs: [
          { name: '辣度', options: ['不辣', '微辣', '中辣', '特辣'], default: '微辣' },
          { name: '份量', options: ['5串', '10串', '20串'], default: '5串' }
        ]
      },
      {
        id: 3,
        name: '秘制炸年糕',
        desc: '甜辣酱绝配',
        price: 6,
        sales: 1200,
        image: 'https://via.placeholder.com/200x200/ccccff/333333?text=RiceCake',
        specs: [
          { name: '口味', options: ['甜辣酱', '番茄酱', '原味'], default: '甜辣酱' }
        ]
      },
      // 新增：淀粉肠（用于周四免费权益）
      {
        id: 4,
        name: '经典淀粉肠',
        desc: '童年的味道',
        price: 3,
        sales: 2000,
        hot: true,
        image: 'https://via.placeholder.com/200x200/ffffcc/333333?text=StarchSausage',
        specs: [
          { name: '辣度', options: ['不辣', '微辣', '中辣'], default: '微辣' }
        ]
      },
    ]
  },
  {
    name: '经典炸串',
    items: [
      {
        id: 5,
        name: '牛肉小串',
        desc: '鲜嫩多汁',
        price: 18,
        sales: 456,
        image: 'https://via.placeholder.com/200x200',
        specs: [
          { name: '辣度', options: ['不辣', '微辣', '中辣', '特辣'], default: '微辣' }
        ]
      },
      {
        id: 6,
        name: '羊肉串',
        desc: '正宗羊肉',
        price: 20,
        sales: 321,
        image: 'https://via.placeholder.com/200x200',
        specs: [
          { name: '辣度', options: ['不辣', '微辣', '中辣', '爆辣'], default: '微辣' }
        ]
      },
      {
        id: 7,
        name: '鸡肉串',
        desc: '低脂健康',
        price: 10,
        sales: 654,
        image: 'https://via.placeholder.com/200x200',
        specs: [] // 无规格商品，直接加购
      },
      {
        id: 8,
        name: '炸香肠',
        desc: '台式风味',
        price: 8,
        sales: 789,
        image: 'https://via.placeholder.com/200x200',
        specs: []
      },
    ]
  },
  {
    name: '特价专区',
    tag: ' 特价 ',
    items: [
      // 新增：特价商品
      {
        id: 9,
        name: '炸茄子',
        desc: '软嫩入味',
        price: 8,
        specialPrice: 4.9, // 新增：特价字段
        sales: 234,
        image: 'https://via.placeholder.com/200x200',
        specs: []
      },
      {
        id: 10,
        name: '炸金针菇',
        desc: '酥脆可口',
        price: 10,
        specialPrice: 6.6,
        sales: 567,
        image: 'https://via.placeholder.com/200x200',
        specs: []
      },
    ]
  },
  {
    name: '组合套餐',
    tag: ' 套餐 ',
    items: [
      // 新增：组合商品
      {
        id: 11,
        name: '单人豪华套餐',
        desc: '五花肉+年糕+淀粉肠+可乐',
        price: 25,
        comboPrice: 19.9, // 新增：组合价字段
        isCombo: true, // 新增：组合标识
        comboItemIds: [1, 3, 4], // 新增：组合包含的商品ID
        sales: 1500,
        hot: true,
        image: 'https://via.placeholder.com/200x200/ffccff/333333?text=Combo',
        specs: [
          { name: '五花肉辣度', options: ['不辣', '微辣', '中辣'], default: '微辣' },
          { name: '年糕口味', options: ['甜辣酱', '番茄酱'], default: '甜辣酱' },
          { name: '淀粉肠辣度', options: ['不辣', '微辣'], default: '微辣' }
        ]
      },
    ]
  }
]);

// 优惠券数据（新增4种类型：满减、满折、特价、组合商品券）
const couponList = ref([
  {
    id: 1,
    name: '新人无门槛券',
    type: 'normal', // 无门槛（保留原有）
    amount: 5,
    threshold: 0,
    limit: '全场通用，无门槛',
    status: 1
  },
  {
    id: 2,
    name: '满30减10券',
    type: 'full', // 满减（保留原有）
    amount: 10,
    threshold: 30,
    limit: '全场通用，满30可用',
    status: 1
  },
  {
    id: 3,
    name: '全场满50打8折券',
    type: 'full_discount', // 新增：满折
    discount: 8,
    maxDiscount: 15,
    threshold: 50,
    limit: '全场通用，满50打8折，最高减15元',
    status: 1
  },
  {
    id: 4,
    name: '淀粉肠+年糕特价券',
    type: 'special', // 新增：指定商品特价券
    specialItemIds: [3, 4], // 指定商品ID
    specialPrice: 5, // 组合特价
    threshold: 0,
    limit: '指定淀粉肠+年糕，组合价5元',
    status: 1
  },
  {
    id: 5,
    name: '单人豪华套餐立减5元券',
    type: 'combo', // 新增：组合商品券
    comboItemIds: [11], // 指定组合商品ID
    amount: 5,
    threshold: 0,
    limit: '指定单人豪华套餐，立减5元',
    status: 1
  },
  {
    id: 6,
    name: '满100减50券',
    type: 'full',
    amount: 50,
    threshold: 100,
    limit: '全场通用，满100可用',
    status: 0
  }
]);

// 会员权益数据（新增2种复杂权益）
const memberRights = ref([
  {
    id: 1,
    name: '每月4次8折券',
    desc: '全场商品享8折优惠，每次最高减10元，与优惠券互斥',
    discount: 0.8,
    maxDiscount: 10,
    type: 'monthly_discount',
    monthlyLimit: 4 // 新增：每月使用次数限制
  },
  {
    id: 2,
    name: '每周四免费吃淀粉肠',
    desc: '每周四可免费领取1份经典淀粉肠，与优惠券互斥',
    freeItemId: 4, // 新增：指定免费商品ID
    type: 'weekly_free',
    weeklyDay: 4 // 新增：每周几可用（0=周日，1=周一...4=周四）
  },
  {
    id: 3,
    name: '免配送费',
    desc: '订单免2元配送费',
    type: 'freight_free'
  }
]);

// --- 2. 模拟用户数据（用于复杂权益） ---
const monthlyDiscountCount = ref(2); // 本月已用8折券次数
const isThursday = computed(() => {
  // 模拟今天是周四（方便测试）
  return true;
  // 真实代码：
  // const today = new Date();
  // return today.getDay() === 4;
});

// --- 3. 基础状态定义 ---
const currentIndex = ref(0);
const leftScrollId = ref('');
const goodsScrollId = ref('');
const groupTops = ref([]);
const cartList = ref([]); // 购物车结构：{ cartKey, id, name, price, count, image, specDesc, specs, isCombo, comboItemIds }
const showCart = ref(false);
const freightFee = ref(2); // 基础配送费

// --- 4. 规格选择弹窗状态 ---
const specPopupVisible = ref(false);
const currentSpecGoods = ref({});
const selectedSpecs = ref({});
const specBuyNum = ref(1);

// --- 5. 优惠券&权益弹窗状态 ---
const couponPopupVisible = ref(false);
const currentTab = ref('coupon');
const selectedCoupon = ref(null);
const selectedRights = ref([]);

// --- 6. 核心计算属性
// 购物车总数量
const totalCount = computed(() => {
  return cartList.value.reduce((sum, item) => sum + item.count, 0);
});

// 商品原价总和（未优惠，不含特价/组合价）
const originalTotalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => {
    // 组合商品用原价，特价商品用原价
    const basePrice = item.isCombo ? menuData.value.flatMap(c => c.items).find(i => i.id === item.id)?.price || item.price :
        item.specialPrice ? menuData.value.flatMap(c => c.items).find(i => i.id === item.id)?.price || item.price :
            item.price;
    return sum + basePrice * item.count;
  }, 0);
});

// 商品最终单价（含特价/组合价，不含优惠券/权益）
const getFinalGoodsPrice = (item) => {
  if (item.isCombo) return item.comboPrice || item.price;
  if (item.specialPrice) return item.specialPrice;
  return item.price;
};

// 获取商品特价（用于标签显示）
const getSpecialPrice = (item) => {
  return item.specialPrice || null;
};

// 商品最终总价（含特价/组合价，不含优惠券/权益）
const finalGoodsTotalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => sum + getFinalGoodsPrice(item) * item.count, 0);
});

// 会员权益优惠金额（新增复杂逻辑）
const rightDiscountAmount = computed(() => {
  let discount = 0;
  // 每月4次8折券
  if (selectedRights.value.includes(1)) {
    if (monthlyDiscountCount.value < 4) {
      const baseDiscount = finalGoodsTotalPrice.value * (1 - memberRights.value[0].discount);
      discount += Math.min(baseDiscount, memberRights.value[0].maxDiscount);
    }
  }
  // 每周四免费吃淀粉肠
  if (selectedRights.value.includes(2)) {
    if (isThursday.value) {
      // 查找购物车中是否有淀粉肠
      const starchSausage = cartList.value.find(item => item.id === 4);
      if (starchSausage) {
        // 免费1份
        discount += getFinalGoodsPrice(starchSausage);
      }
    }
  }
  // 免配送费
  if (selectedRights.value.includes(3)) {
    discount += freightFee.value;
  }
  return discount;
});

// 优惠券优惠金额（新增4种类型硬编码）
const couponDiscountAmount = computed(() => {
  if (!selectedCoupon.value) return 0;
  const coupon = selectedCoupon.value;
  const basePrice = finalGoodsTotalPrice.value;
  const cartItemIds = cartList.value.map(item => item.id);

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
  // 满折券
  if (coupon.type === 'full_discount') {
    if (basePrice >= coupon.threshold) {
      const discount = basePrice * (1 - coupon.discount / 10);
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    }
  }
  // 指定商品特价券
  if (coupon.type === 'special') {
    // 检查购物车是否包含所有指定商品
    const hasAllSpecialItems = coupon.specialItemIds.every(id => cartItemIds.includes(id));
    if (hasAllSpecialItems) {
      // 计算指定商品的原价总和
      const specialItemsOriginalTotal = coupon.specialItemIds.reduce((sum, id) => {
        const item = cartList.value.find(i => i.id === id);
        const originalItem = menuData.value.flatMap(c => c.items).find(i => i.id === id);
        return sum + (originalItem?.price || item?.price || 0) * (item?.count || 1);
      }, 0);
      // 优惠金额 = 指定商品原价总和 - 组合特价
      return Math.max(0, specialItemsOriginalTotal - coupon.specialPrice);
    }
  }
  // 组合商品券
  if (coupon.type === 'combo') {
    // 检查购物车是否包含指定组合商品
    const hasComboItem = coupon.comboItemIds.some(id => cartItemIds.includes(id));
    if (hasComboItem) {
      // 优惠金额 = 立减金额 * 组合商品数量
      const comboItemCount = cartList.value.filter(item => coupon.comboItemIds.includes(item.id)).reduce((sum, item) => sum + item.count, 0);
      return Math.min(coupon.amount * comboItemCount, basePrice);
    }
  }
  return 0;
});

// 总优惠金额（互斥规则：取最大的）
const discountAmount = computed(() => {
  return Math.max(rightDiscountAmount.value, couponDiscountAmount.value);
});

// 最终实付金额
const payPrice = computed(() => {
  let pay = finalGoodsTotalPrice.value + freightFee.value - discountAmount.value;
  // 最低实付0元
  return pay < 0 ? 0 : pay;
});

// 可用优惠券列表（新增4种类型判断）
const availableCoupon = computed(() => {
  return couponList.value.filter(coupon => {
    if (coupon.status !== 1) return false;
    const basePrice = finalGoodsTotalPrice.value;
    const cartItemIds = cartList.value.map(item => item.id);

    // 无门槛/满减/满折：判断门槛
    if (['normal', 'full', 'full_discount'].includes(coupon.type)) {
      return basePrice >= coupon.threshold;
    }
    // 指定商品特价券：判断是否包含所有指定商品
    if (coupon.type === 'special') {
      return coupon.specialItemIds.every(id => cartItemIds.includes(id));
    }
    // 组合商品券：判断是否包含指定组合商品
    if (coupon.type === 'combo') {
      return coupon.comboItemIds.some(id => cartItemIds.includes(id));
    }
    return false;
  });
});

// 不可用优惠券列表
const unavailableCoupon = computed(() => {
  return couponList.value.filter(coupon => {
    if (coupon.status !== 1) return true;
    const basePrice = finalGoodsTotalPrice.value;
    const cartItemIds = cartList.value.map(item => item.id);

    if (['normal', 'full', 'full_discount'].includes(coupon.type)) {
      return basePrice < coupon.threshold;
    }
    if (coupon.type === 'special') {
      return !coupon.specialItemIds.every(id => cartItemIds.includes(id));
    }
    if (coupon.type === 'combo') {
      return !coupon.comboItemIds.some(id => cartItemIds.includes(id));
    }
    return true;
  });
});

// 规格是否全部选中
const isSpecSelected = computed(() => {
  if (!currentSpecGoods.value.specs || currentSpecGoods.value.specs.length === 0) return true;
  for (let spec of currentSpecGoods.value.specs) {
    if (!selectedSpecs.value[spec.name]) return false;
  }
  return true;
});

// 权益是否可用
const isRightAvailable = (rightId) => {
  if (rightId === 1) {
    return monthlyDiscountCount.value < 4;
  }
  if (rightId === 2) {
    return isThursday.value;
  }
  return true;
};

// 获取优惠券金额文本
const getCouponAmountText = (coupon) => {
  if (coupon.type === 'normal' || coupon.type === 'full' || coupon.type === 'combo') {
    return `¥${coupon.amount}`;
  }
  if (coupon.type === 'full_discount') {
    return `${coupon.discount}折`;
  }
  if (coupon.type === 'special') {
    return `¥${coupon.specialPrice}`;
  }
  return '';
};

// --- 7. 基础联动逻辑 ---
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

// --- 8. 商品规格选择核心逻辑 ---
// 打开规格弹窗
const openSpecPopup = (goods) => {
  if (!goods.specs || goods.specs.length === 0) {
    updateCart(goods, 1);
    return;
  }

  currentSpecGoods.value = goods;
  specBuyNum.value = 1;
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
  const specDesc = Object.values(selectedSpecs.value).join(' · ');
  const cartKey = `${goods.id}-${JSON.stringify(selectedSpecs.value)}`;

  const existedItem = cartList.value.find(item => item.cartKey === cartKey);
  if (existedItem) {
    existedItem.count += specBuyNum.value;
  } else {
    cartList.value.push({
      cartKey,
      id: goods.id,
      name: goods.name,
      price: getFinalGoodsPrice(goods),
      count: specBuyNum.value,
      image: goods.image,
      specDesc,
      specs: { ...selectedSpecs.value },
      isCombo: goods.isCombo,
      comboItemIds: goods.comboItemIds,
      specialPrice: goods.specialPrice
    });
  }

  goods.isAdding = true;
  setTimeout(() => goods.isAdding = false, 300);
  closeSpecPopup();
};

// --- 9. 购物车核心逻辑 ---
// 获取商品在购物车中的总数量（忽略规格）
const getCartCount = (id) => {
  return cartList.value.filter(item => item.id === id).reduce((sum, item) => sum + item.count, 0);
};

// 更新购物车数量（加减操作）
const updateCart = (item, num) => {
  if (item.cartKey) {
    const target = cartList.value.find(i => i.cartKey === item.cartKey);
    if (target) {
      target.count += num;
      if (target.count <= 0) {
        cartList.value = cartList.value.filter(i => i.cartKey !== item.cartKey);
        // 新增：删除商品后，检查优惠券/权益是否还满足条件
        checkAndClearInvalidDiscount();
      }
    }
    return;
  }

  const cartKey = `${item.id}-${JSON.stringify({})}`;
  const target = cartList.value.find(i => i.cartKey === cartKey);
  if (target) {
    target.count += num;
    if (target.count <= 0) {
      cartList.value = cartList.value.filter(i => i.cartKey !== cartKey);
      checkAndClearInvalidDiscount();
    }
  } else {
    if (num > 0) {
      cartList.value.push({
        cartKey,
        id: item.id,
        name: item.name,
        price: getFinalGoodsPrice(item),
        count: 1,
        image: item.image,
        specDesc: '',
        specs: {},
        isCombo: item.isCombo,
        comboItemIds: item.comboItemIds,
        specialPrice: item.specialPrice
      });
    }
  }

  if (num > 0) {
    item.isAdding = true;
    setTimeout(() => item.isAdding = false, 300);
  }
};

// 新增：检查并清除无效的优惠券/权益（又一堆硬编码）
const checkAndClearInvalidDiscount = () => {
  // 检查优惠券
  if (selectedCoupon.value) {
    const isAvailable = availableCoupon.value.some(c => c.id === selectedCoupon.value.id);
    if (!isAvailable) {
      selectedCoupon.value = null;
    }
  }
  // 检查每周四免费淀粉肠
  if (selectedRights.value.includes(2)) {
    const hasStarchSausage = cartList.value.some(item => item.id === 4);
    if (!hasStarchSausage) {
      selectedRights.value = selectedRights.value.filter(id => id !== 2);
    }
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
        selectedCoupon.value = null;
        selectedRights.value = [];
      }
    }
  });
};

// --- 10. 优惠券&权益核心逻辑 ---
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
  if (selectedCoupon.value?.id === coupon.id) {
    selectedCoupon.value = null;
  } else {
    selectedCoupon.value = coupon;
    selectedRights.value = [];
  }
};

// 切换会员权益
const toggleRight = (rightId, e) => {
  const isChecked = e.detail.value;
  if (isChecked) {
    selectedRights.value.push(rightId);
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

// --- 11. 生命周期 ---
onMounted(() => {
  setTimeout(() => {
    initHeights();
  }, 300);
});
</script>

<style lang="scss" scoped>
/* 全局变量：喜姐炸串品牌色 */
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
}

/* --- 顶部店招样式（原有兼容） --- */
.top-header {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid $border-color;
  z-index: 10;

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
}

/* --- 主体左右联动样式（新增特价标签、原价划线） --- */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;

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
        display: flex;
        margin-bottom: 30rpx;
        position: relative;

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
    }
  }
}

/* --- 底部结算栏（新增权益使用提示） --- */
.bottom-bar {
  height: 140rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  position: relative;
  z-index: 20;

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

/* --- 购物车弹窗（新增组合商品标识） --- */
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

/* --- 规格选择弹窗样式（原有兼容） --- */
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

/* --- 优惠券&权益弹窗样式（新增组合券样式、权益状态提示） --- */
.coupon-popup-mask {
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

  .coupon-popup {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    animation: slideUp 0.3s ease;
    max-height: 80vh;
    display: flex;
    flex-direction: column;

    .coupon-tab {
      display: flex;
      border-bottom: 1px solid $border-color;
      .tab-item {
        flex: 1;
        text-align: center;
        padding: 20rpx 0;
        font-size: 28rpx;
        color: $text-main;
        position: relative;
        &.active {
          color: $primary-red;
          font-weight: 500;
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60rpx;
            height: 4rpx;
            background-color: $primary-red;
            border-radius: 2rpx;
          }
        }
      }
    }

    .coupon-content {
      flex: 1;
      padding: 0 30rpx;
      overflow-y: auto;
      box-sizing: border-box;
      .coupon-title {
        font-size: 26rpx;
        color: $text-sub;
        padding: 20rpx 0 10rpx;
      }

      .coupon-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        margin-bottom: 20rpx;
        background: linear-gradient(90deg, #fff5f5 0%, #fff 100%);
        border: 1px solid #ffe0e0;
        border-radius: 12rpx;
        position: relative;
        overflow: hidden;

        &::before, &::after {
          content: '';
          position: absolute;
          left: -10rpx;
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
          background-color: #fff;
        }
        &::before {
          top: -10rpx;
        }
        &::after {
          bottom: -10rpx;
        }

        &.selected {
          border-color: $primary-red;
          background: linear-gradient(90deg, #ffe0e0 0%, #fff 100%);
        }
        &.disabled {
          opacity: 0.5;
          background: #f9f9f9;
          border-color: #eee;
        }
        &.combo {
          background: linear-gradient(90deg, #f5f0ff 0%, #fff 100%);
          border-color: #e0d0ff;
          &.selected {
            border-color: $combo-purple;
            background: linear-gradient(90deg, #e0d0ff 0%, #fff 100%);
          }
        }

        .coupon-left {
          flex: 1;
          .coupon-amount {
            font-size: 40rpx;
            font-weight: bold;
            color: $primary-red;
            .combo & {
              color: $combo-purple;
            }
          }
          .coupon-name {
            display: block;
            font-size: 28rpx;
            color: $text-main;
            margin: 5rpx 0;
          }
          .coupon-limit {
            font-size: 22rpx;
            color: $text-sub;
          }
        }
        .coupon-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          .select-btn {
            width: 120rpx;
            height: 50rpx;
            line-height: 50rpx;
            text-align: center;
            background-color: $primary-red;
            color: #fff;
            border-radius: 25rpx;
            font-size: 24rpx;
            .combo & {
              background-color: $combo-purple;
            }
          }
          .selected-tag {
            font-size: 24rpx;
            color: $primary-red;
            font-weight: 500;
            .combo & {
              color: $combo-purple;
            }
          }
          .disabled-btn {
            width: 120rpx;
            height: 50rpx;
            line-height: 50rpx;
            text-align: center;
            background-color: $disabled-color;
            color: #fff;
            border-radius: 25rpx;
            font-size: 24rpx;
          }
        }
      }

      .right-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 1px solid $border-color;
        .right-info {
          flex: 1;
          .right-name {
            font-size: 28rpx;
            color: $text-main;
            font-weight: 500;
          }
          .right-desc {
            display: block;
            font-size: 24rpx;
            color: $text-sub;
            margin-top: 5rpx;
          }
          .right-status {
            display: block;
            font-size: 22rpx;
            color: $text-sub;
            margin-top: 5rpx;
            .right-status-red {
              color: $primary-red;
            }
          }
        }
      }
    }

    .coupon-footer {
      padding: 30rpx;
      border-top: 1px solid $border-color;
      .confirm-coupon-btn {
        width: 100%;
        height: 80rpx;
        background-color: $primary-red;
        color: #fff;
        border: none;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        line-height: 80rpx;
        padding: 0;
        margin: 0;
      }
    }
  }
}

/* --- 动画定义 --- */
@keyframes bounceIn {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>