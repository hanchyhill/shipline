// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import Vuex from 'vuex';
import App from './ShipMain.vue';
import MuseUI from 'muse-ui';
import Vrouter from 'vue-router';
import 'muse-ui/dist/muse-ui.css';
import ShowFc from './components/showBhFc.vue';
import MainFc from './components/fcMain.vue';

//import 'es6-promise/auto';
//import 'muse-ui/dist/theme-carbon.css'; // 使用 carbon 主题

//import router from './router'
//console.log(Promise);
//alert(typeof Promise);
Vue.config.productionTip = false;
//Vue.use(Vuex);
Vue.use(MuseUI);
Vue.use(Vrouter);
/* eslint-disable no-new */
const router = new Vrouter({
  // mode:'history',
  routes:[
    {
      path:'/',
      redirect:'/createfc',
    },
    {
      path:'/showfc',
      component:ShowFc,
      name:'showfc',
    },
    {
      path:'/createfc',
      component:MainFc,
      name:'createfc',
    },
  ]
});

var app = new Vue({
  el: '#app',
  router:router,
  template: '<App/>',
  components: { App }
})
