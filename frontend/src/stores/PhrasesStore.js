import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const usePhrasesStore = defineStore('phrases', () => {
  const phrases = ref([])
  const loading = ref(false)
  const error = ref(null)

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

  async function addPhrase(phrasefrancais, phrasepatois, cheminaudio, iddiscussion) {
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
      phrases.value.push(newPhrase)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

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
      const res = await fetch(`${API_URL}/phrases/${idphrase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ phrasefrancais, phrasepatois, cheminaudio: audio, iddiscussion })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
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
      phrases.value = phrases.value.filter(p => p.idphrase !== idphrase)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { phrases, loading, error, fetchPhrases, addPhrase, updatePhrase, deletePhrase }
})