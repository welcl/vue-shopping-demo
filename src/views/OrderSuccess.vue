<template>
  <div>
  <nav-header></nav-header>
  <nav-bread>
    <span>OrderSuccess</span>
  </nav-bread>
    <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderList.orderId}}</span>
          <span>Order total：{{orderList.orderTotal |currency('$')}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link class="btn btn--m"  to="/cart">Cart List</router-link>
            <!--<a href="javascript:;" class="btn btn&#45;&#45;m">Cart List</a>-->
          </div>
          <div class="btn-r-wrap">
            <!--<a href="javascript:;" class="btn btn&#45;&#45;m">Goods List</a>-->
            <router-link class="btn btn--m"  to="/">Goods List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import  axios from 'axios';
  import  NavHeader from 'components/NavHeader';
  import  NavFooter from 'components/NavFooter';
  import  NavBread from 'components/NavBread';
  import  Modal from 'components/Modal';
  import {currency} from '@/util/currency.js';
  import 'assets/css/checkout.css';
  export default {
    data(){
      return{
        orderList:{},
      }
    },
    mounted(){
      this.init();
    },
    filters:{
      currency:currency
    },
   methods:{
      init(){
        var orderId=this.$route.query.orderId;
        if(!orderId){
          return;
        }
        axios.get('/users/orderDetail',{
          params:{
            orderId:orderId
          }
        }).then((response)=>{
          let res=response.data;
          if(res.status=='0'){
            this.orderList=res.result;
          }
        })
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    }
  }
</script>
<style>

</style>
