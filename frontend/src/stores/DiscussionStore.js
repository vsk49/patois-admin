import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

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
      const res = await axios.get(`${API_URL}/discussions`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      discussions.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      await axios.post(`${API_URL}/discussions`, { nomdiscussion }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchDiscussions() // Rafraîchit la liste après ajout
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      await axios.put(`${API_URL}/discussions/${iddiscussion}`, { nomdiscussion }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchDiscussions() // Rafraîchit la liste après modification
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      await axios.delete(`${API_URL}/discussions/${iddiscussion}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchDiscussions() // Rafraîchit la liste après suppression
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { discussions, loading, error, fetchDiscussions, addDiscussion, updateDiscussion, deleteDiscussion }
})