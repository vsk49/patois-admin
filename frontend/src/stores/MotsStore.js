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
      const res = await fetch(`${API_URL}/mots`)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors du chargement')
      }
      mots.value = await res.json()
    } catch (e) {
      error.value = e.message || 'NetworkError when attempting to fetch resource.'
    } finally {
      loading.value = false
    }
  }

  async function addMot(motfrancais, motpatois) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/mots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motfrancais, motpatois })
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de l\'ajout')
      }
      const newMot = await res.json()
      mots.value.push(newMot)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function updateMot(idmot, motfrancais, motpatois) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/mots/${idmot}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motfrancais, motpatois })
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de la modification')
      }
      // Update local mots array
      const idx = mots.value.findIndex(m => m.idmot === idmot)
      if (idx !== -1) {
        mots.value[idx].motfrancais = motfrancais
        mots.value[idx].motpatois = motpatois
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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
      mots.value = mots.value.filter(m => m.idmot !== idmot)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { mots, loading, error, fetchMots, addMot, updateMot, deleteMot }
})