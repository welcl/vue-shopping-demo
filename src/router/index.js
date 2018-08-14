import Vue from 'vue'
import Router from 'vue-router'
// import GoodsTest from 'views/GoodsTest'
// import Title from 'views/title'
// import Img from 'views/img'
// import Cart from 'views/Cart'
import GoodsList  from 'views/GoodsList.vue';
import Cart  from 'views/Cart.vue';
import Address  from 'views/Address.vue';
import OrderConfirm from 'views/OrderConfirm';
import OrderSuccess from 'views/OrderSuccess';
//引入图片懒加载插件
import VueLazyload from 'vue-lazyload';
//引入滚动刷新加载内容插件
import infiniteScroll from 'vue-infinite-scroll';
//全局注册过滤器
// import {currency} from '@/util/currency.js';
// Vue.filter('currency',currency);
Vue.use(infiniteScroll);
Vue.use(VueLazyload,{
  loading:'static/loading-svg/loading-bars.svg',
});
Vue.use(Router);
export default new Router({
  mode:'history',
  routes: [
    // {
    //   path: '/goods/:id/user/:username',
    //   name: 'GoodsList',
    //   component: GoodsList
    // },
    // {
    //   path: '/goodsTest',
    //   name: 'GoodsTest',
    //   components:{
    //       default:GoodsTest,
    //       title:Title,
    //       img:Img
    //   },
    //   children:[
    //     {
    //       path:'title',
    //       name:'title',
    //       component:Title
    //     },
    //     {
    //       path:'img',
    //       name:'img',
    //       component:Img
    //     },
    //   ]
    // },
    // {
    //   path:'/cart',
    //   name:'cart',
    //   component:Cart
    // },
    {
      path:'/',
      name:'goods',
      component:GoodsList
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    },
    {
      path:'/address',
      name:'address',
      component:Address
    },
    {
      path:'/orderconfirm',
      name:'orderconfirm',
      component:OrderConfirm,
    },
    {
      path:'/ordersuccess',
      name:'ordersuccess',
      component:OrderSuccess,
    }
  ]
})
