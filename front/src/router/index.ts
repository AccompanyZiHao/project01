import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'

const routerList = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/index.vue'),
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  ...routerList
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
