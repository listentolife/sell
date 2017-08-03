// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// import router from './router';
import VueRouter from 'vue-router';
import VueResouce from 'vue-resource';
import goods from '@/components/goods/goods.vue';
import ratings from '@/components/ratings/ratings.vue';
import seller from '@/components/seller/seller.vue';

import '@/common/stylus/index.styl';

// 以下这句没有，暂保留
// Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResouce);

// Vue.config.debug = true;

// 定义路由（属于第二步，第一步为创建路由组件）

const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

// 创建router实例，然后传‘router’配置（属于第三部）

const router = new VueRouter({
  // 这里linkActiveClass指定为active
  linkActiveClass: 'active',
  routes
});

// 创建和挂载根实例（属于第四步）

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
