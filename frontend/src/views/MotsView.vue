<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMotsStore } from '@/stores/MotsStore'

const motsStore = useMotsStore()
const { mots, loading, error, fetchMots, addMot, updateMot, deleteMot } = motsStore

const search = ref('')
const newMotFr = ref('')
const newMotPa = ref('')
const editId = ref(null)
const editMotFr = ref('')
const editMotPa = ref('')

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
})

function startEdit(mot) {
  editId.value = mot.idmot
  editMotFr.value = mot.motfrancais
  editMotPa.value = mot.motpatois
}

function cancelEdit() {
  editId.value = null
  editMotFr.value = ''
  editMotPa.value = ''
}

async function saveEdit() {
  await updateMot(editId.value, editMotFr.value, editMotPa.value)
  cancelEdit()
}

async function handleAdd() {
  await addMot(newMotFr.value, newMotPa.value)
  newMotFr.value = ''
  newMotPa.value = ''
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
      <button type="submit">Ajouter</button>
    </form>

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Mot</th>
          <th>Patois</th>
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
          <td>
            <template v-if="editId === mot.idmot">
              <button @click="saveEdit">Enregistrer</button>
              <button @click="cancelEdit">Annuler</button>
            </template>
            <template v-else>
              <button @click="startEdit(mot)">Modifier</button>
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
}
.search-bar {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.add-form input {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.add-form button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #9c88ff;
  color: #fff;
  cursor: pointer;
}
.add-form button:hover {
  background: #7c5fff;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
th {
  background: #f0f0f0;
}
button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
}
button:hover {
  background: #bdbdbd;
}
</style>