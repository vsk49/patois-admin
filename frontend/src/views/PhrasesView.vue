<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePhrasesStore } from '@/stores/PhrasesStore'

const phrasesStore = usePhrasesStore()
const { phrases, loading, error, fetchPhrases, addPhrase, updatePhrase, deletePhrase } = phrasesStore

const search = ref('')
const newPhraseFr = ref('')
const newPhrasePa = ref('')
const newCheminAudio = ref('')
const newIdDiscussion = ref('')
const editId = ref(null)
const editPhraseFr = ref('')
const editPhrasePa = ref('')
const editCheminAudio = ref('')
const editIdDiscussion = ref('')

const filteredPhrases = computed(() => {
  if (!search.value) return phrases
  const s = search.value.toLowerCase()
  return phrases.filter(
    phrase =>
      phrase.phrasefrancais?.toLowerCase().includes(s) ||
      phrase.phrasepatois?.toLowerCase().includes(s)
  )
})

onMounted(async () => {
  await fetchPhrases()
  console.log('Phrases fetched:', phrases)
})

function startEdit(phrase) {
  editId.value = phrase.idphrase
  editPhraseFr.value = phrase.phrasefrancais
  editPhrasePa.value = phrase.phrasepatois
  editCheminAudio.value = phrase.cheminaudio || ''
  editIdDiscussion.value = phrase.iddiscussion || ''
}

function cancelEdit() {
  editId.value = null
  editPhraseFr.value = ''
  editPhrasePa.value = ''
  editCheminAudio.value = ''
  editIdDiscussion.value = ''
}

async function saveEdit() {
  await updatePhrase(
    editId.value,
    editPhraseFr.value,
    editPhrasePa.value,
    editCheminAudio.value,
    editIdDiscussion.value
  )
  cancelEdit()
}

async function handleAdd() {
  await addPhrase(
    newPhraseFr.value,
    newPhrasePa.value,
    newCheminAudio.value,
    newIdDiscussion.value
  )
  newPhraseFr.value = ''
  newPhrasePa.value = ''
  newCheminAudio.value = ''
  newIdDiscussion.value = ''
}
</script>

<template>
  <div class="mots-view">
    <h1>Liste des phrases</h1>
    <input
      v-model="search"
      class="search-bar"
      type="text"
      placeholder="Rechercher une phrase ou patois..."
    />

    <!-- Add new phrase -->
    <form @submit.prevent="handleAdd" class="add-form">
      <input v-model="newPhraseFr" placeholder="Phrase français" required />
      <input v-model="newPhrasePa" placeholder="Phrase patois" required />
      <input v-model="newCheminAudio" placeholder="Chemin audio" />
      <input v-model="newIdDiscussion" placeholder="ID discussion" />
      <button type="submit">Ajouter</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Français</th>
          <th>Patois</th>
          <th>Audio</th>
          <th>ID Discussion</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="phrase in filteredPhrases" :key="phrase.idphrase || phrase.phrasefrancais + phrase.phrasepatois">
          <td v-if="editId !== phrase.idphrase">{{ phrase.phrasefrancais }}</td>
          <td v-else>
            <input v-model="editPhraseFr" />
          </td>
          <td v-if="editId !== phrase.idphrase">{{ phrase.phrasepatois }}</td>
          <td v-else>
            <input v-model="editPhrasePa" />
          </td>
          <td v-if="editId !== phrase.idphrase">{{ phrase.cheminaudio }}</td>
          <td v-else>
            <input v-model="editCheminAudio" />
          </td>
          <td v-if="editId !== phrase.idphrase">{{ phrase.iddiscussion }}</td>
          <td v-else>
            <input v-model="editIdDiscussion" />
          </td>
          <td>
            <template v-if="editId === phrase.idphrase">
              <button @click="saveEdit">Enregistrer</button>
              <button @click="cancelEdit">Annuler</button>
            </template>
            <template v-else>
              <button class="modifier-btn" @click="startEdit(phrase)">Modifier</button>
              <button @click="deletePhrase(phrase.idphrase)">Supprimer</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* You can reuse the styles from MotsView.vue for consistency */
.mots-view {
  padding: 2rem;
  margin-left: 275px;
  background: var(--background);
  color: var(--text);
  min-height: 100vh;
}
h1 {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 1.5rem;
}
.search-bar {
  margin-bottom: 1.5rem;
  padding: 0.7rem 1.2rem;
  width: 100%;
  max-width: 400px;
  background: var(--input-bg);
  border: 1.5px solid var(--input-border);
  border-radius: 12px;
  font-size: 1.1rem;
  outline: none;
  color: var(--text);
  transition: border 0.2s;
}
.search-bar:focus {
  border-color: #b71c1c;
}
.add-form {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
  background: var(--container-bg);
  padding: 1rem 1.2rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(229,57,53,0.05);
  align-items: center;
}
.add-form input {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1.5px solid var(--input-border);
  background: var(--input-bg);
  font-size: 1rem;
  color: var(--text);
  transition: border 0.2s;
}
.add-form input:focus {
  border-color: #e53935;
}
.add-form button {
  padding: 0.6rem 1.3rem;
  border-radius: 8px;
  border: none;
  background: #e53935;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-form button:hover {
  background: #b71c1c;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--container-bg);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(229,57,53,0.06);
  overflow: hidden;
}
th, td {
  padding: 1rem 0.8rem;
  text-align: left;
}
th {
  background: var(--table-header);
  color: var(--primary-dark);
  font-size: 1.05rem;
  font-weight: bold;
  border-bottom: 2px solid #e53935;
}
tbody tr {
  transition: background 0.2s;
}
tbody tr:hover {
  background: var(--table-row-hover);
}
td {
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
  color: var(--text);
}
input[type="text"], input[type="password"] {
  background: var(--input-bg);
  border: 1.5px solid var(--input-border);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: var(--text);
  transition: border 0.2s;
}
input[type="text"]:focus, input[type="password"]:focus {
  border-color: #e53935;
}
button {
  margin-right: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: none;
  background: #e0e0e0;
  color: #b71c1c;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover {
  background: #e53935;
  color: #fff;
}
button.modifier-btn {
  color: black;
  background: #e0e0e0;
}
button.modifier-btn:hover {
  background: blue;
  color: white;
}
@media (max-width: 900px) {
  .mots-view {
    margin-left: 0;
    padding: 1rem;
  }
  .add-form {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  table, th, td {
    font-size: 0.95rem;
  }
}
</style>