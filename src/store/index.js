/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2021-09-11 15:14:29
 * @LastEditors: Please set LastEditors
 * @Description: Vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import common from './modules/common'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    common
  },
  getters
})

export default store
