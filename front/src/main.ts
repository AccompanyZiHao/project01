import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import http from './util/http';

const app = createApp(App);
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 });
app.use(store, key)
app.provide('http', http);
app.mount('#app')
