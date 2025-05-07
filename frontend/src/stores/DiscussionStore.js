import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useDiscussionsStore = defineStore('discussions', () => {
  const discussions = ref([])
  const loading = ref(false)
  const error = ref(null)

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
      discussions.value.push(result.discussion || result)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

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
      discussions.value = discussions.value.filter(d => d.iddiscussion !== iddiscussion)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { discussions, loading, error, fetchDiscussions, addDiscussion, updateDiscussion, deleteDiscussion }
})