import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useMotsStore = defineStore('mots', () => {
  const mots = ref([])
  const loading = ref(false)
  const error = ref(null)

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

  async function addMot(motfrancais, motpatois, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {
      const img = cheminimage
        ? cheminimage.startsWith('assets/') ? cheminimage : `assets/${cheminimage.replace(/^assets\//, '').replace(/\.png$/, '')}.png`
        : ''
      const audio = cheminaudio
        ? cheminaudio.startsWith('audio/') ? cheminaudio : `audio/${cheminaudio.replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
        : ''

      const res = await fetch(`${API_URL}/mots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motfrancais, motpatois, cheminimage: img, cheminaudio: audio })
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newMot = await res.json()
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

  async function updateMot(idmot, motfrancais, motpatois, cheminimage, cheminaudio) {
    loading.value = true
    error.value = null
    try {

      const img = cheminimage
        ? cheminimage.startsWith('assets/') ? cheminimage : `assets/${cheminimage.replace(/^assets\//, '').replace(/\.png$/, '')}.png`
        : ''
      const audio = cheminaudio
        ? cheminaudio.startsWith('audio/') ? cheminaudio : `audio/${cheminaudio.replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`
        : ''

      const res = await fetch(`${API_URL}/mots/${idmot}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motfrancais, motpatois, cheminimage: img, cheminaudio: audio })
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      // Update local mots array
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

  async function deleteMot(idmot) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/mots/${idmot}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      mots.value = mots.value.filter(m => m.idmot !== idmot)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { mots, loading, error, fetchMots, addMot, updateMot, deleteMot }
})