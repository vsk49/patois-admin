<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
      <nav v-if="route.path !== '/login'">
        <NavBar />
      </nav>
      <RouterView />
</template>

<style scoped>
</style>
