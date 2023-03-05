import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Antd
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
Vue.use(Antd);

// 增加混入
import shareUtils from "@/mixins/utils";
Vue.mixin(shareUtils);

// 过滤器
import * as filters from './utils/util'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

import 'nprogress/nprogress.css'

import {
    iconfontUrl,
    iconfontVersion
} from '@/utils/config'
import {
    loadStyle
} from './utils/util'
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele))
})

// 导入语言包
import i18n from '../public/languages/i18n'

Vue.config.productionTip = false
new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }
}).$mount('#app')