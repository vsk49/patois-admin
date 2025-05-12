<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ErrorPopup from './components/ErrorPopup.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useMotsStore } from '@/stores/MotsStore'
import { usePhrasesStore } from '@/stores/PhrasesStore'
import { useDiscussionsStore } from '@/stores/DiscussionStore'
import { useRessourcesStore } from '@/stores/RessourcesStore'

const route = useRoute()
const isDark = ref(false)

// Stores
const motsStore = useMotsStore()
const phrasesStore = usePhrasesStore()
const discussionsStore = useDiscussionsStore()
const ressourcesStore = useRessourcesStore()

// Central error state (combine all errors)
const errorMessage = computed(() =>
  motsStore.error || phrasesStore.error || discussionsStore.error || ressourcesStore.error || ''
)
const showError = ref(false)

watch(errorMessage, (val) => {
  showError.value = !!val
})

// Reset error in all stores when popup closes
function closeError() {
  motsStore.error = null
  phrasesStore.error = null
  discussionsStore.error = null
  ressourcesStore.error = null
  showError.value = false
}

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
  <ErrorPopup
    v-if="route.path !== '/'"
    :show="showError"
    :message="errorMessage"
    @close="closeError"
  />
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
