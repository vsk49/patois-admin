import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useRessourcesStore = defineStore('ressources', () => {
  const ressources = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchRessources() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/ressources`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors du chargement')
      ressources.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addRessource(nomressource, typeressource, contenu, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/ressources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nomressource, typeressource, contenu, cheminimage, cheminaudio })
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newRessource = await res.json()
      ressources.value.push(newRessource)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function updateRessource(idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/ressources/${idressource}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nomressource, typeressource, contenu, cheminimage, cheminaudio })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      const idx = ressources.value.findIndex(r => r.idressource === idressource)
      if (idx !== -1) {
        ressources.value[idx] = { idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio }
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function deleteRessource(idressource) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/ressources/${idressource}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      ressources.value = ressources.value.filter(r => r.idressource !== idressource)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { ressources, loading, error, fetchRessources, addRessource, updateRessource, deleteRessource }
})