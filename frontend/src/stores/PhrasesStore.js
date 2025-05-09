import { ref } from 'vue'
import { defineStore } from 'pinia'

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
      const res = await fetch(`${API_URL}/phrases`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors du chargement')
      phrases.value = await res.json()
    } catch (e) {
      error.value = e.message
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
      const res = await fetch(`${API_URL}/phrases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion })
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newPhrase = await res.json()
      // Ajoute la phrase à la liste locale
      phrases.value.push(newPhrase)
    } catch (e) {
      error.value = e.message
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
      // Formate le chemin de l'audio
      const audio = cheminaudio
        ? (
            cheminaudio.startsWith('audio/')
              ? cheminaudio.replace(/\s+/g, '_')
              : `audio/${cheminaudio.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
          )
        : ''
      const res = await fetch(`${API_URL}/phrases/${idphrase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      // Met à jour la phrase dans la liste locale
      const idx = phrases.value.findIndex(p => p.idphrase === idphrase)
      if (idx !== -1) {
        phrases.value[idx] = { idphrase, phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion }
      }
    } catch (e) {
      error.value = e.message
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
      const res = await fetch(`${API_URL}/phrases/${idphrase}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      // Retire la phrase de la liste locale
      phrases.value = phrases.value.filter(p => p.idphrase !== idphrase)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { phrases, loading, error, fetchPhrases, addPhrase, updatePhrase, deletePhrase }
})