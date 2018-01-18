import Vue from 'vue'
import App from './App.vue'
import './assets/bootstrap-3.3.7-dist/css/bootstrap.min.css'
window._ = require('lodash');
let my_vue = new Vue({
    el: '#app',
    render: h => h(App)
});
