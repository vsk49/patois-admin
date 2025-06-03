import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

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
      const res = await axios.get(`${API_URL}/mots`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      mots.value = res.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      let img = formatImagePath(cheminimage);
      let audio = formatAudioPath(cheminaudio);
      await axios.post(`${API_URL}/mots`, {
        motfrancais, motpatois, cheminimage: img, cheminaudio: audio
      }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchMots() // <-- Rafraîchit la liste après ajout
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      let img = formatImagePath(cheminimage);
      let audio = formatAudioPath(cheminaudio);
      await axios.put(`${API_URL}/mots/${idmot}`, {
        motfrancais, motpatois, cheminimage: img, cheminaudio: audio
      }, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchMots() // <-- Rafraîchit la liste après modification
    } catch (e) {
      error.value = e.response?.data?.message || e.message
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
      await axios.delete(`${API_URL}/mots/${idmot}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      await fetchMots() // <-- Rafraîchit la liste après suppression
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  // Utilise les mêmes fonctions de formatage que dans addMot
  function formatImagePath(path) {
    if (!path) return '';
    return path.startsWith('assets/')
      ? path
      : `assets/${path.replace(/^assets\//, '').replace(/\.png$/, '')}.png`;
  }

  function formatAudioPath(path) {
    if (!path) return '';
    if (path.startsWith('audio/')) {
      return path.replace(/\s+/g, '_');
    } else {
      return `audio/${path.replace(/\s+/g, '_').replace(/^audio\//, '').replace(/\.mp3$/, '')}.mp3`;
    }
  }

  // Expose les états et méthodes du store
  return { mots, loading, error, fetchMots, addMot, updateMot, deleteMot }
})