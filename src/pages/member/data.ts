import {ref} from "vue";

export const  menuData = ref([
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
