<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
      <ul>
      	<li v-for="(item, index) in goods" key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
      	  <span class="text border-1px">
      	    <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
      	  </span>
      	</li>
      </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
      	<li v-for="(item, index) in goods" key="index" class="food-list" ref="foodList">
      	  <h1 class="title">{{item.name}}</h1>
      	  <ul>
      	  	<li @click="selectFood(food,$event)" v-for="(food, index) in item.foods" key="index" class="food-item border-1px">
      	  	  <div class="icon">
      	  	  	<img width="57px" height="57px" :src="food.icon">
      	  	  </div>
      	  	  <div class="content">
      	  	  	<h2 class="name">{{food.name}}</h2>
      	  	  	<p class="desc">{{food.description}}</p>
      	  	  	<div class="extra">
      	  	  	  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
      	  	  	</div>
      	  	  	<div class="price">
      	  	  	  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
      	  	  	</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
      	  	  </div>
      	  	</li>
      	  </ul>
      	</li>
      </ul>
      </div>
      <shopcart :selectFoods="selectFoods" ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
// better-scroll的github地址：https://github.com/ustbhuangyi/better-scroll
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0;

export default {
  props: {
   seller: {
     type: Object
   }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  computed: {
    // 确定左侧的菜单栏的位置
    currentIndex () {
      // 遍历listHeight
      for (let i = 0; i < this.listHeight.length; i++) {
        // 取商品栏list前后两个高度
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 判断产品栏y轴在某个商品栏列表的范围，及在超出最后一个列表，则返回i值（当前可见的产品栏列表的数组下标）
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods () {
      let foods = [];
      // 遍历所有good
      this.goods.forEach((good) => {
        // 遍历所有good里的food
        good.foods.forEach((food) => {
          // 如果food.count大于0，则
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        // 这里的good需要现在data中声明
        this.goods = response.data;

        // $nextTick()的官方文档：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        // 在Vue生命周期的creat()钩子函数中进行DOM操作，需要用到$nextTick()，否则在creat()执行时，DOM其实并未进行任何渲染，所以对DOM的操作没有意义
        // 还有一种使用$nextTick()的情况：当数据变化后要执行某个操作，这个操作需要使用岁数据改变而改变的DOM结构的时候，这个操作也应该放在$nextTick()的回调函数中
        this.$nextTick(() => {
          // 重新初始化DOM结构，并初始化Better-Scroll，获取当前商品列表的高度数组
          this._initScroll();
          this._calculatHeight();
        });
      }
    });
  },
  methods: {
    selectFood (food, event) {
      if (!event._constructed) {
       return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    addFood (target) {
      this._drop(target);
    },
    selectMenu (index, event) {
      if (!event._constructed) {
       return;
      }
      let foodlist = this.$refs.foodList;
      let el = foodlist[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    _drop (target) {
      // 体验优化，又不执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    // BS插件_initScroll的函数，Better-Scroll实例化需要接受左右两侧DOM结构，所以放在method中进行初始化
    _initScroll () {
      // Better-Scroll的构造函数接受两个参数：DOM对象，Option参数[JSON对象]
      // 这里使用的ref是用来绑定一个DOM元素或某个组件，然后在$ref中调用
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        // 后面的添加购物车的组件需要产品栏的点击反馈，所以需要设置click为true
        click: true,
        probeType: 3
      });

      // 在滚动商品栏的时候，实时获得商品栏的y轴坐标
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },

    // 获得商品列表节点的高度数组
    _calculatHeight () {
      // foodList获得列表的节点数组
      let foodList = this.$refs.foodList;
      let height = 0;
      this.listHeight.push(height);
      // 遍历数组，获得每个节点的clientHeight内容可见部分的高度，然后累加入listHeight的数组中
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  events: {
    'add' (target) {
      this._drop(target);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  /* icon class可以整理放到mixin.styl中 */
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/icon.styl"

  .goods
    display: flex
    position: absolute
    top:174px
    bottom:46px
    width:100%
    overflow:hidden
    .menu-wrapper
      //flex三个属性：等分，空间不足的缩放，占位空间
      flex: 0 0 80px
      width:80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width:56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align:middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc
            margin-bottom: 8px
          .desc, .extra
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
