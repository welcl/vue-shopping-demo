<template>
      <div  class="goodList">
        <nav-header></nav-header>
        <nav-bread>
          <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)" class="price" @click="priceSort()" v-show="!allowFlag">Price
                <span class="allow">↓</span>
              </a>
              <a href="javascript:void(0)" class="price" @click="priceSort()" v-show="allowFlag">Price
                <span class="allow">↑</span>
              </a>
              <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceAll()">All</a></dd>
                  <dd v-for="(price,index) in priceFilter">
                    <a href="javascript:void(0)" @click="setPriceFliter(index)" :class="{'cur':priceChecked==index}">{{price.startPrice}}--{{price.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="(item,index) in goodsList">
                      <div class="pic">
                        <!--v-lazy有一个重中之重的坑需要填。-->
                        <!--当图片的数据更新时，举个栗子，你设置了翻页功能，且每一页都是请求的数据进行渲染。-->
                        <!--你会发现一个神奇的事情，那就是其他的数据都变了，唯独图片还是原来的图片。需要加一个：key值才可以-->
                        <a href="#"><img v-lazy="'static/'+item.productImage" alt="" :key="item.productImage"></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                      <img src="./../assets/css/loading-spinning-bubbles.svg" v-show="loading">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
              <p slot="message">请先登录,否则无法加入到购物车</p>
              <div slot="btnGroup">
                  <a class="btn btn-m" @click="mdShow=false">关闭 </a>
              </div>
        </modal>
        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
          <p slot="message">
            <svg class="icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            <span>加入购物车成功!</span>
          </p>
          <div slot="btnGroup">
            <a class="btn btn-m" @click="mdShowCart=false" href="javascript:;">继续购物 </a>
            <router-link  to="/cart" class="btn btn-m" >查看购物车</router-link>
          </div>
        </modal>
      <nav-footer></nav-footer>
      </div>
</template>
<script  type="text/ecmascript-6">
      import  axios from 'axios';
      import  NavHeader from 'components/NavHeader';
      import  NavBread from 'components/NavBread';
      import  NavFooter from 'components/NavFooter';
      import  Modal from 'components/Modal';
      import 'assets/css/base.css';
      import 'assets/css/checkout.css';
      import 'assets/css/login.css';
      import 'assets/css/product.css';
      export  default {
        name:'goodList',
        data(){
          return{
            goodsList:[],
            allowFlag:false,
            //排序参数
            sortFlag:true,
            //分页
            page:1,
            //页面内容个数
            pageSize:8,
            //vue-infinite-scroll 插件中(infinite-scroll-disabled="busy")滚动是否开启,true不开启,false开启
            busy:true,
            //控制loading图显示
            loading:false,
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false,
            //控制模态框显示隐藏
            mdShow:false,
            mdShowCart:false,
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'100.00'
              },
              {
                startPrice:'101.00',
                endPrice:'500.00'
              },
              {
                startPrice:'501.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1001.00',
                endPrice:'5000.00'
              },
            ],

          }
        },
        mounted(){
            this.getGoodsList();
        },
        methods:{
          getGoodsList(flag){
            this.loading=true;
           let param={
             page:this.page,
             pageSize:this.pageSize,
             sortFlag:this.sortFlag?1:-1,
             //金额过滤
             priceLevel:this.priceChecked,
           };
            axios.get('/goods/list',{
              params:param
            }).then((result)=>{
              this.loading=false;
              let  res=result.data;
              if(res.status=="0"){
                if(flag){//falg为ture时,说明开始滚动加载了
                  //把刚开始页面加载的this.goodsList拼接上新的返回的数据
                  this.goodsList=this.goodsList.concat(res.result.list);
                  if(res.result.count<this.pageSize){
                    this.busy=true;
                  }else{
                    this.busy=false;
                  }
                }else{
                  this.goodsList=res.result.list;
                  //这个必须要设置this.busy=false,因为初始设置时this.busy=true是为了防止页面刚加载时滚动触发加载第二页,
                  // 所以在第一次调用getGoodsList()之后要设置为false开启滚动
                  this.busy=false;
                }
              }else{
                this.goodsList=[];
              }

            })
          },
          //滚动加载方法
          loadMore: function() {
            this.busy = true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
              //利用传值判断不同时期调用该函数
            }, 500);
          },
          //点击price排序
          priceSort(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.allowFlag=!this.allowFlag;
            this.getGoodsList();
          },
          showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
          },
          priceAll(){
            this.priceChecked='all';
            this.page=1;
            this.getGoodsList();
          },
          setPriceFliter(index){
            this.priceChecked=index;
            this.filterBy=false;
            this.overLayFlag=false;
            //点击价格区间调用接口查询数据
            this.page=1;
            this.getGoodsList();
          },
          //关闭浮层
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
          },
          //添加进购物车
          addCart(productId){
            axios.post('/goods/addCart',{
              productId:productId
            }).then((res)=>{
              console.log(res);
              if(res.data.status==0){
                this.mdShowCart=true;
                //点击加入购物车商品数量加1
                this.$store.commit('updateCartCount',1);
              }else{
                // alert(`msg:${res.data.msg}`);
                this.mdShow=true;
              }
            })
          },
          closeModal(){
            this.mdShow=false;
            this.mdShowCart=false;
          }
        },
        components:{
          NavHeader,
          NavBread,
          NavFooter,
          Modal
        }
      }
</script>
<style rel="stylesheet/less"  lang="less" scoped>
  .allow{
    display: inline-block;
    height:11px;
  }
</style>
