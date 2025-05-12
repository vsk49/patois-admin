<template>
  <div v-if="show" class="error-popup" :class="{ dark: isDark }" @click.self="close">
    <div class="error-content">
      <span class="error-title">Erreur</span>
      <p class="error-message">{{ message }}</p>
      <button class="close-btn" @click="close">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

// Détecte le mode sombre à partir de l'attribut data-theme sur <html>
const isDark = ref(false)
function updateDark() {
  isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
}
onMounted(() => {
  updateDark()
  // Observe les changements de l'attribut data-theme
  const observer = new MutationObserver(updateDark)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})
watch(() => props.show, (val) => {
  if (val) {
    setTimeout(() => {
      emit('close')
    }, 5000)
  }
})
</script>

<style scoped>
.error-popup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.error-popup.dark {
  background: rgba(0,0,0,0.55);
}
.error-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(229,57,53,0.18);
  padding: 2rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
  border: 2px solid #e53935;
  color: #222;
}
.error-popup.dark .error-content {
  background: #232323;
  color: #fff;
  border-color: #ff8a80;
}
.error-title {
  color: #e53935;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 0.7rem;
  display: block;
}
.error-popup.dark .error-title {
  color: #ff8a80;
}
.error-message {
  color: #b71c1c;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}
.error-popup.dark .error-message {
  color: #ff8a80;
}
.close-btn {
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #b71c1c;
}
.error-popup.dark .close-btn {
  background: #ff8a80;
  color: #232323;
}
.error-popup.dark .close-btn:hover {
  background: #e53935;
  color: #fff;
}
</style>