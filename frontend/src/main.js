import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Dayjs from 'vue-dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import App from './App.vue';
import router from './router';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(Dayjs);
Vue.prototype.$dayjs.extend(relativeTime);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
