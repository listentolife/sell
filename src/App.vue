<template>
  <div>
    <!-- 从后端获得的seller对象的数据，通过v-bind传入到子组件v-header -->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- <router-link> 对应的标签是 <a> ,所以样式是写 <a> 标签的样式 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- keep-alive组件用来缓存组件，避免多次加载相应的组件，减少性能消耗 -->
    <keep-alive>
      <!-- 路由出口，路由匹配到的组件将渲染在这里 -->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from './common/js/util.js';
  import header from './components/header/header.vue';

  const ERR_OK = 0;

  /*
   *export, export default跟import
   *1.export, export default均可用于到处常量、函数、文件、模块等。通过import (常量|函数|文件|模块)名 的方式将其导入；
   *2.export,import可以有多个，export default仅有一个；
   *3.export default可以为模块指定默认输出；
   *http://es6.ruanyifeng.com/#docs/module#export-命令
   */

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let querParam = urlParse();
            return querParam.id;
          })()
        }
      };
    },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data);
      }
    });
  },
    components: {
      // 这里注册了header组件(上面已经引入了组件文件)
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align:center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
