import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Rendez axios disponible globalement si besoin :
app.config.globalProperties.$axios = axios

app.mount('#app')
