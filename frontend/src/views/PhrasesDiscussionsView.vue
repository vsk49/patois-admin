<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePhrasesStore } from '@/stores/PhrasesStore'
import { useDiscussionsStore } from '@/stores/DiscussionStore'

const phrasesStore = usePhrasesStore()
const { phrases, loading, error, fetchPhrases, addPhrase, updatePhrase, deletePhrase } = phrasesStore

const discussionsStore = useDiscussionsStore()
const { discussions, loading: loadingDiscussions, error: errorDiscussions, fetchDiscussions, addDiscussion, updateDiscussion, deleteDiscussion } = discussionsStore

const search = ref('')
const newPhraseFr = ref('')
const newPhrasePa = ref('')
const newCheminAudio = ref('')
const newIdDiscussion = ref('')
const newDiscussion = ref('')
const editId = ref(null)
const editPhraseFr = ref('')
const editPhrasePa = ref('')
const editCheminAudio = ref('')
const editIdDiscussion = ref('')
const editDiscussionId = ref(null)
const editDiscussionName = ref('')

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
  await fetchDiscussions()
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

function startEditDiscussion(discussion) {
  editDiscussionId.value = discussion.iddiscussion
  editDiscussionName.value = discussion.nomdiscussion
}

function cancelEditDiscussion() {
  editDiscussionId.value = null
  editDiscussionName.value = ''
}

async function saveEditDiscussion() {
  await updateDiscussion(editDiscussionId.value, editDiscussionName.value)
  cancelEditDiscussion()
}

async function handleAddDiscussion() {
  await addDiscussion(newDiscussion.value)
  newDiscussion.value = ''
}
</script>

<template>
  <div class="page-root">
    <section class="card-section">
      <h1>Phrases</h1>
      <input
        v-model="search"
        class="search-bar"
        type="text"
        placeholder="Rechercher une phrase ou patois..."
      />

      <form @submit.prevent="handleAdd" class="add-form">
        <input v-model="newPhraseFr" placeholder="Phrase français" required />
        <input v-model="newPhrasePa" placeholder="Phrase patois" required />
        <input v-model="newCheminAudio" placeholder="Chemin audio" />
        <select v-model="newIdDiscussion" class="discussion-select">
          <option value="">Aucune discussion</option>
          <option v-for="d in discussions" :key="d.iddiscussion" :value="d.iddiscussion">
            {{ d.nomdiscussion }}
          </option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      <div v-if="loading" class="info-msg">Chargement...</div>
      <div v-if="error" class="error-msg">{{ error }}</div>

      <table>
        <thead>
          <tr>
            <th>Français</th>
            <th>Patois</th>
            <th>Audio</th>
            <th>Discussion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="phrase in filteredPhrases" :key="phrase.idphrase">
            <td v-if="editId !== phrase.idphrase">{{ phrase.phrasefrancais }}</td>
            <td v-else><input v-model="editPhraseFr" /></td>
            <td v-if="editId !== phrase.idphrase">{{ phrase.phrasepatois }}</td>
            <td v-else><input v-model="editPhrasePa" /></td>
            <td v-if="editId !== phrase.idphrase">{{ phrase.cheminaudio }}</td>
            <td v-else><input v-model="editCheminAudio" /></td>
            <td v-if="editId !== phrase.idphrase">
              <span v-if="phrase.iddiscussion">
                [{{ phrase.iddiscussion }}] 
                {{ discussions.find(d => d.iddiscussion == phrase.iddiscussion)?.nomdiscussion || '—' }}
              </span>
              <span v-else>—</span>
            </td>
            <td v-else>
              <select v-model="editIdDiscussion" class="discussion-select">
                <option value="">Aucune discussion</option>
                <option v-for="d in discussions" :key="d.iddiscussion" :value="d.iddiscussion">
                  {{ d.nomdiscussion }}
                </option>
              </select>
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
    </section>

    <section class="card-section discussions-section">
      <h1>Discussions</h1>
      <form @submit.prevent="handleAddDiscussion" class="add-form">
        <input v-model="newDiscussion" placeholder="Nom de la discussion" required />
        <button type="submit">Ajouter</button>
      </form>
      <div v-if="loadingDiscussions" class="info-msg">Chargement...</div>
      <div v-if="errorDiscussions" class="error-msg">{{ errorDiscussions }}</div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="discussion in discussions" :key="discussion.iddiscussion">
            <td>{{ discussion.iddiscussion }}</td>
            <td v-if="editDiscussionId !== discussion.iddiscussion">{{ discussion.nomdiscussion }}</td>
            <td v-else>
              <input v-model="editDiscussionName" />
            </td>
            <td>
              <template v-if="editDiscussionId === discussion.iddiscussion">
                <button @click="saveEditDiscussion">Enregistrer</button>
                <button @click="cancelEditDiscussion">Annuler</button>
              </template>
              <template v-else>
                <button class="modifier-btn" @click="startEditDiscussion(discussion)">Modifier</button>
                <button @click="deleteDiscussion(discussion.iddiscussion)">Supprimer</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.page-root {
  padding: 2rem;
  margin-left: 275px;
  background: var(--background);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.card-section {
  background: var(--container-bg);
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(229,57,53,0.06);
  padding: 2rem;
  margin-bottom: 2rem;
}
h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 1.2rem;
}
.search-bar {
  margin-bottom: 1.2rem;
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
  margin-bottom: 1.2rem;
  background: var(--container-bg);
  padding: 1rem 1.2rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(229,57,53,0.05);
  align-items: center;
  flex-wrap: wrap;
}
.add-form input,
.add-form select {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1.5px solid var(--input-border);
  background: var(--input-bg);
  font-size: 1rem;
  color: var(--text);
  transition: border 0.2s;
}
.add-form input:focus,
.add-form select:focus {
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
  margin-bottom: 0;
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
input[type="text"], input[type="password"], select.discussion-select {
  background: var(--input-bg);
  border: 1.5px solid var(--input-border);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: var(--text);
  transition: border 0.2s;
}
input[type="text"]:focus, input[type="password"]:focus, select.discussion-select:focus {
  border-color: #e53935;
}
button {
  min-width: 110px;      
  height: 40px;          
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  padding: 0;
  border-radius: 8px;
  border: none;
  background: #e0e0e0;
  color: #b71c1c;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-sizing: border-box;
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
.info-msg {
  color: var(--primary-dark);
  margin-bottom: 1rem;
}
.error-msg {
  color: #e53935;
  margin-bottom: 1rem;
}
@media (max-width: 900px) {
  .page-root {
    margin-left: 0;
    padding: 1rem;
  }
  .card-section {
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