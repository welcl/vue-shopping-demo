<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view></router-view>-->
      <!--&lt;!&ndash;这是命名视图的演示,刚进入页面呈现三个路由,一个是默认的goodList.vue,一个是title.vue,一个是img.vue,路由设置在index.js中&ndash;&gt;-->
    <!--<router-view class="left" name="title"></router-view>-->
    <!--<router-view class="right" name="img"></router-view>-->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  .left,.right{
    float:left;
    width:49%;
    border:1px solid gray;
  }
</style>
