import { createApp } from 'vue'
import Root from './Root.vue'
import {store} from "@/store";
import router from "@/router.js";
import ElementPlus from 'element-plus';
import './assets/styles/app.scss'
// import 'element-plus/lib/theme-chalk/index.css';

createApp(Root)
   .use(ElementPlus)
   .use(store)
   .use(router)
   .mount('#app')
