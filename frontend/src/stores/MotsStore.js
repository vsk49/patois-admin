import { ref } from 'vue'
import { defineStore } from 'pinia'

// URL de base de l'API backend
const API_URL = 'http://localhost:3000'

// Définition du store Pinia pour la gestion des mots
export const useMotsStore = defineStore('mots', () => {
  // Liste des mots
  const mots = ref([])
  // Indicateur de chargement
  const loading = ref(false)
  // Message d'erreur éventuel
  const error = ref(null)

  // Récupère tous les mots depuis l'API
  async function fetchMots() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/mots`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors du chargement')
      mots.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Ajoute un nouveau mot via l'API
  async function addMot(motfrancais, motpatois, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      // Formate le chemin de l'image
      const img = cheminimage
        ? cheminimage.startsWith('assets/') ? cheminimage : `assets/${cheminimage.replace(/^assets\//, '').replace(/\.png$/, '')}.png`
        : ''
      // Formate le chemin de l'audio
      const audio = cheminaudio
        ? (
            cheminaudio.startsWith('audio/')
              ? cheminaudio.replace(/\s+/g, '_')
              : `audio/${cheminaudio.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
          )
        : ''

      const res = await fetch(`${API_URL}/mots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ motfrancais, motpatois, cheminimage: img, cheminaudio: audio })
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newMot = await res.json()
      // Ajoute le mot à la liste locale
      mots.value.push({
        idmot: newMot.idmot || newMot.id,
        motfrancais: newMot.motfrancais,
        motpatois: newMot.motpatois,
        cheminimage: newMot.cheminimage,
        cheminaudio: newMot.cheminaudio
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Met à jour un mot existant via l'API
  async function updateMot(idmot, motfrancais, motpatois, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      // Formate le chemin de l'image
      const img = cheminimage
        ? cheminimage.startsWith('assets/') ? cheminimage : `assets/${cheminimage.replace(/^assets\//, '').replace(/\.png$/, '')}.png`
        : ''
      // Formate le chemin de l'audio
      const audio = cheminaudio
        ? (
            cheminaudio.startsWith('audio/')
              ? cheminaudio.replace(/\s+/g, '_')
              : `audio/${cheminaudio.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
          )
        : ''

      const res = await fetch(`${API_URL}/mots/${idmot}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ motfrancais, motpatois, cheminimage: img, cheminaudio: audio })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      // Met à jour le mot dans la liste locale
      const idx = mots.value.findIndex(m => m.idmot === idmot)
      if (idx !== -1) {
        mots.value[idx] = { idmot, motfrancais, motpatois, cheminimage: img, cheminaudio: audio }
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Supprime un mot via l'API
  async function deleteMot(idmot) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${API_URL}/mots/${idmot}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      // Retire le mot de la liste locale
      mots.value = mots.value.filter(m => m.idmot !== idmot)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Expose les états et méthodes du store
  return { mots, loading, error, fetchMots, addMot, updateMot, deleteMot }
})