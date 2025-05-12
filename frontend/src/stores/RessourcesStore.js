import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

// URL de base de l'API backend
const API_URL = 'http://localhost:3000'

// Définition du store Pinia pour la gestion des ressources
export const useRessourcesStore = defineStore('ressources', () => {
  // Liste des ressources
  const ressources = ref([])
  // Indicateur de chargement
  const loading = ref(false)
  // Message d'erreur éventuel
  const error = ref(null)

  // Récupère toutes les ressources depuis l'API
  async function fetchRessources() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await axios.get(`${API_URL}/ressources`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      ressources.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Ajoute une nouvelle ressource via l'API
  async function addRessource(nomressource, typeressource, contenu, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API_URL}/ressources`, {
        nomressource, typeressource, contenu, cheminimage, cheminaudio
      }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      await fetchRessources() // Rafraîchit la liste après ajout
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Met à jour une ressource existante via l'API
  async function updateRessource(idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      await axios.put(`${API_URL}/ressources/${idressource}`, {
        nomressource, typeressource, contenu, cheminimage, cheminaudio
      }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      await fetchRessources() // Rafraîchit la liste après modification
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Supprime une ressource via l'API
  async function deleteRessource(idressource) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_URL}/ressources/${idressource}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      await fetchRessources() // Rafraîchit la liste après suppression
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { ressources, loading, error, fetchRessources, addRessource, updateRessource, deleteRessource }
})