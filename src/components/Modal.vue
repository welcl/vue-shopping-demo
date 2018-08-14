<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition " :class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">Login in</div>
            <button class="md-close" @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
    </div>
</template>
<script type="text/ecmascript-6">
 export default{
    props:["mdShow"],
     data(){
        return{

        }
     },
   methods:{
     closeModal(){
       this.$emit('close');
     }
   },
 }
</script>
<style rel="stylesheet/less" lang="less" scoped>

</style>
