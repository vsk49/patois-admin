import { ref } from 'vue'
import { defineStore } from 'pinia'

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

  // Ajoute une nouvelle ressource via l'API
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
      // Ajoute la ressource à la liste locale
      ressources.value.push(newRessource)
    } catch (e) {
      error.value = e.message
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
      const res = await fetch(`${API_URL}/ressources/${idressource}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nomressource, typeressource, contenu, cheminimage, cheminaudio })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      // Met à jour la ressource dans la liste locale
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

  // Supprime une ressource via l'API
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
      // Retire la ressource de la liste locale
      ressources.value = ressources.value.filter(r => r.idressource !== idressource)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { ressources, loading, error, fetchRessources, addRessource, updateRessource, deleteRessource }
})