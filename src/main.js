// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
Vue.config.productionTip = false
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    //更新nickName
    updateNickName(state,nickName){
      state.nickName=nickName;
    },
    //更新cartCount
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount;
    },
    //页面刷新初始化cartCount
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
