import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';

axios.defaults.baseURL = 'http://localhost:3000'; // TODO change to env
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
