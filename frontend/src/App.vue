<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { ref, onMounted, watch } from 'vue'

const route = useRoute()
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '')
}

// Optional: persist theme
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
watch(isDark, val => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
  <nav v-if="route.path !== '/'">
    <NavBar />
  </nav>
  <RouterView />
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
</style>
