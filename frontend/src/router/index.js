import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import MotsView from '../views/MotsView.vue'
import PhrasesDiscussionView from '../views/PhrasesDiscussionsView.vue'
import RessourcesView from '../views/RessourcesView.vue'

// Dummy authentication check (replace with your real logic)
function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mots',
      name: 'mots',
      component: MotsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/phrases',
      name: 'phrases',
      component: PhrasesDiscussionView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ressources',
      name: 'ressources',
      component: RessourcesView,
      meta: { requiresAuth: true },
    }
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
