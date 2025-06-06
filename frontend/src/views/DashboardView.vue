<script setup>
import { onMounted } from 'vue'
import { useMotsStore } from '@/stores/MotsStore'
import { usePhrasesStore } from '@/stores/PhrasesStore'
import { useDiscussionsStore } from '@/stores/DiscussionStore'
import { useRessourcesStore } from '@/stores/RessourcesStore'

const motsStore = useMotsStore()
const phrasesStore = usePhrasesStore()
const discussionsStore = useDiscussionsStore()
const ressourcesStore = useRessourcesStore()

onMounted(async () => {
  await motsStore.fetchMots()
  await phrasesStore.fetchPhrases()
  await discussionsStore.fetchDiscussions()
  await ressourcesStore.fetchRessources()
})

const mainMargin = '275px'
</script>

<template>
  <div class="presentation-root">
    <div class="presentation-container">
      <div class="presentation-content">
        <h1 style="text-align: center;">Langue Savoyarde Admin Interface</h1>
        <p class="subtitle">Bienvenue dans le panneau d'administration pour la gestion de la base de données de notre application.</p>
        <div class="spacer" style="height:40px"></div>
        <p class="description">
          Cette interface vous permettra prochainement de gérer les mots de la base de données, d'ajouter, modifier ou supprimer des données liées à la langue savoyarde.<br><br>
          Merci de votre confiance.<br>
          <span class="signature">L'équipe Langue Savoyarde</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.presentation-root {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: v-bind(mainMargin);
}
.presentation-container {
  max-width: 600px;
  width: 100%;
  padding: 40px 32px;
  background: var(--container-bg);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  position: relative;
}
.presentation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--primary);
  font-family: Arial, sans-serif;
}
.subtitle {
  font-size: 18px;
  color: var(--subtitle);
  margin-bottom: 0;
  font-family: Arial, sans-serif;
  text-align: center;
}
.description {
  font-size: 18px;
  color: var(--text);
  text-align: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}
.signature {
  display: block;
  margin-top: 24px;
  font-size: 16px;
  color: var(--primary);
  font-weight: bold;
  font-family: Arial, sans-serif;
}
.spacer {
  width: 100%;
}
.mots-view {
  background: var(--background);
  color: var(--text);
}
.add-form, table {
  background: var(--container-bg);
}
.search-bar, .add-form input, input[type="text"], input[type="password"] {
  background: var(--input-bg);
  border-color: var(--input-border);
  color: var(--text);
}
th {
  background: var(--table-header);
  color: var(--primary-dark);
}
tbody tr:hover {
  background: var(--table-row-hover);
}
</style>
