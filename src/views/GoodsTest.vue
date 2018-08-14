<template>
        <div class="goodtest">
            <div>这是一个商品列表,用来实现动态路由</div>
            <span>{{$route.params.id}}</span><br>
            <span>{{$route.params.username}}</span><br>
            <router-link  to="/goods/title">go  title.vue</router-link><br>
            <router-link  to="/goods/img">go  img.vue</router-link><br>
            <router-link  :to="{name:'cart',params:{id:666}}">命名路由的跳转</router-link><br>

            <router-view></router-view>
          <router-link to="/cart">跳转到购物车页面</router-link><br>
          <button @click="jump">button带query跳转到购物车页面</button>
          <button @click="jump2">button带params跳转到购物车页面</button>
        </div>
</template>
<script type="text/ecmascript-6">
    export default {
          name:'goodtest',
          data(){
            return{

            }
          },
      methods:{
            jump(){
              this.$router.push({path:'/cart?goodsId=query'});
            },
            jump2(){
              this.$router.push({
                  name:'cart',
                  params:{
                    id : 123
                  }
          });
        }

      }

    }
</script>
<style rel="stylesheet/less" lang="less" scoped>

</style>
