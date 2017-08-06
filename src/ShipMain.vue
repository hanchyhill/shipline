<template>
  <div>
    <main-header></main-header>
    <!--<main-fc></main-fc>-->
    <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import MainHeader from './components/header.vue';
import MainFc from './components/fcMain.vue';

export default {
  name: 'app',
  components:{MainHeader,MainFc,},
  data:function(){
    return {
    }
  },
  created(){
    // 
  },// created结束
  methods:{
  },// method结束
  watch: {
  },// watch 结束
  computed:{

  },//计算属性结束
}
</script>
<style >
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
.fc-table .mu-tr,.fc-table .mu-td{
  height:42px !important;
}
</style>