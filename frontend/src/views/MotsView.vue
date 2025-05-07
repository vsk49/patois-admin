<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMotsStore } from '@/stores/MotsStore'

const motsStore = useMotsStore()
const { mots, loading, error, fetchMots, addMot, updateMot, deleteMot } = motsStore

const search = ref('')
const newMotFr = ref('')
const newMotPa = ref('')
const newCheminImage = ref('')
const newCheminAudio = ref('')
const editId = ref(null)
const editMotFr = ref('')
const editMotPa = ref('')
const editCheminImage = ref('')
const editCheminAudio = ref('')

const filteredMots = computed(() => {
  if (!search.value) return mots
  const s = search.value.toLowerCase()
  return mots.filter(
    mot =>
      mot.motfrancais?.toLowerCase().includes(s) ||
      mot.motpatois?.toLowerCase().includes(s)
  )
})

onMounted(async () => {
  await fetchMots()
  console.log('Mots fetched:', mots)
})

function startEdit(mot) {
  editId.value = mot.idmot
  editMotFr.value = mot.motfrancais
  editMotPa.value = mot.motpatois
  editCheminImage.value = mot.cheminimage || ''
  editCheminAudio.value = mot.cheminaudio || ''
}

function cancelEdit() {
  editId.value = null
  editMotFr.value = ''
  editMotPa.value = ''
  editCheminImage.value = ''
  editCheminAudio.value = ''
}

async function saveEdit() {
  await updateMot(
    editId.value,
    editMotFr.value,
    editMotPa.value,
    editCheminImage.value,
    editCheminAudio.value
  )
  cancelEdit()
}

async function handleAdd() {
  await addMot(
    newMotFr.value,
    newMotPa.value,
    newCheminImage.value,
    newCheminAudio.value
  )
  newMotFr.value = ''
  newMotPa.value = ''
  newCheminImage.value = ''
  newCheminAudio.value = ''
}
</script>

<template>
  <div class="mots-view">
    <h1>Liste des mots</h1>
    <input
      v-model="search"
      class="search-bar"
      type="text"
      placeholder="Rechercher un mot ou patois..."
    />

    <!-- Add new mot -->
    <form @submit.prevent="handleAdd" class="add-form">
      <input v-model="newMotFr" placeholder="Mot français" required />
      <input v-model="newMotPa" placeholder="Mot patois" required />
      <input v-model="newCheminImage" placeholder="Chemin image" />
      <input v-model="newCheminAudio" placeholder="Chemin audio" />
      <button type="submit">Ajouter</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Mot</th>
          <th>Patois</th>
          <th>Image</th>
          <th>Audio</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mot in filteredMots" :key="mot.idmot || mot.motfrancais + mot.motpatois">
          <td v-if="editId !== mot.idmot">{{ mot.motfrancais }}</td>
          <td v-else>
            <input v-model="editMotFr" />
          </td>
          <td v-if="editId !== mot.idmot">{{ mot.motpatois }}</td>
          <td v-else>
            <input v-model="editMotPa" />
          </td>
          <td v-if="editId !== mot.idmot">{{ mot.cheminimage }}</td>
          <td v-else>
            <input v-model="editCheminImage" />
          </td>
          <td v-if="editId !== mot.idmot">{{ mot.cheminaudio }}</td>
          <td v-else>
            <input v-model="editCheminAudio" />
          </td>
          <td>
            <template v-if="editId === mot.idmot">
              <button @click="saveEdit">Enregistrer</button>
              <button @click="cancelEdit">Annuler</button>
            </template>
            <template v-else>
                <button class="modifier-btn" @click="startEdit(mot)">Modifier</button>
              <button @click="deleteMot(mot.idmot)">Supprimer</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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

/* Only the Supprimer (delete) button stays red on hover */
button:hover {
  background: #e53935;
  color: #fff;
}

/* Make the "Modifier" (edit) button blue on hover */
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