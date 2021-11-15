import Vue from 'vue';
import { LayoutPlugin } from 'bootstrap-vue'
import { BContainer } from 'bootstrap-vue'
Vue.component('b-container', BContainer)


import { TabsPlugin } from 'bootstrap-vue'
Vue.use(TabsPlugin)

Vue.use(LayoutPlugin)