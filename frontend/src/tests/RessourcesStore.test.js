/* 
 * These unit tests verify store logic in isolation using mocks, without database interaction.
 * This approach provides faster, more reliable tests that can simulate both success and error 
 * scenarios. We mock axios to prevent real HTTP requests and simulate API responses. While not 
 * testing actual database operations, these tests ensure correct request formatting, response 
 * handling, and state management. For complete coverage, separate integration tests with a real 
 * database would be needed, but these unit tests provide a solid foundation for development.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRessourcesStore } from '@/stores/RessourcesStore'
import axios from 'axios'

// Mock axios
vi.mock('axios')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockImplementation(() => 'fake-token'),
  setItem: vi.fn(),
  clear: vi.fn()
}
vi.stubGlobal('localStorage', localStorageMock)

describe('RessourcesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: [] })
    axios.post.mockResolvedValue({ data: { id: 1 } })
    axios.put.mockResolvedValue({ data: {} })
    axios.delete.mockResolvedValue({ data: {} })
  })

  describe('State', () => {
    it('should have empty initial state', () => {
      const store = useRessourcesStore()
      expect(store.ressources).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('fetchRessources', () => {
    it('should fetch ressources successfully', async () => {
      const mockRessources = [
        { idressource: 1, nomressource: 'Document 1', typeressource: 'pdf', contenu: 'Content 1', cheminimage: 'image1.jpg', cheminaudio: 'audio1.mp3' }
      ]
      axios.get.mockResolvedValueOnce({ data: mockRessources })

      const store = useRessourcesStore()
      await store.fetchRessources()

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/ressources', {
        headers: { 'Authorization': 'Bearer fake-token' }
      })
      expect(store.ressources).toEqual(mockRessources)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when fetching ressources', async () => {
      const errorMessage = 'Network Error'
      axios.get.mockRejectedValueOnce({ message: errorMessage })

      const store = useRessourcesStore()
      await store.fetchRessources()

      expect(store.ressources).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('addRessource', () => {
    it('should add a ressource successfully', async () => {
      const mockRessources = [
        { idressource: 1, nomressource: 'Document 1', typeressource: 'pdf', contenu: 'Content 1', cheminimage: 'image1.jpg', cheminaudio: 'audio1.mp3' }
      ]
      axios.get.mockResolvedValueOnce({ data: mockRessources })

      const store = useRessourcesStore()
      await store.addRessource('Document 1', 'pdf', 'Content 1', 'image1.jpg', 'audio1.mp3')

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/ressources',
        { nomressource: 'Document 1', typeressource: 'pdf', contenu: 'Content 1', cheminimage: 'image1.jpg', cheminaudio: 'audio1.mp3' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      expect(store.ressources).toEqual(mockRessources)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when adding a ressource', async () => {
      const errorMessage = 'Invalid data'
      axios.post.mockRejectedValueOnce({ message: errorMessage })

      const store = useRessourcesStore()
      await store.addRessource('Document 1', 'pdf', 'Content 1', 'image1.jpg', 'audio1.mp3')

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

    describe('updateRessource', () => {
    it('should update a ressource successfully', async () => {
        const mockRessources = [
        { idressource: 1, nomressource: 'Updated Document', typeressource: 'pdf', contenu: 'Updated Content', cheminimage: 'updated.jpg', cheminaudio: 'updated.mp3' }
        ]
        axios.get.mockResolvedValueOnce({ data: mockRessources })

        const store = useRessourcesStore()
        await store.updateRessource(1, 'Updated Document', 'pdf', 'Updated Content', 'updated.jpg', 'updated.mp3')

        expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/ressources/1',
        { nomressource: 'Updated Document', typeressource: 'pdf', contenu: 'Updated Content', cheminimage: 'updated.jpg', cheminaudio: 'updated.mp3' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
        )
        expect(store.ressources).toEqual(mockRessources)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
    })

    it('should handle errors when updating a ressource', async () => {
        const errorMessage = 'Ressource not found'
        axios.put.mockRejectedValueOnce({ message: errorMessage })

        const store = useRessourcesStore()
        await store.updateRessource(999, 'Updated Document', 'pdf', 'Updated Content', 'updated.jpg', 'updated.mp3')

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
    })
  })

  describe('deleteRessource', () => {
    it('should delete a ressource successfully', async () => {
        const mockRessources = []
        axios.get.mockResolvedValueOnce({ data: mockRessources })

        const store = useRessourcesStore()
        await store.deleteRessource(1)

        expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:3000/ressources/1',
        { headers: { 'Authorization': 'Bearer fake-token' } }
        )
        expect(store.ressources).toEqual(mockRessources)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
    })

    it('should handle errors when deleting a ressource', async () => {
        const errorMessage = 'Permission denied'
        axios.delete.mockRejectedValueOnce({ message: errorMessage })

        const store = useRessourcesStore()
        await store.deleteRessource(1)

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
    })
  })

  describe('Error Handling', () => {
    it('should handle error response with data message', async () => {
        const errorResponse = {
        response: {
            data: {
            message: 'Server error message'
            }
        }
        }
        axios.get.mockRejectedValueOnce(errorResponse)

        const store = useRessourcesStore()
        await store.fetchRessources()

        expect(store.error).toBe('Server error message')
    })
  })
})