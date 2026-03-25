

<template>

</template>
<script setup lang="ts">
import {onMounted,onUnmounted} from "vue";

const props=defineProps<{cart:mall.Cart}>();
const visible=defineModel<boolean>('visible',{required:true});
const skuGoodsItemPrepare=(_goodsItem:any, _num:number, _options?:any)=>{
  if(_goodsItem.specs&&_goodsItem.specs.length>0){
    if(!_options){
      // 弹出购物车列表
      visible.value=true;
      return false;
    }
  }
  return true
}
onMounted(()=>{
  if(props.cart.addGoodsItemRemovePreparer){
    props.cart.addGoodsItemRemovePreparer(skuGoodsItemPrepare);
  }
})
onUnmounted(()=>{
  if(props.cart.removeGoodsItemRemovePreparer){
    props.cart.removeGoodsItemRemovePreparer(skuGoodsItemPrepare);
  }
})
</script>
<style scoped lang="scss">

</style>