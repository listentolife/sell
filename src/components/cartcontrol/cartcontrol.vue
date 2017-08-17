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
      // 当触发addCart事件后，就通过$emit()派发一个事件，并且把当前的节点传到goods组件中，goods组件add事件又把这个节点传到shopcart组件的drop()中，实现动画
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
        // 这里设置display: inline-block是保证有宽高，这样动画才能显示效果
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        // transition：transition-property | transition-duration | transition-timing-function | tansition-delay
        // 过渡效果CSS属性名称|过渡效果时间|速度曲线|开始时间
        transition: all 0.4s linear
        transform: rotate(0)
    // 这里，减号按钮出现的动画只需要设置过渡效果，不需要设置位置，因为减号未出现时右边的并没有数字，导致位置靠右，当点击+1后，右边的.cart-count会有数字并被撑大，减号按钮会在展示的同时被推到左边，所以会有向左滚动的效果
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
