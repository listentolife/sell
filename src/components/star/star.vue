<!-- star组件，外部会传入size跟score两个值。把score分数转换为对应的数值，数值取值为无星，半星跟全星的类名，然后用v-for传到span标签中；把size传入计算出starType，确定使用对应size的类 -->

<template>
  <div class="star" :class="starType">
    <!-- v-for的写法修改，track-by修改成key -->
  	<span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
  /* 传入两个参数：size传入star的尺寸，score传入星级评分 */
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      /* starType返回一个class的字符串，指向相应尺寸的class */
      starType () {
        return 'star-' + this.size;
      },
      itemClasses () {
        let result = [];
        /* 0-0.5以下取0,0.5-0.9取0.5的算法 */
        let score = Math.floor(this.score * 2) / 2;
        /* 判断score是否有小数点 */
        let hasDecimal = (score % 1) !== 0;
        /* 对score取整 */
        let integer = Math.floor(score);
        /* 循环添加全星class */
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        /* 判断是否有小数点，有则添加半星class */
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        /* 判断是否填满5个长度，否则添加无星class */
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 16px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
