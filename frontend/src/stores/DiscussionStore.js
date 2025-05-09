import { ref } from 'vue'
import { defineStore } from 'pinia'

// URL de base de l'API backend
const API_URL = 'http://localhost:3000'

// Définition du store Pinia pour la gestion des discussions
export const useDiscussionsStore = defineStore('discussions', () => {
  // Liste des discussions
  const discussions = ref([])
  // Indicateur de chargement
  const loading = ref(false)
  // Message d'erreur éventuel
  const error = ref(null)

  // Récupère toutes les discussions depuis l'API
  async function fetchDiscussions() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/discussions`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors du chargement')
      discussions.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Ajoute une nouvelle discussion via l'API
  async function addDiscussion(nomdiscussion) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nomdiscussion })
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const result = await res.json()
      // Ajoute la discussion à la liste locale
      discussions.value.push(result.discussion || result)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Met à jour une discussion existante via l'API
  async function updateDiscussion(iddiscussion, nomdiscussion) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/discussions/${iddiscussion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nomdiscussion })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      const result = await res.json()
      // Met à jour la discussion dans la liste locale
      const idx = discussions.value.findIndex(d => d.iddiscussion === iddiscussion)
      if (idx !== -1) {
        discussions.value[idx] = result.discussion || { iddiscussion, nomdiscussion }
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Supprime une discussion via l'API
  async function deleteDiscussion(iddiscussion) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/discussions/${iddiscussion}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      // Retire la discussion de la liste locale
      discussions.value = discussions.value.filter(d => d.iddiscussion !== iddiscussion)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { discussions, loading, error, fetchDiscussions, addDiscussion, updateDiscussion, deleteDiscussion }
})