<template>
  <div>
    <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
      	<div class="logo-wrapper">
      	  <div class="logo" :class="{'highlight':totalCount>0}">
      	  	<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
      	  </div>
      	  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
      	</div>
      	<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
      	<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
      	<div class="pay" :class="payClass">
      	  {{payDesc}}
      	</div>
      </div>
    </div>
    <!-- 点击按钮后飞入购物车的动画需求：
         1.点击购买按钮后，在购买按钮的位置出现小球飞入购物车；
         2.小球飞入购物车的弧线是先向上后向下的；
         3.在连续点击购买的情况下，小球会不断飞入；
         4.小球在完成飞入购物车前后是隐藏的 -->
    <div class="ball-container">
      <!-- 这里用v-for实现小球连续飞入的动画效果 -->
      <div v-for="ball in balls">
        <!-- 这里使用了transition的JavaScript钩子函数。当ball.show边为true时，就自动按顺序触发transition属性中声明的JavaScript钩子。beforeDrop()是实现小球下落动画，dropping()是实现小球下落后复位，afterDrop()是实现复位后重置 -->
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <!-- transition组件中的元素或组件可以给有下列情形（v-if，v-show，动态组件，组件根节点）的任何元素和组件添加进入/离开过渡下效果 -->
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol';

  export default {
    props: {
      // 这里的selectFood是需要从good组件把客户选择的菜单传进来，所以这里需要在props中声明一个数组
      // 注册已选择的商品数组
      selectFoods: {
        type: Array,
        // vue中如果type是array或object，则default需要是一个函数
        default () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      // 通过selectFood计算总价
      totalPrice () {
        let total = 0;
        // 遍历
        this.selectFoods.forEach((food) => {
          // 计算每种商品的单价乘以数量，累加到total上
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          // 计算数量的总和
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送 `;
        } else if (this.totalPrice < this.minPrice) {
         let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送 `;
        } else {
          return `去结算`;
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            // 这里对this.scroll的判断是为了在每次展开时不需要重复声明this.scroll，直接刷新即可
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop (el) {
        // 这里，每次点击添加购物车都会触发drop(),然后就会重新遍历balls数组
        for (let i = 0; i < this.balls.length; i++) {
          // 遍历每一个ball，如果ball.show为true，则ball在展示中，遍历下一个ball；如果为false，则把ball.show置为true，然后用ball.el记录对应的el节点，并用dropBalls来存放这个ball，然后return结束函数
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop (el) {
        let count = this.balls.length;
        // 这里用while遍历所有的ball，如果ball.show为true，则进行过渡动画前的设置
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // 获得ball对应事件节点在视口的位置(getBoundingClientRect()返回的是这个元素与页面四边的距离，用left,top,right,bottom来表示)
            let rect = ball.el.getBoundingClientRect();
            // x,y分别计算小球起始位置到购物车的高度跟宽度距离
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            // 先让元素对象显示出来
            el.style.display = '';
            // 这里设置ball外层元素的纵向移动
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `(0,${y}px,0)`;
            // 这里设置ball内层元素的横向移动
            let inner = el.getElementByClassName('innerhook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping (el, done) {
        // 这里是手动触发浏览器重绘，但rf变量后续不使用，所以需要添加一下注释避免eslint报错
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; 
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.diaplay = 'none';
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList () {
        this.fold = true;
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display:flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background:rgba(255, 255, 255, 0.2)
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 10px
          font-weight: 400
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            color: #fff
            background: #00b43c
    .ball-container
      .ball
        // 这里把球的position设置为fixed，可以相对于浏览器窗口进行定位
        position: flex
        left: 32px
        bottom: 22px
        z-index: 200
        // 这里使用了贝塞尔曲线 http://cubic-bezier.com/#.17,.67,.83,.67
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
      // &.drop
      // &.move-enter-active, .move-leave-active
      //   transition: all 0.4s linear
      // &.move-enter, .move-leave-active
      //   opacity: 0
      //   transform: translate3D(24x, 0, 0)
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        background: #fff
        // 这里控制了购物车清单这块的高度，超出部分也被隐藏
        max-height: 217px
        overflow: hidden
        .food
          position:relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
