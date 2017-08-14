<template>
  <div class="cartcontrol">
    <transition class="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
      	<span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    // 在PC端点击时会触发两次，因为BScroll有自己默认派发事件，所以在函数中传入event，判断如果不是event._constructed原生派发事件，则直接return
    addCart (event) {
      if (!event._constructed) {
        return;
      }
      // console.log('click');
      if (!this.food.count) {
        // 对于需要在函数中新增props属性对象的属性时，可以用Vue.set来添加
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      // vuejs2.0放弃使用$dispatch()方法
      this.$emit('add', event.target);
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return;
      }
      // console.log('click');
      if (this.food.count > 0) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
    &.move-enter-active, .move-leave-active
      transition: all 0.4s linear
    &.move-enter, .move-leave-active
      opacity: 0
      transform: translate3D(24x, 0, 0)
      .inner
        transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      font-size: 10px
      text-align: center
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

</style>
