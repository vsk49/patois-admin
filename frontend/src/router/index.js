import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import MotsView from '../views/MotsView.vue'

// Dummy authentication check (replace with your real logic)


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      //meta: { requiresAuth: true },
    },
    {
      path: '/mots',
      name: 'mots',
      component: MotsView,
      //meta: { requiresAuth: true },
    }
  ],
})

/*function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})*/

export default router
