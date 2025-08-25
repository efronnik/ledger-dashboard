import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transactions from '../views/Transactions.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dashboard', component: Dashboard },
    { path: '/send', component: Transactions },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' } // редирект на dashboard по умолчанию
  ]
})

export default router
