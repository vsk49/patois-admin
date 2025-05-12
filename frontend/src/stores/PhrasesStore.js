import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

// URL de base de l'API backend
const API_URL = 'http://localhost:3000'

// Définition du store Pinia pour la gestion des phrases
export const usePhrasesStore = defineStore('phrases', () => {
  // Liste des phrases
  const phrases = ref([])
  // Indicateur de chargement
  const loading = ref(false)
  // Message d'erreur éventuel
  const error = ref(null)

  // Récupère toutes les phrases depuis l'API
  async function fetchPhrases() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await axios.get(`${API_URL}/phrases`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      phrases.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Ajoute une nouvelle phrase via l'API
  async function addPhrase(phrasefrancais, phrasepatois, cheminaudio, iddiscussion) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      // Formate le chemin de l'audio
      const audio = cheminaudio
        ? (
            cheminaudio.startsWith('audio/')
              ? cheminaudio.replace(/\s+/g, '_')
              : `audio/${cheminaudio.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
          )
        : ''
      await axios.post(`${API_URL}/phrases`, {
        phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion
      }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchPhrases() // Rafraîchit la liste après ajout
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Met à jour une phrase existante via l'API
  async function updatePhrase(idphrase, phrasefrancais, phrasepatois, cheminaudio, iddiscussion) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const audio = cheminaudio
        ? (
            cheminaudio.startsWith('audio/')
              ? cheminaudio.replace(/\s+/g, '_')
              : `audio/${cheminaudio.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
          )
        : ''
      await axios.put(`${API_URL}/phrases/${idphrase}`, {
        phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion
      }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchPhrases() // Rafraîchit la liste après modification
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Supprime une phrase via l'API
  async function deletePhrase(idphrase) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_URL}/phrases/${idphrase}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchPhrases() // Rafraîchit la liste après suppression
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { phrases, loading, error, fetchPhrases, addPhrase, updatePhrase, deletePhrase }
})