<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!-- 这里的src引用seller对象中的属性，由于编译中seller是个空对象，所以会报错，也需要通过v-bind来引入 -->
      	<img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
      	<div class="title">
      	  <span class="brand"></span>
      	  <span class="name">{{seller.name}}</span>
      	</div>
      	<div class="description">
      		{{seller.description}}/{{seller.deliveryTime}}分钟到达
      	</div>
        <!-- 这里使用v-if跟上面用v-bind引入seller.avatar的原因是一样的，因为获取seller对象是个异步过程，在编译中直接使用seller.supports会报错未定义，所以需要做判断 -->
      	<div v-if="seller.supports" class="support">
          <!-- 这里的icon会根据seller.support[0].type的不同而变化。这里就需要在created中定义一个classMap的数组变量并一一对应type来引入到这里，再在样式中确定不同class下对应的背景图片 -->
      	  <span class="icon" :class="classMap[seller.supports[0].type]"></span>
      	  <span class="text">{{seller.supports[0].description}}</span>
      	</div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
      	<span class="count">{{seller.supports.length}}个</span>
      	<i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <!-- 这里两个<span>没换行是为了减少空字符的占位 -->
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- <transition>是动画标签，包住需要动画的块，然后设置fade样式即可 -->
    <transition name="fade">
     <!-- CSS Sticky footers布局：一般外部有两个层，一个包装内容，一个固定底部；前者设置最小高度等于视窗高度，其内部内容层设置padding-bottom为后者高度，后者设置margin为负高度使其保持能出现在视窗底部 -->
     <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
      	<div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item, index) in seller.supports" key="index">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
      	<i class="icon-close"></i>
      </div>
     </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
/* 引入star组件的路径修改 */
import star from '../star/star.vue';

export default {
  props: {
    // App.vue中传过来的seller对象通过props来接收
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail () {
      this.detailShow = true;
    },
    hideDetail () {
      this.detailShow = false;
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  components: {
    'star': star
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  /* @import "../../common/stylus/icon.styl" */
  
  .header
    position: relative
    overflow: hidden
    color: #fff
    background: rgba(7, 17, 27, 0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      // 这里设置font-size为0是为了子元素在显示上不会出现空字符占位而存在的缝隙，同时子元素的样式要单独设置font-size
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px;
          font-size: 12px
        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height: 12px
            font-size: 10px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 24px
          font-size: 10px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      // white-space设置为不折行，overflow设置为超出部分隐藏，text-overflow设置为用省略符号代表被修剪的文本
      white-space: nowrap  
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        font-size: 10px
        font-weight: 200
        margin: 0 4px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      // 这里将z-index设置-1，把这个块设置到最底层，然后将filter设置高斯模糊
      z-index: -1
      filter: blur(10px)
    // 进入跟退出详情弹层，都会有个从透明到不透明，或者不透明到透明的动画
    .fade-enter-active, .fade-leave-active
      transition: opacity 0.5s
    // 在点击跟详情弹层消失后，都设置opacity: 0透明
    .fade-enter, .fade-leave-active
      opacity: 0
    .detail
      position: fixed
      top: 0
      left: 0
      z-index: 100
      width: 100%
      height: 100%
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      .detail-wrapper
        width: 100%
        // 这里设置最小的高度跟视窗一样高
        min-height: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          // fixed布局，.title设置display: flex, .line是等分，所以设置flex: 1, .text则用内容撑开，不需要设置flex
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255,255,255,0.2)
            .text
              padding: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display:inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px;
              font-size: 12px
        .detail-close
          position:relative
          width: 32px
          height: 32px
          margin: -64px auto 0 auto
          clear: both
          font-size: 32px
    
</style>
