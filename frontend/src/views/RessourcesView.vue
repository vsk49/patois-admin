<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRessourcesStore } from '@/stores/RessourcesStore'

const ressourcesStore = useRessourcesStore()

const search = ref('')
const newNom = ref('')
const newType = ref('')
const newContenu = ref('')
const newCheminImage = ref('')
const newCheminAudio = ref('')
const editId = ref(null)
const editNom = ref('')
const editType = ref('')
const editContenu = ref('')
const editCheminImage = ref('')
const editCheminAudio = ref('')

const filteredRessources = computed(() => {
  if (!search.value) return ressourcesStore.ressources
  const s = search.value.toLowerCase()
  return ressourcesStore.ressources.filter(
    r =>
      r.nomressource?.toLowerCase().includes(s) ||
      r.typeressource?.toLowerCase().includes(s) ||
      r.contenu?.toLowerCase().includes(s)
  )
})

const groupedRessources = computed(() => {
  const groups = {}
  filteredRessources.value.forEach(r => {
    const type = r.typeressource || 'Aucun type'
    if (!groups[type]) groups[type] = []
    groups[type].push(r)
  })
  return groups
})

const uniqueTypes = computed(() => {
  const types = ressourcesStore.ressources.map(r => r.typeressource).filter(Boolean)
  return [...new Set(types)]
})

onMounted(async () => {
  await ressourcesStore.fetchRessources()
})

function startEdit(ressource) {
  editId.value = ressource.idressource
  editNom.value = ressource.nomressource
  editType.value = ressource.typeressource
  editContenu.value = ressource.contenu
  editCheminImage.value = ressource.cheminimage || ''
  editCheminAudio.value = ressource.cheminaudio || ''
}

function cancelEdit() {
  editId.value = null
  editNom.value = ''
  editType.value = ''
  editContenu.value = ''
  editCheminImage.value = ''
  editCheminAudio.value = ''
}

async function saveEdit() {
  await ressourcesStore.updateRessource(
    editId.value,
    editNom.value,
    editType.value,
    editContenu.value,
    editCheminImage.value,
    editCheminAudio.value
  )
  cancelEdit()
}

async function handleAdd() {
  await ressourcesStore.addRessource(
    newNom.value,
    newType.value,
    newContenu.value,
    newCheminImage.value,
    newCheminAudio.value
  )
  newNom.value = ''
  newType.value = ''
  newContenu.value = ''
  newCheminImage.value = ''
  newCheminAudio.value = ''
}
</script>

<template>
  <div class="page-root">
    <section class="card-section">
      <h1>Ressources</h1>
      <input
        v-model="search"
        class="search-bar"
        type="text"
        placeholder="Rechercher une ressource..."
      />

      <button @click="ressourcesStore.fetchRessources" style="margin-bottom:1rem;">Rafraîchir</button>

      <form @submit.prevent="handleAdd" class="add-form">
        <input v-model="newNom" placeholder="Nom" required />
        <select v-model="newType" class="discussion-select" required>
          <option value="">Aucun type</option>
          <option v-for="type in uniqueTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <input v-model="newContenu" placeholder="Contenu" />
        <input v-model="newCheminImage" placeholder="Chemin image" />
        <input v-model="newCheminAudio" placeholder="Chemin audio" />
        <button type="submit">Ajouter</button>
      </form>

      <button @click="ressourcesStore.fetchRessources" style="margin-bottom:1rem;">Rafraîchir</button>

      <div v-if="ressourcesStore.loading" class="info-msg">Chargement...</div>
      <div v-if="ressourcesStore.error" class="error-msg">{{ ressourcesStore.error }}</div>

      <div v-for="(ressourcesGroup, type) in groupedRessources" :key="type" style="margin-bottom:2rem;">
        <h2 class="type-title">{{ type }}</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Contenu</th>
              <th>Image</th>
              <th>Audio</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ressource in ressourcesGroup" :key="ressource.idressource">
              <td>{{ ressource.idressource }}</td>
              <td v-if="editId !== ressource.idressource">{{ ressource.nomressource }}</td>
              <td v-else><input v-model="editNom" /></td>

              <td v-if="editId !== ressource.idressource">
                <span v-if="ressource.idressource">
                  {{ ressourcesStore.ressources.find(r => r.idressource === ressource.idressource)?.typeressource || '_' }}
                </span>
                <span v-else>_</span>
              </td>
              <td v-else>
                <select v-model="editType" class="discussion-select">
                  <option value="">Aucun type</option>
                  <option v-for="type in uniqueTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </td>
              <td v-if="editId !== ressource.idressource">{{ ressource.contenu }}</td>
              <td v-else><input v-model="editContenu" /></td>
              <td v-if="editId !== ressource.idressource">{{ ressource.cheminimage }}</td>
              <td v-else><input v-model="editCheminImage" /></td>
              <td v-if="editId !== ressource.idressource">{{ ressource.cheminaudio }}</td>
              <td v-else><input v-model="editCheminAudio" /></td>
              <td>
                <template v-if="editId === ressource.idressource">
                  <button @click="saveEdit">Enregistrer</button>
                  <button @click="cancelEdit">Annuler</button>
                </template>
                <template v-else>
                  <button class="modifier-btn" @click="startEdit(ressource)">Modifier</button>
                  <button @click="ressourcesStore.deleteRessource(ressource.idressource)">Supprimer</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
.type-title {
  color: #e53935;
  margin-bottom: 0.7rem;
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