import {ref} from "vue";

export const notices = ref([
    "新人专享：满30减5元！",
    "招牌炸年糕，外酥里嫩超好吃！",
    "满50送饮料一瓶，先到先得~"
]);
export const menuData = ref([
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
                image: 'https://picsum.photos/200/200/ffcccc/ffffff?text=Pork',
                // 规格配置：支持多组规格，每组有名称、选项、默认值
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
                image: 'https://picsum.photos/200/200/ccffcc/333333?text=Cartilage',
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
                image: 'https://picsum.photos/200/200/ccccff/333333?text=RiceCake',
                specs: [
                    { name: '口味', options: ['甜辣酱', '番茄酱', '原味'], default: '甜辣酱' }
                ]
            },
        ]
    },
    {
        name: '经典炸串',
        items: [
            {
                id: 4,
                name: '牛肉小串',
                desc: '鲜嫩多汁',
                price: 18,
                sales: 456,
                image: 'https://picsum.photos/200/200',
                specs: [
                    { name: '辣度', options: ['不辣', '微辣', '中辣', '特辣'], default: '微辣' }
                ]
            },
            {
                id: 5,
                name: '羊肉串',
                desc: '正宗羊肉',
                price: 20,
                sales: 321,
                image: 'https://picsum.photos/200/200',
                specs: [
                    { name: '辣度', options: ['不辣', '微辣', '中辣', '爆辣'], default: '微辣' }
                ]
            },
            {
                id: 6,
                name: '鸡肉串',
                desc: '低脂健康',
                price: 10,
                sales: 654,
                image: 'https://picsum.photos/200/200',
                specs: [] // 无规格商品，直接加购
            },
            {
                id: 7,
                name: '炸香肠',
                desc: '台式风味',
                price: 8,
                sales: 789,
                image: 'https://picsum.photos/200/200',
                specs: []
            },
        ]
    },
    {
        name: '素食主义',
        items: [
            { id: 8, name: '炸茄子', desc: '软嫩入味', price: 8, sales: 234, image: 'https://picsum.photos/200/200', specs: [] },
            { id: 9, name: '炸金针菇', desc: '酥脆可口', price: 10, sales: 567, image: 'https://picsum.photos/200/200', specs: [] },
            { id: 10, name: '炸土豆片', desc: '薄片更香', price: 6, sales: 890, image: 'https://picsum.photos/200/200', specs: [] },
        ]
    },
    {
        name: '主食小吃',
        items: [
            { id: 11, name: '臭豆腐', desc: '闻着臭吃着香', price: 12, sales: 432, image: 'https://picsum.photos/200/200', specs: [] },
            { id: 12, name: '手抓饼', desc: '千层百叠', price: 7, sales: 321, image: 'https://picsum.photos/200/200', specs: [] },
        ]
    }
]);

//
export const couponList = ref([
    {
        id: 1,
        name: '新人无门槛券',
        type: 'normal', // 无门槛
        amount: 5,
        threshold: 0, // 使用门槛
        limit: '全场通用，无门槛',
        status: 1 // 1可用 0不可用
    },
    {
        id: 2,
        name: '满30减10券',
        type: 'full', // 满减
        amount: 10,
        threshold: 30,
        limit: '全场通用，满30可用',
        status: 1
    },
    {
        id: 3,
        name: '全场8折券',
        type: 'discount', // 折扣
        discount: 8,
        maxDiscount: 20, // 最高优惠20元
        threshold: 0,
        limit: '全场通用，最高优惠20元',
        status: 1
    },
    {
        id: 4,
        name: '满50减20券',
        type: 'full',
        amount: 20,
        threshold: 50,
        limit: '全场通用，满50可用',
        status: 1
    },
    {
        id: 5,
        name: '满100减50券',
        type: 'full',
        amount: 50,
        threshold: 100,
        limit: '全场通用，满100可用',
        status: 0
    }
]);

export const memberRights = ref([
    {
        id: 1,
        name: '会员9折',
        desc: '全场商品享9折优惠，与优惠券互斥',
        discount: 0.9,
        type: 'discount'
    },
    {
        id: 2,
        name: '免配送费',
        desc: '订单免2元配送费',
        type: 'freight_free'
    },
    {
        id: 3,
        name: '下单赠饮料',
        desc: '下单即赠可乐一瓶',
        type: 'gift'
    }
]);

