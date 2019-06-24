import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import {firestorePlugin} from 'vuefire'
Vue.use(firestorePlugin);

import config from '@/config.js'
import firebase from 'firebase';
firebase.initializeApp(config);
Vue.prototype.$firebase = firebase;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
